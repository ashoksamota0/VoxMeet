import {
  CheckIcon,
  CopyIcon,
  MessageSquareIcon,
  MicIcon,
  MicOffIcon,
  MonitorUpIcon,
  PhoneOffIcon,
  UsersIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ControlBar = ({
  roomId,
  audioEnabled,
  videoEnabled,
  audioDeviceAvailable,
  videoDeviceAvailable,
  audioPermissionDenied,
  videoPermissionDenied,
  screenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  isChatOpen,
  isParticipantsOpen,
  unreadCount,
  participantCount,
  isHost,
  onLeave,
  onEndMeeting,
}) => {
  const [copied, setCopied] = useState(false);

  const copyMeetingId = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Meeting link copied!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const microphoneUnavailable = !audioDeviceAvailable || audioPermissionDenied;

  const cameraUnavailable = !videoDeviceAvailable || videoPermissionDenied;

  const microphoneStatus = audioPermissionDenied
    ? "Microphone permission required"
    : !audioDeviceAvailable
      ? "Microphone unavailable"
      : audioEnabled
        ? "Mute Microphone"
        : "Unmute Microphone";

  const cameraStatus = videoPermissionDenied
    ? "Camera permission required"
    : !videoDeviceAvailable
      ? "Camera unavailable"
      : videoEnabled
        ? "Turn Off Camera"
        : "Turn On Camera";

  return (
    <footer className="w-full bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 z-40 shadow-lg shadow-slate-200/50">
      {/* Left Info / Copy Link */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="hidden lg:block text-xs font-medium text-slate-500 font-mono tracking-wider">
          ID: {roomId}
        </span>

        <button
          onClick={copyMeetingId}
          className="p-2.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
          title="Copy meeting link"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4 text-emerald-600" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}

          <span className="hidden sm:inline">
            {copied ? "Copied" : "Copy Link"}
          </span>
        </button>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Audio Toggle */}
        <div className="relative group">
          <button
            onClick={onToggleAudio}
            disabled={microphoneUnavailable}
            className={`relative p-3 sm:p-3.5 rounded-2xl transition-all border ${
              microphoneUnavailable
                ? "bg-amber-50 text-amber-600 border-amber-200 cursor-not-allowed"
                : audioEnabled
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs cursor-pointer"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-xs cursor-pointer"
            }`}
            aria-label={microphoneStatus}
          >
            {audioEnabled && !microphoneUnavailable ? (
              <MicIcon className="w-5 h-5" />
            ) : (
              <MicOffIcon className="w-5 h-5" />
            )}

            {microphoneUnavailable && (
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-amber-500 border-2 border-white" />
            )}
          </button>

          {microphoneUnavailable && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg z-50">
              {microphoneStatus}
            </span>
          )}
        </div>

        {/* Video Toggle */}
        <div className="relative group">
          <button
            onClick={onToggleVideo}
            disabled={cameraUnavailable}
            className={`relative p-3 sm:p-3.5 rounded-2xl transition-all border ${
              cameraUnavailable
                ? "bg-amber-50 text-amber-600 border-amber-200 cursor-not-allowed"
                : videoEnabled
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs cursor-pointer"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-xs cursor-pointer"
            }`}
            aria-label={cameraStatus}
          >
            {videoEnabled && !cameraUnavailable ? (
              <VideoIcon className="w-5 h-5" />
            ) : (
              <VideoOffIcon className="w-5 h-5" />
            )}

            {cameraUnavailable && (
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-amber-500 border-2 border-white" />
            )}
          </button>

          {cameraUnavailable && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg z-50">
              {cameraStatus}
            </span>
          )}
        </div>

        {/* Screen Share Toggle */}
        <button
          onClick={onToggleScreenShare}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer border ${
            screenSharing
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs"
          }`}
          title={screenSharing ? "Stop Screen Sharing" : "Share Screen"}
          aria-label={screenSharing ? "Stop Screen Sharing" : "Share Screen"}
        >
          <MonitorUpIcon className="w-5 h-5" />
        </button>

        {/* Chat Toggle */}
        <button
          onClick={onToggleChat}
          className={`relative p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer border ${
            isChatOpen
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs"
          }`}
          title="Toggle In-Meeting Chat"
          aria-label="Toggle In-Meeting Chat"
        >
          <MessageSquareIcon className="w-5 h-5" />

          {unreadCount > 0 && !isChatOpen && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Participants Toggle */}
        <button
          onClick={onToggleParticipants}
          className={`relative p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer border ${
            isParticipantsOpen
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs"
          }`}
          title="Toggle Participants List"
          aria-label="Toggle Participants List"
        >
          <UsersIcon className="w-5 h-5" />

          <span className="absolute -top-1 -right-1 bg-slate-200 text-slate-800 text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center border border-slate-300">
            {participantCount}
          </span>
        </button>

        {/* Leave / End Meeting */}
        {isHost ? (
          <button
            onClick={onEndMeeting}
            className="p-3 sm:p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all cursor-pointer border border-red-500 ml-1 sm:ml-2 font-medium text-xs flex items-center gap-1.5"
            title="End Meeting for All"
            aria-label="End Meeting for All"
          >
            <PhoneOffIcon className="w-5 h-5" />

            <span className="hidden md:inline">End Meeting</span>
          </button>
        ) : (
          <button
            onClick={onLeave}
            className="p-3 sm:p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all cursor-pointer border border-red-500 ml-1 sm:ml-2"
            title="Leave Meeting"
            aria-label="Leave Meeting"
          >
            <PhoneOffIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Right Branding */}
      <div className="hidden sm:block w-32 text-right">
        <span className="font-medium text-slate-400 text-sm">VoxMeet Room</span>
      </div>
    </footer>
  );
};

export default ControlBar;
