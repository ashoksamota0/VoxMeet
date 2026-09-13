import { CrownIcon, UsersIcon } from "lucide-react";
import React from "react";

const SessionParticipantsTab = ({ participants = [], host }) => {
  if (participants.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm py-12">
        <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
          <UsersIcon className="w-6 h-6 text-slate-300" />
        </div>

        <p className="text-center">No participant logs recorded.</p>
      </div>
    );
  }

  const hostId = host?.id;

  return (
    <div className="space-y-2.5">
      {participants.map((p, idx) => {
        const participantUserId = p.user?.id || p.user;

        const isHost = Boolean(
          hostId &&
          participantUserId &&
          participantUserId.toString() === hostId.toString(),
        );

        return (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 transition-colors hover:bg-slate-50"
          >
            {/* Participant Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 size-9 rounded-full bg-violet-50 border border-violet-100 text-primary font-bold flex items-center justify-center text-sm">
                {p.name ? p.name.charAt(0).toUpperCase() : "?"}
              </div>

              <div className="min-w-0">
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="truncate">{p.name || "Participant"}</span>

                  {isHost && (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                      <CrownIcon className="w-3 h-3" />
                      Host
                    </span>
                  )}
                </span>

                {p.user?.email && (
                  <span className="block text-xs text-slate-400 truncate mt-0.5">
                    {p.user.email}
                  </span>
                )}
              </div>
            </div>

            {/* Joined Time */}
            <span className="shrink-0 text-[10px] sm:text-xs text-slate-400 font-mono">
              Joined:{" "}
              {new Date(p.joinedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SessionParticipantsTab;
