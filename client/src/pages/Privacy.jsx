import React from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

const Privacy = () => {
  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/50 px-6 py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-violet-600 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your privacy matters
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Privacy <span className="text-violet-600">Policy</span>
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 2026
          </p>
        </div>

        {/* Policy */}
        <div className="mt-12 space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Information We Collect
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              VoxMeet may collect information required to create and manage your
              account, provide meeting functionality, and maintain the
              reliability and security of the platform.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              2. How We Use Information
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Information may be used to authenticate users, provide meeting
              services, maintain session history, improve the platform, and
              communicate important service-related information.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              3. Meeting Data
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              VoxMeet uses real-time communication technologies to facilitate
              video, audio, and other meeting interactions. Meeting information
              may be processed to provide the requested functionality.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              4. Authentication & Security
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Account authentication is handled using secure authentication
              services. We take reasonable measures to protect information
              associated with the platform.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              5. Third-Party Services
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              VoxMeet may rely on third-party services for authentication,
              hosting, databases, real-time communication, and other
              infrastructure required to operate the application.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                6. Your Privacy
              </h2>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              We aim to keep the information associated with your VoxMeet
              account secure and use it only as necessary to provide and improve
              the service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
