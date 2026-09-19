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

  const [audioDeviceAvailable, setAudioDeviceAvailable] = useState(true);
  const [videoDeviceAvailable, setVideoDeviceAvailable] = useState(true);

  const [audioPermissionDenied, setAudioPermissionDenied] = useState(false);
  const [videoPermissionDenied, setVideoPermissionDenied] = useState(false);

  const [screenSharing, setScreenSharing] = useState(false);

  const peersRef = useRef(new Map());

  const localStreamRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const audioPermissionDeniedRef = useRef(false);
  const videoPermissionDeniedRef = useRef(false);

  // --------------------------------------------------
  // Update local stream
  // --------------------------------------------------

  const updateLocalStream = useCallback((audioTrack, videoTrack) => {
    const tracks = [];

    if (audioTrack) {
      tracks.push(audioTrack);
    }

    if (videoTrack) {
      tracks.push(videoTrack);
    }

    const newStream = new MediaStream(tracks);

    localStreamRef.current = newStream;
    setLocalStream(newStream);

    return newStream;
  }, []);

  // --------------------------------------------------
  // Restore microphone
  // --------------------------------------------------

  const restoreMicrophone = useCallback(async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const newAudioTrack = audioStream.getAudioTracks()[0];

      if (!newAudioTrack) {
        return false;
      }

      const currentVideoTrack =
        cameraStreamRef.current?.getVideoTracks()[0] || null;

      cameraStreamRef.current = new MediaStream([
        newAudioTrack,
        ...(currentVideoTrack ? [currentVideoTrack] : []),
      ]);

      updateLocalStream(newAudioTrack, currentVideoTrack);

      // Replace audio track in WebRTC peers
      peersRef.current.forEach((peer) => {
        const audioSender = peer
          .getSenders()
          .find((sender) => sender.track?.kind === "audio");

        if (audioSender) {
          audioSender.replaceTrack(newAudioTrack);
        }
      });

      setAudioEnabled(true);
      setAudioDeviceAvailable(true);
      setAudioPermissionDenied(false);

      audioPermissionDeniedRef.current = false;

      socket.emit("toggle-audio", {
        roomId,
        audioEnabled: true,
      });

      return true;
    } catch (error) {
      console.error("Could not restore microphone:", error);

      return false;
    }
  }, [roomId, updateLocalStream]);

  // --------------------------------------------------
  // Restore camera
  // --------------------------------------------------

  const restoreCamera = useCallback(async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const newVideoTrack = videoStream.getVideoTracks()[0];

      if (!newVideoTrack) {
        return false;
      }

      const currentAudioTrack =
        cameraStreamRef.current?.getAudioTracks()[0] || null;

      cameraStreamRef.current = new MediaStream([
        ...(currentAudioTrack ? [currentAudioTrack] : []),
        newVideoTrack,
      ]);

      updateLocalStream(currentAudioTrack, newVideoTrack);

      // Replace video track in WebRTC peers
      peersRef.current.forEach((peer) => {
        const videoSender = peer
          .getSenders()
          .find((sender) => sender.track?.kind === "video");

        if (videoSender) {
          videoSender.replaceTrack(newVideoTrack);
        }
      });

      setVideoEnabled(true);
      setVideoDeviceAvailable(true);
      setVideoPermissionDenied(false);

      videoPermissionDeniedRef.current = false;

      socket.emit("toggle-video", {
        roomId,
        videoEnabled: true,
      });

      return true;
    } catch (error) {
      console.error("Could not restore camera:", error);

      return false;
    }
  }, [roomId, updateLocalStream]);

  // --------------------------------------------------
  // Remove microphone
  // --------------------------------------------------

  const removeMicrophone = useCallback(() => {
    const audioTrack = cameraStreamRef.current?.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.stop();
    }

    const currentVideoTrack =
      cameraStreamRef.current?.getVideoTracks()[0] || null;

    cameraStreamRef.current = new MediaStream(
      currentVideoTrack ? [currentVideoTrack] : [],
    );

    updateLocalStream(null, currentVideoTrack);

    // Remove audio from WebRTC peers
    peersRef.current.forEach((peer) => {
      const audioSender = peer
        .getSenders()
        .find((sender) => sender.track?.kind === "audio");

      if (audioSender) {
        audioSender.replaceTrack(null);
      }
    });

    setAudioEnabled(false);

    socket.emit("toggle-audio", {
      roomId,
      audioEnabled: false,
    });
  }, [roomId, updateLocalStream]);

  // --------------------------------------------------
  // Remove camera
  // --------------------------------------------------

  const removeCamera = useCallback(() => {
    const videoTrack = cameraStreamRef.current?.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.stop();
    }

    const currentAudioTrack =
      cameraStreamRef.current?.getAudioTracks()[0] || null;

    cameraStreamRef.current = new MediaStream(
      currentAudioTrack ? [currentAudioTrack] : [],
    );

    updateLocalStream(currentAudioTrack, null);

    // Remove video from WebRTC peers
    peersRef.current.forEach((peer) => {
      const videoSender = peer
        .getSenders()
        .find((sender) => sender.track?.kind === "video");

      if (videoSender) {
        videoSender.replaceTrack(null);
      }
    });

    setVideoEnabled(false);

    socket.emit("toggle-video", {
      roomId,
      videoEnabled: false,
    });
  }, [roomId, updateLocalStream]);

  // --------------------------------------------------
  // Initialize microphone and camera independently
  // --------------------------------------------------

  const initLocalStream = useCallback(async () => {
    let audioTrack = null;
    let videoTrack = null;

    // Request microphone independently
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioTrack = audioStream.getAudioTracks()[0] || null;

      if (audioTrack) {
        setAudioEnabled(true);
        setAudioDeviceAvailable(true);
        setAudioPermissionDenied(false);

        audioPermissionDeniedRef.current = false;
      }
    } catch (error) {
      console.error("Microphone access error:", error);

      setAudioEnabled(false);

      if (error?.name === "NotAllowedError") {
        setAudioPermissionDenied(true);
        audioPermissionDeniedRef.current = true;
      }
    }

    // Request camera independently
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoTrack = videoStream.getVideoTracks()[0] || null;

      if (videoTrack) {
        setVideoEnabled(true);
        setVideoDeviceAvailable(true);
        setVideoPermissionDenied(false);

        videoPermissionDeniedRef.current = false;
      }
    } catch (error) {
      console.error("Camera access error:", error);

      setVideoEnabled(false);

      if (error?.name === "NotAllowedError") {
        setVideoPermissionDenied(true);
        videoPermissionDeniedRef.current = true;
      }
    }

    // Store available tracks
    cameraStreamRef.current = new MediaStream([
      ...(audioTrack ? [audioTrack] : []),
      ...(videoTrack ? [videoTrack] : []),
    ]);

    localStreamRef.current = cameraStreamRef.current;

    setLocalStream(cameraStreamRef.current);

    return cameraStreamRef.current;
  }, []);

  // --------------------------------------------------
  // Device and permission monitoring
  // --------------------------------------------------

  useEffect(() => {
    if (!enabled) return;

    let permissionListeners = [];

    const checkDeviceStatus = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const hasAudioDevice = devices.some(
          (device) => device.kind === "audioinput",
        );

        const hasVideoDevice = devices.some(
          (device) => device.kind === "videoinput",
        );

        setAudioDeviceAvailable(hasAudioDevice);
        setVideoDeviceAvailable(hasVideoDevice);
      } catch (error) {
        console.error("Could not check media devices:", error);
      }
    };

    const handlePermissionChange = async (type, permission) => {
      const denied = permission.state === "denied";

      if (type === "microphone") {
        setAudioPermissionDenied(denied);
        audioPermissionDeniedRef.current = denied;

        if (denied) {
          removeMicrophone();
        } else if (audioPermissionDeniedRef.current === false) {
          await restoreMicrophone();
        }
      }

      if (type === "camera") {
        setVideoPermissionDenied(denied);
        videoPermissionDeniedRef.current = denied;

        if (denied) {
          removeCamera();
        } else if (videoPermissionDeniedRef.current === false) {
          await restoreCamera();
        }
      }
    };

    const setupPermissionListeners = async () => {
      if (!navigator.permissions?.query) {
        return;
      }

      try {
        const microphonePermission = await navigator.permissions.query({
          name: "microphone",
        });

        const cameraPermission = await navigator.permissions.query({
          name: "camera",
        });

        setAudioPermissionDenied(microphonePermission.state === "denied");

        setVideoPermissionDenied(cameraPermission.state === "denied");

        audioPermissionDeniedRef.current =
          microphonePermission.state === "denied";

        videoPermissionDeniedRef.current = cameraPermission.state === "denied";

        const microphoneChange = async () => {
          const wasDenied = audioPermissionDeniedRef.current;

          const isDenied = microphonePermission.state === "denied";

          setAudioPermissionDenied(isDenied);

          audioPermissionDeniedRef.current = isDenied;

          if (isDenied && !wasDenied) {
            removeMicrophone();
          }

          if (!isDenied && wasDenied) {
            await restoreMicrophone();
          }
        };

        const cameraChange = async () => {
          const wasDenied = videoPermissionDeniedRef.current;

          const isDenied = cameraPermission.state === "denied";

          setVideoPermissionDenied(isDenied);

          videoPermissionDeniedRef.current = isDenied;

          if (isDenied && !wasDenied) {
            removeCamera();
          }

          if (!isDenied && wasDenied) {
            await restoreCamera();
          }
        };

        microphonePermission.onchange = microphoneChange;

        cameraPermission.onchange = cameraChange;

        permissionListeners = [
          {
            permission: microphonePermission,
            handler: microphoneChange,
          },
          {
            permission: cameraPermission,
            handler: cameraChange,
          },
        ];
      } catch (error) {
        console.error("Permission monitoring error:", error);
      }
    };

    checkDeviceStatus();
    setupPermissionListeners();

    const handleDeviceChange = () => {
      checkDeviceStatus();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      );

      permissionListeners.forEach(({ permission, handler }) => {
        permission.onchange = null;
      });
    };
  }, [
    enabled,
    removeMicrophone,
    removeCamera,
    restoreMicrophone,
    restoreCamera,
  ]);

  // --------------------------------------------------
  // Create peer connection
  // --------------------------------------------------

  const createPeerConnection = useCallback((targetSocketId, targetUser) => {
    if (peersRef.current.has(targetSocketId)) {
      return peersRef.current.get(targetSocketId);
    }

    const peer = new RTCPeerConnection(ICE_SERVERS);

    // Add current local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          targetSocketId,
          senderSocketId: socket.id,
          candidate: event.candidate,
        });
      }
    };

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

  // --------------------------------------------------
  // WebRTC + Socket setup
  // --------------------------------------------------

  useEffect(() => {
    if (!roomId || !user || !enabled) {
      return;
    }

    let isMounted = true;

    const startSession = async () => {
      await initLocalStream();

      if (!isMounted) return;

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join-room", {
        roomId,
        user,
        audioEnabled: !audioPermissionDeniedRef.current,
        videoEnabled: !videoPermissionDeniedRef.current,
        screenSharing: false,
      });

      // Existing users
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
            .catch((error) => console.error("Error creating offer:", error));
        });
      });

      // New user joined
      socket.on("user-joined", (newUser) => {
        toast(`${newUser.userName} joined the meeting`, {
          icon: "👋",
        });

        createPeerConnection(newUser.socketId, newUser);
      });

      // Offer
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
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      });

      // Answer
      socket.on("answer", async ({ responderSocketId, sdp }) => {
        const peer = peersRef.current.get(responderSocketId);

        if (peer) {
          try {
            await peer.setRemoteDescription(new RTCSessionDescription(sdp));
          } catch (error) {
            console.error("Error setting remote description:", error);
          }
        }
      });

      // ICE candidate
      socket.on("ice-candidate", async ({ senderSocketId, candidate }) => {
        const peer = peersRef.current.get(senderSocketId);

        if (peer && candidate) {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        }
      });

      // Remote microphone toggle
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

      // Remote camera toggle
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

      // Remote screen sharing
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

      // User left
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

      // Meeting ended
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

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());

        screenStreamRef.current = null;
      }

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      localStreamRef.current = null;

      peersRef.current.forEach((peer) => peer.close());

      peersRef.current.clear();

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

  // --------------------------------------------------
  // Toggle microphone
  // --------------------------------------------------

  const toggleAudio = async () => {
    if (audioEnabled) {
      removeMicrophone();
      return;
    }

    await restoreMicrophone();
  };

  // --------------------------------------------------
  // Toggle camera
  // --------------------------------------------------

  const toggleVideo = async () => {
    if (videoEnabled) {
      removeCamera();
      return;
    }

    await restoreCamera();
  };

  // --------------------------------------------------
  // Screen sharing
  // --------------------------------------------------

  const stopScreenSharing = useCallback(() => {
    const cameraTrack = cameraStreamRef.current?.getVideoTracks()[0] || null;

    peersRef.current.forEach((peer) => {
      const sender = peer
        .getSenders()
        .find((sender) => sender.track?.kind === "video");

      if (sender) {
        sender.replaceTrack(cameraTrack || null);
      }
    });

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());

      screenStreamRef.current = null;
    }

    const audioTrack = cameraStreamRef.current?.getAudioTracks()[0] || null;

    updateLocalStream(audioTrack, cameraTrack);

    setScreenSharing(false);

    socket.emit("toggle-screen-share", {
      roomId,
      screenSharing: false,
    });

    toast("Screen sharing stopped.");
  }, [roomId, updateLocalStream]);

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

      // Replace camera video with screen
      peersRef.current.forEach((peer) => {
        const sender = peer
          .getSenders()
          .find((sender) => sender.track?.kind === "video");

        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      });

      const audioTrack = cameraStreamRef.current?.getAudioTracks()[0] || null;

      localStreamRef.current = new MediaStream([
        ...(audioTrack ? [audioTrack] : []),
        screenTrack,
      ]);

      setLocalStream(localStreamRef.current);

      setScreenSharing(true);

      socket.emit("toggle-screen-share", {
        roomId,
        screenSharing: true,
      });

      // Browser native "Stop sharing"
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

  // --------------------------------------------------
  // End meeting
  // --------------------------------------------------

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

    audioDeviceAvailable,
    videoDeviceAvailable,

    audioPermissionDenied,
    videoPermissionDenied,

    screenSharing,

    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endMeeting,
  };
};
