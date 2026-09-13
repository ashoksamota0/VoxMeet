import React, { useState } from "react";
import { XIcon } from "lucide-react";
import SessionChatTab from "./SessionChatTab";
import SessionParticipantsTab from "./SessionParticipantsTab";

const SessionDetailModal = ({ session, onClose }) => {
  const [activeTab, setActiveTab] = useState("chat");

  if (!session) return null;

  const isEnded = session.status === "ended";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200/70 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* Meeting ID & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                ID: {session.meetingId}
              </span>

              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                  isEnded
                    ? "bg-slate-100 text-slate-600"
                    : "bg-emerald-50 text-emerald-700"
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

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-3 truncate">
              {session.title || "Meeting Details"}
            </h2>

            {/* Host & Created Date */}
            <p className="text-xs text-slate-400 mt-1.5 truncate">
              Host: {session.host?.name || "Host"} • Created{" "}
              {new Date(session.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
            aria-label="Close session details"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 bg-slate-50/60">
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-3.5 px-3 sm:px-4 font-medium text-xs sm:text-sm border-b-2 cursor-pointer transition-all ${
              activeTab === "chat"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Chat Transcript ({session.messages?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("participants")}
            className={`py-3.5 px-3 sm:px-4 font-medium text-xs sm:text-sm border-b-2 cursor-pointer transition-all ${
              activeTab === "participants"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Participants Log ({session.participants?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto min-h-75">
          {activeTab === "chat" ? (
            <SessionChatTab messages={session.messages} />
          ) : (
            <SessionParticipantsTab
              participants={session.participants}
              host={session.host}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
