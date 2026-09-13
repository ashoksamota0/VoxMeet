import { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "../config/socket";
import toast from "react-hot-toast";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const useWebRTC = (roomId, user, onMeetingEnded, enabled = true) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const peersRef = useRef(new Map());
  const localStreamRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Initialize local camera + microphone
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      cameraStreamRef.current = stream;
      localStreamRef.current = stream;

      setLocalStream(stream);
      return stream;
    } catch (error) {
      toast.error("Could not access camera/microphone");
      console.error("Media devices access error:", error);

      // Fallback: try audio only
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        cameraStreamRef.current = audioStream;
        localStreamRef.current = audioStream;

        setLocalStream(audioStream);
        setVideoEnabled(false);

        return audioStream;
      } catch (err) {
        console.error("Audio-only fallback error:", err);
        return null;
      }
    }
  }, []);

  // Create RTCPeerConnection for a target socket
  const createPeerConnection = useCallback((targetSocketId, targetUser) => {
    if (peersRef.current.has(targetSocketId)) {
      return peersRef.current.get(targetSocketId);
    }

    const peer = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });
    }

    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          targetSocketId,
          senderSocketId: socket.id,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming remote stream tracks
    peer.ontrack = (event) => {
      const remoteStream = event.streams[0];

      setRemoteUsers((prev) => {
        const existingIndex = prev.findIndex(
          (u) => u.socketId === targetSocketId,
        );

        if (existingIndex > -1) {
          const updated = [...prev];

          updated[existingIndex] = {
            ...updated[existingIndex],
            stream: remoteStream,
          };

          return updated;
        }

        return [
          ...prev,
          {
            socketId: targetSocketId,
            userId: targetUser?.userId,
            userName: targetUser?.userName || "Participant",
            stream: remoteStream,
            audioEnabled: targetUser?.audioEnabled ?? true,
            videoEnabled: targetUser?.videoEnabled ?? true,
            screenSharing: targetUser?.screenSharing ?? false,
          },
        ];
      });
    };

    peersRef.current.set(targetSocketId, peer);

    return peer;
  }, []);

  // Main WebRTC & Socket signaling setup
  useEffect(() => {
    if (!roomId || !user || !enabled) return;

    let isMounted = true;

    const startSession = async () => {
      const stream = await initLocalStream();

      if (!isMounted) return;

      if (!socket.connected) {
        socket.connect();
      }

      // Join room
      socket.emit("join-room", {
        roomId,
        user,
        audioEnabled: true,
        videoEnabled: true,
        screenSharing: false,
      });

      // 1. Receive existing users
      socket.on("all-users", (existingUsers) => {
        existingUsers.forEach((existingUser) => {
          const peer = createPeerConnection(
            existingUser.socketId,
            existingUser,
          );

          peer
            .createOffer()
            .then((offer) => peer.setLocalDescription(offer))
            .then(() => {
              socket.emit("offer", {
                targetSocketId: existingUser.socketId,
                callerSocketId: socket.id,
                sdp: peer.localDescription,
              });
            })
            .catch((err) => console.error("Error creating offer:", err));
        });
      });

      // 2. Someone new joined
      socket.on("user-joined", (newUser) => {
        toast(`${newUser.userName} joined the meeting`, {
          icon: "👋",
        });

        createPeerConnection(newUser.socketId, newUser);
      });

      // 3. Receive offer
      socket.on("offer", async ({ callerSocketId, sdp, callerUser }) => {
        const peer = createPeerConnection(callerSocketId, callerUser);

        try {
          await peer.setRemoteDescription(new RTCSessionDescription(sdp));

          const answer = await peer.createAnswer();

          await peer.setLocalDescription(answer);

          socket.emit("answer", {
            targetSocketId: callerSocketId,
            responderSocketId: socket.id,
            sdp: peer.localDescription,
          });
        } catch (err) {
          console.error("Error handling offer:", err);
        }
      });

      // 4. Receive answer
      socket.on("answer", async ({ responderSocketId, sdp }) => {
        const peer = peersRef.current.get(responderSocketId);

        if (peer) {
          try {
            await peer.setRemoteDescription(new RTCSessionDescription(sdp));
          } catch (err) {
            console.error("Error setting remote description from answer:", err);
          }
        }
      });

      // 5. Receive ICE candidate
      socket.on("ice-candidate", async ({ senderSocketId, candidate }) => {
        const peer = peersRef.current.get(senderSocketId);

        if (peer && candidate) {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        }
      });

      // 6. Remote audio toggle
      socket.on("user-toggled-audio", ({ socketId, audioEnabled }) => {
        setRemoteUsers((prev) =>
          prev.map((u) =>
            u.socketId === socketId
              ? {
                  ...u,
                  audioEnabled,
                }
              : u,
          ),
        );
      });

      // 7. Remote video toggle
      socket.on("user-toggled-video", ({ socketId, videoEnabled }) => {
        setRemoteUsers((prev) =>
          prev.map((u) =>
            u.socketId === socketId
              ? {
                  ...u,
                  videoEnabled,
                }
              : u,
          ),
        );
      });

      // 8. Remote screen sharing toggle
      socket.on("user-toggled-screen-share", ({ socketId, screenSharing }) => {
        setRemoteUsers((prev) =>
          prev.map((u) =>
            u.socketId === socketId
              ? {
                  ...u,
                  screenSharing,
                }
              : u,
          ),
        );
      });

      // 9. Peer left
      socket.on("user-left", ({ socketId, user: leftUser }) => {
        if (leftUser) {
          toast(`${leftUser.userName} left the meeting`);
        }

        const peer = peersRef.current.get(socketId);

        if (peer) {
          peer.close();
          peersRef.current.delete(socketId);
        }

        setRemoteUsers((prev) => prev.filter((u) => u.socketId !== socketId));
      });

      // 10. Meeting ended
      socket.on("meeting-ended", ({ message }) => {
        toast.error(message || "This meeting has ended");

        if (onMeetingEnded) {
          onMeetingEnded(message);
        }
      });
    };

    startSession();

    // Cleanup
    return () => {
      isMounted = false;

      // Stop screen share if active
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());

        screenStreamRef.current = null;
      }

      // Stop camera/microphone
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      localStreamRef.current = null;

      // Close peer connections
      peersRef.current.forEach((peer) => peer.close());

      peersRef.current.clear();

      // Remove socket listeners
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-toggled-audio");
      socket.off("user-toggled-video");
      socket.off("user-toggled-screen-share");
      socket.off("user-left");
      socket.off("meeting-ended");

      socket.disconnect();
    };
  }, [
    roomId,
    user?.id,
    enabled,
    createPeerConnection,
    initLocalStream,
    onMeetingEnded,
  ]);

  // Toggle microphone
  const toggleAudio = () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];

    if (audioTrack) {
      const newState = !audioEnabled;

      audioTrack.enabled = newState;

      setAudioEnabled(newState);

      socket.emit("toggle-audio", {
        roomId,
        audioEnabled: newState,
      });
    }
  };

  // Toggle camera
  const toggleVideo = () => {
    if (!cameraStreamRef.current) return;

    const videoTrack = cameraStreamRef.current.getVideoTracks()[0];

    if (videoTrack) {
      const newState = !videoEnabled;

      videoTrack.enabled = newState;

      setVideoEnabled(newState);

      socket.emit("toggle-video", {
        roomId,
        videoEnabled: newState,
      });
    }
  };

  // Start / stop screen sharing
  const toggleScreenShare = async () => {
    if (screenSharing) {
      stopScreenSharing();
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      if (!screenTrack) {
        screenStream.getTracks().forEach((track) => track.stop());

        return;
      }

      screenStreamRef.current = screenStream;

      // Replace camera video track with screen track
      peersRef.current.forEach((peer) => {
        const sender = peer
          .getSenders()
          .find((sender) => sender.track?.kind === "video");

        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      });

      // Keep microphone + screen in local preview
      const audioTracks = cameraStreamRef.current?.getAudioTracks() || [];

      const sharedStream = new MediaStream([...audioTracks, screenTrack]);

      localStreamRef.current = sharedStream;
      setLocalStream(sharedStream);
      setScreenSharing(true);

      socket.emit("toggle-screen-share", {
        roomId,
        screenSharing: true,
      });

      // Browser's native "Stop sharing" button
      screenTrack.onended = () => {
        stopScreenSharing();
      };

      toast.success("Screen sharing started");
    } catch (error) {
      if (error?.name === "NotAllowedError") {
        toast("Screen sharing cancelled.");
      } else {
        console.error("Screen sharing error:", error);

        toast.error("Could not start screen sharing.");
      }
    }
  };

  const stopScreenSharing = useCallback(() => {
    const cameraTrack = cameraStreamRef.current?.getVideoTracks()[0];

    // Replace screen track with camera track
    peersRef.current.forEach((peer) => {
      const sender = peer
        .getSenders()
        .find((sender) => sender.track?.kind === "video");

      if (sender && cameraTrack) {
        sender.replaceTrack(cameraTrack);
      }
    });

    // Stop screen tracks
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());

      screenStreamRef.current = null;
    }

    // Restore local camera stream
    if (cameraStreamRef.current) {
      localStreamRef.current = cameraStreamRef.current;

      setLocalStream(cameraStreamRef.current);
    }

    setScreenSharing(false);

    socket.emit("toggle-screen-share", {
      roomId,
      screenSharing: false,
    });

    toast("Screen sharing stopped.");
  }, [roomId]);

  // End meeting for everyone
  const endMeeting = useCallback(() => {
    if (roomId) {
      socket.emit("end-meeting", {
        roomId,
      });
    }
  }, [roomId]);

  return {
    localStream,
    remoteUsers,
    audioEnabled,
    videoEnabled,
    screenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endMeeting,
  };
};
