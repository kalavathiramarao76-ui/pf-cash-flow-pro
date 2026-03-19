"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle,
  X,
  Home,
  BarChart3,
  DollarSign,
  Shield,
  Zap,
  Users,
  Star,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for individuals tracking personal finances or getting started with cash flow management.",
    cta: "Get Started Free",
    ctaHref: "/dashboard",
    highlight: false,
    badge: null,
    features: {
      "Transactions / month": "50",
      "Forecast horizon": "3 months",
      "Recurring items": "5",
      "Bank sync": false,
      "AI pattern recognition": false,
      "Smart alerts": false,
      "CSV export": true,
      "Multi-currency": false,
      "Team members": "1",
      "Priority support": false,
      "API access": false,
      "White-label reports": false,
    },
  },
  {
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: "For freelancers and solopreneurs who need deeper visibility and automation.",
    cta: "Start 14-Day Trial",
    ctaHref: "/dashboard",
    highlight: true,
    badge: "Most Popular",
    features: {
      "Transactions / month": "Unlimited",
      "Forecast horizon": "12 months",
      "Recurring items": "Unlimited",
      "Bank sync": true,
      "AI pattern recognition": true,
      "Smart alerts": true,
      "CSV export": true,
      "Multi-currency": true,
      "Team members": "1",
      "Priority support": true,
      "API access": false,
      "White-label reports": false,
    },
  },
  {
    name: "Business",
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: "For small businesses that need team collaboration, advanced reporting, and API access.",
    cta: "Contact Sales",
    ctaHref: "mailto:sales@cashflowpro.app",
    highlight: false,
    badge: "Best for Teams",
    features: {
      "Transactions / month": "Unlimited",
      "Forecast horizon": "12 months",
      "Recurring items": "Unlimited",
      "Bank sync": true,
      "AI pattern recognition": true,
      "Smart alerts": true,
      "CSV export": true,
      "Multi-currency": true,
      "Team members": "Up to 5",
      "Priority support": true,
      "API access": true,
      "White-label reports": true,
    },
  },
];

const allFeatureKeys = [
  "Transactions / month",
  "Forecast horizon",
  "Recurring items",
  "Bank sync",
  "AI pattern recognition",
  "Smart alerts",
  "CSV export",
  "Multi-currency",
  "Team members",
  "Priority support",
  "API access",
  "White-label reports",
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be prorated for any billing adjustments.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual Business plans.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! The Pro plan comes with a 14-day free trial — no credit card required. The Business plan includes a 7-day trial.",
  },
  {
    q: "What happens to my data if I downgrade?",
    a: "Your data is always preserved. If you exceed the free tier limits, your data is archived and can be restored by upgrading again.",
  },
  {
    q: "Do you offer discounts for nonprofits or students?",
    a: "Yes! We offer 50% off for registered nonprofits and educational institutions. Contact support@cashflowpro.app for details.",
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle className="w-5 h-5 text-indigo-500 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-slate-300 mx-auto" />
    );
  }
  return <span className="text-sm text-slate-700 font-medium">{value}</span>;
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 hidden sm:block">Cash Flow Pro</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <Home className="w-4 h-4" />
                <span className="hidden sm:block">Home</span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:block">Dashboard</span>
              </Link>
              <Link href="/forecasting" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:block">Forecasting</span>
              </Link>
              <Link href="/pricing" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 transition-colors">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:block">Pricing</span>
              </Link>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <DollarSign className="w-4 h-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
            Choose your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              plan
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Start free. Upgrade when you need more power. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Yearly
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  plan.highlight
                    ? "border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-center py-2">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  </div>
                )}
                {plan.badge && !plan.highlight && (
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-center py-2">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  </div>
                )}
                {!plan.badge && (
                  <div className="h-9" />
                )}

                <div className={`p-8 ${plan.highlight ? "bg-gradient-to-b from-indigo-600 to-violet-700" : "bg-white"}`}>
                  <h2 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h2>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={`text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                        /{billing === "monthly" ? "mo" : "mo, billed yearly"}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed mb-6 ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                    {plan.description}
                  </p>
                  <Link
                    href={plan.ctaHref}
                    className={`block w-full text-center font-semibold py-3 rounded-xl transition-all ${
                      plan.highlight
                        ? "bg-white text-indigo-700 hover:bg-indigo-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-16">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Full feature comparison</h2>
            <p className="text-slate-500 text-sm mt-1">Everything side-by-side.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 w-1/3">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="text-center px-4 py-4 text-sm font-bold text-slate-900 w-1/6">
                      <span className={plan.highlight ? "text-indigo-600" : ""}>{plan.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allFeatureKeys.map((key) => (
                  <tr key={key} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">{key}</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-4 py-4 text-center">
                        <FeatureValue value={(plan.features as Record<string, boolean | string>)[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Shield,
              title: "Bank-grade security",
              description: "256-bit AES encryption, SOC 2 Type II certified, GDPR compliant.",
            },
            {
              icon: Zap,
              title: "99.9% uptime SLA",
              description: "We guarantee availability so your financial data is always accessible.",
            },
            {
              icon: Users,
              title: "World-class support",
              description: "Live chat, email, and phone support for Pro and Business customers.",
            },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{badge.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-1">Rated 4.9/5 from 2,400+ reviews</p>
          <p className="text-slate-500 text-sm">on Product Hunt, G2, and Capterra</p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800 pr-4">{faq.q}</span>
                  <span className={`text-indigo-500 font-bold text-lg transition-transform ${expandedFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/30">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start forecasting your cash flow today
            </h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
              Join 12,000+ freelancers and small businesses. Free forever, no credit card required.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">Cash Flow Pro</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Cash Flow Pro. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
