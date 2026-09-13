import {
  CrownIcon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  XIcon,
} from "lucide-react";
import React from "react";

const ParticipantList = ({
  isOpen,
  onClose,
  localUser,
  localAudio,
  localVideo,
  remoteUsers,
  meetingHostId,
}) => {
  if (!isOpen) return null;

  const allParticipants = [
    {
      socketId: "local",
      userId: localUser?.id,
      userName: `${localUser?.name || "You"} (You)`,
      audioEnabled: localAudio,
      videoEnabled: localVideo,
      isLocal: true,
    },
    ...remoteUsers,
  ];

  return (
    <aside className="w-full sm:w-80 h-full bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">
            Participants
          </h3>

          <p className="text-[11px] text-slate-400 mt-0.5">
            {allParticipants.length}{" "}
            {allParticipants.length === 1 ? "participant" : "participants"} in
            this meeting
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          aria-label="Close participants list"
          title="Close participants"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Participant List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
        {allParticipants.map((p) => {
          const isHost =
            meetingHostId &&
            p.userId &&
            p.userId.toString() === meetingHostId.toString();

          return (
            <div
              key={p.socketId}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 transition-colors hover:bg-slate-50"
            >
              {/* Participant Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 size-9 rounded-full bg-violet-50 border border-violet-100 text-primary font-bold flex items-center justify-center text-sm">
                  {p.userName ? p.userName.charAt(0).toUpperCase() : "?"}
                </div>

                <div className="min-w-0">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="truncate">
                      {p.userName || "Participant"}
                    </span>

                    {isHost && (
                      <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                        <CrownIcon className="w-3 h-3" />
                        Host
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Audio / Video Status */}
              <div className="shrink-0 flex items-center gap-1.5">
                <span
                  className={`p-1.5 rounded-lg border ${
                    p.audioEnabled
                      ? "bg-slate-100 border-slate-200 text-slate-600"
                      : "bg-rose-50 border-rose-100 text-rose-500"
                  }`}
                  title={p.audioEnabled ? "Microphone on" : "Microphone off"}
                >
                  {p.audioEnabled ? (
                    <MicIcon className="w-3.5 h-3.5" />
                  ) : (
                    <MicOffIcon className="w-3.5 h-3.5" />
                  )}
                </span>

                <span
                  className={`p-1.5 rounded-lg border ${
                    p.videoEnabled
                      ? "bg-slate-100 border-slate-200 text-slate-600"
                      : "bg-rose-50 border-rose-100 text-rose-500"
                  }`}
                  title={p.videoEnabled ? "Camera on" : "Camera off"}
                >
                  {p.videoEnabled ? (
                    <VideoIcon className="w-3.5 h-3.5" />
                  ) : (
                    <VideoOffIcon className="w-3.5 h-3.5" />
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ParticipantList;
