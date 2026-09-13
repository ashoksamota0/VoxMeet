import { ArrowRightIcon, VideoIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const EmptySessions = () => {
  return (
    <div className="w-full bg-white/60 backdrop-blur rounded-3xl p-8 sm:p-12 xl:py-24 text-center border border-slate-200/60 shadow-sm flex flex-col items-center justify-center">
      {/* Empty State Icon */}
      <div className="size-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5">
        <VideoIcon className="w-7 h-7 text-primary" />
      </div>

      {/* Heading */}
      <h3 className="text-xl lg:text-2xl font-semibold text-slate-800">
        No meeting history yet
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 max-w-md leading-relaxed mt-2">
        Once you create or join meeting calls, your meeting sessions,
        participants, and chat logs will appear here.
      </p>

      {/* CTA */}
      <Link
        to="/dashboard"
        className="bg-primary hover:bg-primary-hover hover:shadow-md text-white font-medium px-6 py-3 rounded-full text-sm transition-all inline-flex items-center gap-2 mt-6"
      >
        Start a Meeting
        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default EmptySessions;
