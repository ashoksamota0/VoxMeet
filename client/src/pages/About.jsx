import React from "react";
import { ArrowRight, Globe2, MessageSquare, Video } from "lucide-react";

const About = () => {
  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-violet-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            About VoxMeet
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Communication made <span className="text-violet-600">simple.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            VoxMeet is a modern real-time video communication platform built to
            make online meetings simple, reliable, and easy to use.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-2xl font-semibold text-slate-900">
              Built for meaningful conversations
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Whether you're collaborating with a team, catching up with
              friends, or joining an online discussion, VoxMeet provides the
              essential tools to communicate without unnecessary complexity.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              The platform combines real-time video and audio communication with
              chat, screen sharing, participant management, and meeting history
              to create a complete meeting experience.
            </p>

            <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-violet-600">
              Connect from anywhere
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Video className="h-6 w-6 text-violet-600" />
              <h3 className="mt-4 font-semibold text-slate-900">
                Real-Time Video
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fast and direct video communication for online meetings.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <MessageSquare className="h-6 w-6 text-violet-600" />
              <h3 className="mt-4 font-semibold text-slate-900">
                Better Collaboration
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Chat and share your screen while staying connected.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Globe2 className="h-6 w-6 text-violet-600" />
              <h3 className="mt-4 font-semibold text-slate-900">
                Connect Anywhere
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join conversations from wherever you are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
