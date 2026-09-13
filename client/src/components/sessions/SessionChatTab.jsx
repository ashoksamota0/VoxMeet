import { MessageSquareIcon } from "lucide-react";
import React from "react";

const SessionChatTab = ({ messages = [] }) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm py-12">
        <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
          <MessageSquareIcon className="w-6 h-6 text-slate-300" />
        </div>

        <p className="text-center">
          No chat messages were recorded in this meeting session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-xs font-semibold text-slate-800 truncate">
              {msg.senderName || "Participant"}
            </span>

            <span className="shrink-0 text-[10px] text-slate-400">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p className="text-sm text-slate-700 font-normal leading-relaxed break-words">
            {msg.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SessionChatTab;
