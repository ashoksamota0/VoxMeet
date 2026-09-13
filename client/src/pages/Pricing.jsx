import React, { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import api from "../config/api";

const plans = [
  {
    name: "Free",
    description: "Everything you need to get started with VoxMeet.",
    price: "₹0",
    period: "forever",
    features: [
      "150 meetings per month",
      "Up to 10 participants per meeting",
      "Real-time video & audio",
      "Real-time chat",
      "Screen sharing",
      "Meeting history",
    ],
    button: "Current Plan",
    popular: false,
  },
  {
    name: "Premium",
    description: "For teams and users who need more from their meetings.",
    price: "₹499",
    period: "per month",
    features: [
      "Unlimited meetings",
      "Up to 100 participants per meeting",
      "Real-time video & audio",
      "Real-time chat",
      "Screen sharing",
      "Meeting history",
      "Priority access to new features",
    ],
    button: "Upgrade to Premium",
    popular: true,
  },
];

const Pricing = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free");

  // Load Razorpay Checkout
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) return;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Razorpay Checkout loaded");
      };

      script.onerror = () => {
        console.error("Failed to load Razorpay Checkout");
      };

      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  // Fetch current plan
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();

        if (!token) return;

        const response = await api.get("/api/meetings/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentPlan(response.data.plan || "free");
      } catch (error) {
        console.error("Failed to fetch current plan:", error);
      }
    };

    fetchCurrentPlan();
  }, [isLoaded, isSignedIn, getToken]);

  const handleUpgrade = async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast.error("Please login to upgrade to Premium.");
      return;
    }

    if (currentPlan === "premium") {
      toast("You are already on the Premium plan.");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment system is still loading. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        toast.error("Authentication failed. Please login again.");
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const response = await api.post(
        "/api/payments/create-order",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { orderId, amount, currency, keyId, user } = response.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "VoxMeet",
        description: "VoxMeet Premium - Monthly Plan",
        order_id: orderId,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#7c3aed",
        },

        handler: async (paymentResponse) => {
          try {
            toast("Verifying your payment...");

            const verifyResponse = await api.post(
              "/api/payments/verify",
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (verifyResponse.data.success) {
              setCurrentPlan("premium");

              toast.success("Payment successful! Premium plan activated.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);

            toast.error(
              error.response?.data?.error || "Payment verification failed.",
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            toast("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);

        toast.error(
          response.error?.description || "Payment failed. Please try again.",
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Premium upgrade failed:", error);

      toast.error(
        error.response?.data?.error || "Unable to start Premium upgrade.",
      );

      setLoading(false);
    }
  };

  const isPremium = currentPlan === "premium";

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-violet-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Simple and flexible plans
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Choose the plan that{" "}
            <span className="text-violet-600">fits you.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Start with the free plan or unlock more capacity for your growing
            meetings with VoxMeet Premium.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan =
              (plan.name === "Premium" && isPremium) ||
              (plan.name === "Free" && !isPremium);

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8 ${
                  plan.popular
                    ? "border-violet-300 shadow-violet-100"
                    : "border-slate-200"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-7 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-slate-900">
                    {plan.price}
                  </span>

                  <span className="mb-1 text-sm text-slate-500">
                    / {plan.period}
                  </span>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={
                    plan.name === "Premium" && !isPremium
                      ? handleUpgrade
                      : undefined
                  }
                  disabled={plan.name === "Free" || isCurrentPlan || loading}
                  className={`mt-7 w-full rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    plan.name === "Premium" && !isCurrentPlan
                      ? "cursor-pointer bg-violet-600 text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                      : "cursor-default border border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {loading && plan.name === "Premium" && !isPremium ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : plan.name === "Free" ? (
                    isPremium ? (
                      "Free Plan"
                    ) : (
                      "Current Plan"
                    )
                  ) : isPremium ? (
                    "Current Plan"
                  ) : (
                    "Upgrade to Premium"
                  )}
                </button>

                {/* Features */}
                <div className="mt-8 border-t border-slate-100 pt-7">
                  <p className="text-sm font-semibold text-slate-900">
                    What's included
                  </p>

                  <ul className="mt-4 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                          <Check className="h-3.5 w-3.5" />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white/70 px-6 py-5 text-center shadow-sm backdrop-blur">
          <p className="text-sm text-slate-500">
            Need help choosing a plan?{" "}
            <span className="font-medium text-violet-600">
              Start with Free and upgrade when you need more.
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
