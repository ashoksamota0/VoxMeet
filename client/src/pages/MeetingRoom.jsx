import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SignalIcon } from "lucide-react";
import VideoGrid from "../components/meeting/VideoGrid";
import { useWebRTC } from "../hooks/useWebRTC";
import ChatPanel from "../components/meeting/ChatPanel";
import { useChat } from "../hooks/useChat";
import ParticipantList from "../components/meeting/ParticipantList";
import ControlBar from "../components/meeting/ControlBar";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/react";
import api from "../config/api";
import Loader from "../components/Loader";

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const userdata = useMemo(() => {
    if (!user) return null;

    return {
      id: user.id,
      name:
        user.fullName ||
        user.firstName ||
        user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "User",
      email: user.primaryEmailAddress?.emailAddress || "",
      image: user.imageUrl || "",
    };
  }, [
    user?.id,
    user?.fullName,
    user?.firstName,
    user?.primaryEmailAddress?.emailAddress,
    user?.imageUrl,
  ]);

  const [meeting, setMeeting] = useState(null);
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);

  // Fetch meeting details to verify validity BEFORE enabling WebRTC camera access
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const token = await getToken();

        const res = await api.get(`/api/meetings/${meetingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.meeting.status === "ended") {
          toast.error("This meeting has ended");
          navigate("/dashboard");
          return;
        }

        setMeeting(res.data.meeting);
      } catch (error) {
        const errorMsg =
          error.response?.data?.error || "Meeting not found or has ended";

        toast.error(errorMsg);
        navigate("/dashboard");
      } finally {
        setLoadingMeeting(false);
      }
    };

    fetchMeeting();
  }, [meetingId, navigate]);

  // Meeting duration timer
  useEffect(() => {
    if (!meeting?.createdAt) return;

    const updateDuration = () => {
      const startTime = new Date(meeting.createdAt).getTime();

      const elapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

      setMeetingDuration(elapsed);
    };

    updateDuration();

    const timer = setInterval(updateDuration, 1000);

    return () => clearInterval(timer);
  }, [meeting?.createdAt]);

  // Format meeting duration as HH:MM:SS
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const handleMeetingEnded = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  // Initialize WebRTC
  const {
    localStream,
    remoteUsers,
    audioEnabled,
    videoEnabled,
    audioDeviceAvailable,
    videoDeviceAvailable,
    audioPermissionDenied,
    videoPermissionDenied,
    screenSharing,
    connectionQuality,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endMeeting,
  } = useWebRTC(meetingId, userdata, handleMeetingEnded, Boolean(meeting));

  // Connection quality UI
  const connectionQualityConfig = {
    good: {
      label: "Good connection",
      color: "text-emerald-600",
      background: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    fair: {
      label: "Fair connection",
      color: "text-amber-600",
      background: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    poor: {
      label: "Poor connection",
      color: "text-red-600",
      background: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  const currentConnectionQuality =
    connectionQualityConfig[connectionQuality] || connectionQualityConfig.good;

  // Initialize Chat
  const { messages, sendMessage, unreadCount, isChatOpen, toggleChat } =
    useChat(meetingId, userdata);

  const hostId = meeting?.host?.id || meeting?.host;

  const isHost = Boolean(
    userdata?.id && hostId && hostId.toString() === userdata.id.toString(),
  );

  const handleLeave = () => {
    toast("You left the meeting");
    navigate("/dashboard");
  };

  const handleEndMeeting = () => {
    endMeeting();
    toast("Meeting ended for all participants");
    navigate("/dashboard");
  };

  if (loadingMeeting) {
    return <Loader text="Joining meeting room..." />;
  }

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden relative font-sans">
      {/* Top Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md px-3 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight truncate max-w-[38vw] sm:max-w-none">
            {meeting?.title || "Instant Meeting"}
          </h2>

          <span className="size-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />

          <span className="shrink-0 text-[10px] sm:text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            {meetingId}
          </span>

          {/* Meeting Duration */}
          <span className="shrink-0 text-[10px] sm:text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            {formatDuration(meetingDuration)}
          </span>

          {/* Connection Quality */}
          <div className="relative group">
            <div
              className={`shrink-0 flex items-center gap-1.5 rounded-md border px-2 py-1 ${currentConnectionQuality.background} ${currentConnectionQuality.border} ${currentConnectionQuality.color}`}
              aria-label={currentConnectionQuality.label}
            >
              <SignalIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

              <span className="hidden sm:inline text-[10px] sm:text-[11px] font-medium">
                {connectionQuality === "good"
                  ? "Good"
                  : connectionQuality === "fair"
                    ? "Fair"
                    : "Poor"}
              </span>

              <span
                className={`size-1.5 rounded-full ${currentConnectionQuality.dot}`}
              />
            </div>

            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg z-50">
              {currentConnectionQuality.label}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area (Video Grid + Side Panels) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Grid Center */}
        <VideoGrid
          localStream={localStream}
          localUser={userdata}
          remoteUsers={remoteUsers}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          screenSharing={screenSharing}
        />

        {/* In-Meeting Chat Drawer */}
        <ChatPanel
          isOpen={isChatOpen}
          onClose={toggleChat}
          messages={messages}
          onSendMessage={sendMessage}
          currentUser={userdata}
        />

        {/* Participants Drawer */}
        <ParticipantList
          isOpen={isParticipantsOpen}
          onClose={() => setIsParticipantsOpen(false)}
          localUser={userdata}
          localAudio={audioEnabled}
          localVideo={videoEnabled}
          remoteUsers={remoteUsers}
          meetingHostId={hostId}
        />
      </div>

      {/* Bottom Floating Control Bar */}
      <ControlBar
        roomId={meetingId}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        audioDeviceAvailable={audioDeviceAvailable}
        videoDeviceAvailable={videoDeviceAvailable}
        audioPermissionDenied={audioPermissionDenied}
        videoPermissionDenied={videoPermissionDenied}
        screenSharing={screenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleChat={toggleChat}
        onToggleParticipants={() => setIsParticipantsOpen((prev) => !prev)}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        unreadCount={unreadCount}
        participantCount={1 + remoteUsers.length}
        isHost={isHost}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
      />
    </div>
  );
};

export default MeetingRoom;
