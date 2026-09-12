import React, { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  KeyboardIcon,
  MessageSquareIcon,
  MonitorUpIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth, useUser, useClerk } from "@clerk/react";
import api from "../config/api.js";

const Dashboard = () => {
  const { user } = useUser();

  const userName = user?.fullName || "there";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { openSignIn } = useClerk();

  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState(null);
  const [joinId, setJoinId] = useState("");

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch meeting statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();

        const { data } = await api.get("/api/meetings/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(data);
      } catch (error) {
        toast.error(error.response?.data?.error || error.message);
      }
    };

    fetchStats();
  }, [isLoaded, isSignedIn, getToken]);

  // Create meeting
  const handleCreateMeeting = async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setIsCreating(true);

    try {
      const token = await getToken();

      const res = await api.post(
        "/api/meetings",
        { title: `${userName}'s Meeting` },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const meetingId = res.data.meeting.meetingId;

      toast.success("Meeting created!");
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsCreating(false);
    }
  };

  // Join meeting
  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    const cleanId = joinId.trim();

    if (!/^[a-z]{3}(?:-[a-z]{3}){2}$/.test(cleanId)) {
      toast.error("Please enter a valid Meeting ID");
      return;
    }

    if (!isLoaded) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    try {
      const token = await getToken();

      await api.get(`/api/meetings/${cleanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(`/meeting/${cleanId}`);
    } catch (error) {
      toast.error("Meeting not found. Check the ID and try again.");
    }
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="vox-dashboard min-h-full overflow-hidden">
      {/* Background decorations */}
      <div className="vox-bg-orb vox-bg-orb-one" />
      <div className="vox-bg-orb vox-bg-orb-two" />

      <main className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-8 sm:px-8 lg:px-10">
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-4">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="relative z-10">
            {/* Small badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
              <ShieldCheckIcon className="h-4 w-4 text-violet-600" />
              Built for focused conversations
            </div>

            {/* Main heading */}
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-0.045em] text-slate-950 sm:text-6xl xl:text-[68px]">
              Meet. Collaborate.
              <br />
              <span className="vox-gradient-text">Make progress.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Simple, powerful, and reliable video meetings for students, teams,
              and everyone in between.
            </p>

            {/* Meeting actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* New Meeting */}
              <button
                onClick={handleCreateMeeting}
                disabled={isCreating}
                className="vox-primary-btn inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PlusIcon className="h-5 w-5" />

                {isCreating ? "Creating..." : "New Meeting"}
              </button>

              {/* Join Meeting */}
              <form
                onSubmit={handleJoinMeeting}
                className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur sm:max-w-md"
              >
                <div className="relative min-w-0 flex-1">
                  <KeyboardIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />

                  <input
                    type="text"
                    placeholder="Enter meeting code"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    className="w-full bg-transparent py-2.5 pl-10 pr-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!joinId.trim()}
                  className="vox-join-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Join meeting"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* =================================================
                FEATURE HIGHLIGHTS
            ================================================= */}

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              <Feature
                icon={<VideoIcon />}
                title="HD Video"
                subtitle="Crystal clear quality"
              />

              <Feature
                icon={<MessageSquareIcon />}
                title="Real-time Chat"
                subtitle="Stay in sync"
              />

              <Feature
                icon={<MonitorUpIcon />}
                title="Screen Sharing"
                subtitle="Share your ideas"
              />

              <Feature
                icon={<UsersIcon />}
                title="Works Everywhere"
                subtitle="On any device"
              />
            </div>
          </div>

          {/* =====================================================
              RIGHT VISUAL
          ===================================================== */}

          <div className="relative flex min-h-[540px] items-center justify-center">
            {/* Decorative glow */}
            <div className="vox-visual-glow" />

            {/* Orbit rings */}
            <div className="vox-orbit-ring vox-orbit-ring-one" />
            <div className="vox-orbit-ring vox-orbit-ring-two" />

            {/* Orbit arrow */}
            <div className="vox-orbit-arrow">
              <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60 8C49 11 40 18 33 27C27 35 22 44 13 55"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M13 55L15 43"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M13 55L25 53"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* =================================================
                HANDWRITTEN IDEA NOTE
            ================================================= */}

            <div className="vox-note vox-note-one">
              <SparklesIcon className="h-4 w-4" />

              <span>Ideas</span>
              <span>People</span>
              <span>Progress</span>
            </div>

            {/* =================================================
                FLOATING VIDEO CARD
            ================================================= */}

            <div className="vox-floating-card vox-floating-camera">
              <VideoIcon className="h-5 w-5" />
            </div>

            {/* =================================================
                FLOATING USERS CARD
            ================================================= */}

            <div className="vox-floating-card vox-floating-users">
              <UsersIcon className="h-5 w-5" />
            </div>

            {/* =================================================
                FLOATING CHAT CARD
            ================================================= */}

            <div className="vox-floating-card vox-floating-chat">
              <MessageSquareIcon className="h-5 w-5" />
            </div>

            {/* =================================================
                FLOATING SCREEN SHARE CARD
            ================================================= */}

            <div className="vox-floating-card vox-floating-screen">
              <MonitorUpIcon className="h-5 w-5" />
            </div>

            {/* =================================================
                CENTRAL VOXMEET LOGO
            ================================================= */}

            <div className="vox-logo-card">
              <div className="vox-logo-inner">
                <img
                  src="/favicon.png"
                  alt="VoxMeet"
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              </div>

              <div className="vox-logo-label">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>VoxMeet</span>
              </div>
            </div>

            {/* =================================================
                ACCOUNT / TIME CARD
            ================================================= */}

            <div className="vox-account-card">
              {/* Greeting */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Hi, {userName}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Ready when you are.
                  </p>
                </div>

                <div className="vox-sun">
                  <SparklesIcon className="h-4 w-4" />
                </div>
              </div>

              {/* Clock */}
              <div className="mt-5 border-t border-slate-100 pt-5">
                <div className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {formattedTime}
                </div>

                <p className="mt-1 text-xs font-medium text-violet-600">
                  {formattedDate}
                </p>
              </div>

              {/* User info */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Logged in as
                  </p>

                  <p className="mt-1 truncate text-xs font-medium text-slate-700">
                    {userEmail}
                  </p>
                </div>

                {/* Plan */}
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                    stats?.plan === "premium"
                      ? "bg-violet-600 text-white"
                      : "bg-violet-50 text-violet-700"
                  }`}
                >
                  {stats?.plan || "Free"}
                </span>
              </div>

              {/* Meeting stats */}
              {stats && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      Monthly Meetings
                    </span>

                    <span className="font-mono text-[11px] text-slate-500">
                      {stats.monthlyLimit
                        ? `${stats.monthlyCount} / ${stats.monthlyLimit} Used`
                        : `${stats.monthlyCount} Created (Unlimited)`}
                    </span>
                  </div>

                  {/* Usage bar */}
                  {stats.monthlyLimit && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        style={{
                          width: `${Math.min(
                            (stats.monthlyCount / stats.monthlyLimit) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Security status */}
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
                <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                Secure peer-to-peer meetings
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* ================================================================
   FEATURE COMPONENT
================================================================ */

const Feature = ({ icon, title, subtitle }) => (
  <div className="flex min-w-0 flex-col items-start">
    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-600 shadow-sm">
      {React.cloneElement(icon, {
        className: "h-4 w-4",
      })}
    </div>

    <p className="text-xs font-semibold text-slate-800">{title}</p>

    <p className="mt-0.5 text-[10px] leading-4 text-slate-400">{subtitle}</p>
  </div>
);

export default Dashboard;
