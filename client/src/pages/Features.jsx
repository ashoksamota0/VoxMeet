import React from "react";
import {
  Video,
  Users,
  MessageCircle,
  MonitorUp,
  ShieldCheck,
  History,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "HD Video Meetings",
    description:
      "Connect face-to-face with smooth real-time video and audio powered by WebRTC.",
  },
  {
    icon: Users,
    title: "Multiple Participants",
    description:
      "Bring your team, friends, or clients together in the same meeting room.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description:
      "Send messages instantly during meetings without leaving the call.",
  },
  {
    icon: MonitorUp,
    title: "Screen Sharing",
    description:
      "Share your screen with participants for presentations, demos, and collaboration.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Your account and meeting access are protected with secure authentication.",
  },
  {
    icon: History,
    title: "Meeting History",
    description:
      "Review your previous sessions and keep track of your meeting activity.",
  },
];

const Features = () => {
  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/50 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-violet-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Everything you need to connect
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Powerful features for{" "}
            <span className="text-violet-600">better meetings.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            VoxMeet brings video calling, real-time communication, and
            collaboration tools together in one simple platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-all group-hover:bg-violet-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-600 p-7 text-white shadow-lg sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Simple. Real-time. Connected.
              </h2>
              <p className="mt-1 text-sm leading-6 text-violet-100">
                Everything you need for productive online conversations.
              </p>
            </div>

            <Video className="hidden h-12 w-12 text-violet-200 sm:block" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Features;
