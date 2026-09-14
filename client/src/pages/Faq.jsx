import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

const faqs = [
  {
    question: "What is VoxMeet?",
    answer:
      "VoxMeet is a real-time video meeting platform that allows users to create and join meetings with video, audio, screen sharing, real-time chat, and meeting history.",
  },
  {
    question: "Is VoxMeet free to use?",
    answer:
      "Yes. VoxMeet has a Free plan that allows up to 150 meetings per month with up to 10 participants per meeting.",
  },
  {
    question: "How many participants can join a meeting?",
    answer:
      "Free users can have up to 10 participants in a meeting, while Premium users can have up to 100 participants.",
  },
  {
    question: "Does VoxMeet support screen sharing?",
    answer:
      "Yes. Participants can share their screen directly from the meeting room using the browser's built-in screen sharing functionality.",
  },
  {
    question: "Does VoxMeet support real-time chat?",
    answer:
      "Yes. Participants can send messages to each other in real time while they are in the same meeting.",
  },
  {
    question: "Can I access my previous meeting history?",
    answer:
      "Yes. VoxMeet stores meeting information, participants, and chat messages so that you can review your previous meeting sessions.",
  },
  {
    question: "Do I need to create an account to use VoxMeet?",
    answer:
      "Authentication is required for creating and joining meetings. VoxMeet uses Clerk to securely manage user authentication.",
  },
  {
    question: "What is the difference between Free and Premium?",
    answer:
      "The Free plan includes up to 150 meetings per month and up to 10 participants per meeting. Premium provides unlimited meetings and supports up to 100 participants per meeting.",
  },
  {
    question: "How much does VoxMeet Premium cost?",
    answer:
      "VoxMeet Premium costs ₹499 as a one-time payment and provides unlimited meetings with support for up to 100 participants per meeting.",
  },
  {
    question: "Is my video or audio stored?",
    answer:
      "No. VoxMeet uses WebRTC for real-time audio and video communication. Meeting history and chat-related information are stored separately for session management.",
  },
  {
    question: "Which browser can I use with VoxMeet?",
    answer:
      "VoxMeet works best on modern browsers that support WebRTC and browser-based screen sharing.",
  },
  {
    question: "How can I contact VoxMeet?",
    answer: "You can visit the Contact Us page to get in touch with VoxMeet.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/50 px-6 py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-violet-600 shadow-sm">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently asked questions
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Everything you need to{" "}
            <span className="text-violet-600">know.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Find quick answers about meetings, screen sharing, chat,
            authentication, plans, and more.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur transition-all ${
                  isOpen
                    ? "border-violet-200 shadow-violet-100/70"
                    : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                      isOpen
                        ? "bg-violet-100 text-violet-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-sm leading-6 text-slate-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Card */}
        <div className="mt-10 rounded-3xl border border-violet-100 bg-white/80 p-7 text-center shadow-sm backdrop-blur sm:p-9">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <MessageCircle className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Still have questions?
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            If you need more help, feel free to reach out to us through the
            Contact Us page.
          </p>

          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
};

export default Faq;
