import { CalendarIcon, MessageSquareIcon, UsersIcon } from "lucide-react";
import React from "react";

const SessionCard = ({ session, onOpenDetails, onRejoin }) => {
  const isEnded = session.status === "ended";

  return (
    <div className="bg-white/75 backdrop-blur rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between gap-5 border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5">
      {/* Header & Meeting Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg truncate">
            ID: {session.meetingId}
          </span>

          <span
            className={`shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 ${
              isEnded
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isEnded ? "bg-slate-400" : "bg-emerald-500"
              }`}
            />

            {isEnded ? "Ended" : "Active"}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-900 truncate">
            {session.title || "Instant Meeting"}
          </h3>

          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
            <CalendarIcon className="w-3.5 h-3.5" />

            {new Date(session.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/70">
        <div className="flex items-center gap-2.5 text-xs bg-slate-50 border border-slate-100 p-3 rounded-xl">
          <div className="size-8 rounded-lg bg-violet-50 flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-primary" />
          </div>

          <div>
            <strong className="block font-semibold text-slate-900">
              {session.participants?.length || 0}
            </strong>

            <span className="text-slate-400">Participants</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs bg-slate-50 border border-slate-100 p-3 rounded-xl">
          <div className="size-8 rounded-lg bg-violet-50 flex items-center justify-center">
            <MessageSquareIcon className="w-4 h-4 text-primary" />
          </div>

          <div>
            <strong className="block font-semibold text-slate-900">
              {session.messages?.length || 0}
            </strong>

            <span className="text-slate-400">Messages</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => onOpenDetails(session.meetingId)}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 px-4 rounded-full text-xs transition-all cursor-pointer"
        >
          View Details
        </button>

        {!isEnded && (
          <button
            onClick={() => onRejoin(session.meetingId)}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-4 rounded-full text-xs transition-all shadow-sm hover:shadow cursor-pointer"
          >
            Re-join
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
