import React from "react";
import { Mail, MessageCircle, Send } from "lucide-react";

const Contact = () => {
  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-violet-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Get in touch
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            We'd love to <span className="text-violet-600">hear from you.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Have a question, feedback, or need help with VoxMeet? Send us a
            message and we'll be happy to help.
          </p>
        </div>

        {/* Contact Content */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Info */}
          <div className="rounded-3xl bg-violet-600 p-7 text-white shadow-lg sm:p-9">
            <h2 className="text-2xl font-semibold">Contact VoxMeet</h2>

            <p className="mt-4 text-sm leading-6 text-violet-100">
              We're here to help with questions, feedback, and anything else
              related to your VoxMeet experience.
            </p>

            <div className="mt-9 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-violet-200" />
                <div>
                  <p className="text-xs font-medium text-violet-200">Email</p>
                  <p className="mt-1 text-sm font-medium">
                    support@voxmeet.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 text-violet-200" />
                <div>
                  <p className="text-xs font-medium text-violet-200">Support</p>
                  <p className="mt-1 text-sm font-medium">
                    We're happy to help.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-700">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
