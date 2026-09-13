import React, { useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    if (name === "name") {
      if (!trimmedValue) {
        return "Name is required.";
      }

      if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(trimmedValue)) {
        return "Name can contain only letters and spaces.";
      }

      if (trimmedValue.length < 2) {
        return "Name must be at least 2 characters.";
      }
    }

    if (name === "email") {
      if (!trimmedValue) {
        return "Email is required.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedValue)) {
        return "Please enter a valid email address.";
      }
    }

    if (name === "subject") {
      if (!trimmedValue) {
        return "Subject is required.";
      }

      if (trimmedValue.length < 3) {
        return "Subject must be at least 3 characters.";
      }
    }

    if (name === "message") {
      if (!trimmedValue) {
        return "Message is required.";
      }

      if (trimmedValue.length < 10) {
        return "Message must be at least 10 characters.";
      }
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);

      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    toast.success("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setErrors({});
  };

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
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
                    errors.email
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="mt-5">
              <label className="text-sm font-medium text-slate-700">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
                  errors.subject
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                }`}
              />

              {errors.subject && (
                <p className="mt-1.5 text-xs text-red-500">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div className="mt-5">
              <label className="text-sm font-medium text-slate-700">
                Message
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Write your message..."
                className={`mt-2 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
                  errors.message
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                }`}
              />

              {errors.message && (
                <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-900 hover:shadow-md"
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
