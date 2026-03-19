"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  PieChart,
  Bell,
  Lock,
  Globe,
  Menu,
  X,
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "AI-Powered Forecasting",
    description:
      "Predict your cash flow up to 12 months ahead using intelligent pattern recognition and recurring transaction analysis.",
    color: "indigo",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description:
      "Beautiful, interactive charts that make complex financial data easy to understand at a glance.",
    color: "violet",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "Your financial data is encrypted end-to-end with 256-bit AES encryption and stored securely.",
    color: "indigo",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description:
      "Get real-time alerts when your projected balance drops below your safety threshold.",
    color: "violet",
  },
  {
    icon: Clock,
    title: "Recurring Transactions",
    description:
      "Automatically detect and account for subscriptions, retainer clients, and monthly expenses.",
    color: "indigo",
  },
  {
    icon: DollarSign,
    title: "Multi-Currency Support",
    description:
      "Track income and expenses in multiple currencies with live exchange rate updates.",
    color: "violet",
  },
  {
    icon: PieChart,
    title: "Expense Categories",
    description:
      "Organize spending into customizable categories to see exactly where your money goes.",
    color: "indigo",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Receive proactive notifications before cash flow problems occur, not after.",
    color: "violet",
  },
  {
    icon: Globe,
    title: "Anywhere Access",
    description:
      "Access your financial dashboard from any device, browser, or operating system.",
    color: "indigo",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
    quote:
      "Cash Flow Pro transformed how I manage my freelance income. I can now see 6 months ahead and plan projects accordingly. No more cash flow surprises!",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Small Business Owner",
    avatar: "MR",
    quote:
      "We used to spend hours every week manually forecasting. Now Cash Flow Pro does it automatically and we trust the numbers completely.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Independent Consultant",
    avatar: "PP",
    quote:
      "The 12-month projection feature is incredible. I negotiated better payment terms with clients because I could show them my cash position with confidence.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "How does Cash Flow Pro forecast my cash flow?",
    answer:
      "Cash Flow Pro analyzes your recurring income and expenses, applies pattern recognition to your transaction history, and generates projections for 3, 6, or 12 months ahead. You can also manually add expected future transactions to refine the forecast.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. All data is stored locally in your browser using encrypted localStorage. We never send your financial data to external servers without your explicit consent. Your data stays with you.",
  },
  {
    question: "Can I use Cash Flow Pro for my small business?",
    answer:
      "Yes! Cash Flow Pro is designed for both freelancers and small business owners. The Pro and Business tiers offer team collaboration, multiple accounts, and advanced reporting features.",
  },
  {
    question: "What happens if I cancel my subscription?",
    answer:
      "You can cancel anytime with no questions asked. You'll retain access until the end of your billing period. Your data is always exportable in CSV or JSON format.",
  },
  {
    question: "Does Cash Flow Pro connect to my bank?",
    answer:
      "In the Pro and Business tiers, you can connect bank accounts via our secure integration partners. All free tier users can manually enter transactions or import CSV files.",
  },
  {
    question: "How accurate are the forecasts?",
    answer:
      "Our forecasting engine achieves 92% accuracy on a 3-month horizon for users with at least 3 months of transaction history. Accuracy improves over time as the system learns your financial patterns.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with cash flow visibility.",
    features: [
      "Up to 50 transactions/month",
      "3-month forecasting",
      "Basic expense categories",
      "Manual transaction entry",
      "CSV export",
    ],
    cta: "Start Free",
    href: "/dashboard",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious freelancers who need deeper financial insights.",
    features: [
      "Unlimited transactions",
      "12-month forecasting",
      "AI pattern recognition",
      "Bank account sync",
      "Smart alerts & notifications",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start 14-Day Trial",
    href: "/dashboard",
    highlight: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    description: "For small businesses that need team collaboration and reporting.",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Multi-currency support",
      "Custom categories & tags",
      "API access",
      "White-label reports",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/pricing",
    highlight: false,
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-indigo-500 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 bg-white">
          <p className="text-slate-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Cash Flow <span className="text-indigo-600">Pro</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                FAQ
              </a>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 flex flex-col gap-3">
            <a href="#features" className="text-sm font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-indigo-400/10 to-violet-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4" />
              Now with AI-powered 12-month forecasting
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Know Your Cash Flow{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Before It Happens
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Cash Flow Pro gives freelancers and small businesses automated cash flow forecasting,
              real-time tracking, and intelligent alerts — so you&apos;re always one step ahead of your finances.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Start Forecasting Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/forecasting"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-xl text-lg border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5"
              >
                Try the Calculator
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Setup in 2 minutes
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Users", value: "12,400+" },
              { label: "Transactions Tracked", value: "$2.1B+" },
              { label: "Forecast Accuracy", value: "92%" },
              { label: "Time Saved / Month", value: "8 hrs" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 bg-white/20 rounded-md px-3 py-1 ml-4 text-white/80 text-xs">
                  cashflowpro.app/dashboard
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Current Balance", value: "$24,350", change: "+12.5%", positive: true },
                  { label: "Monthly Income", value: "$8,200", change: "+3.2%", positive: true },
                  { label: "Monthly Expenses", value: "$3,840", change: "-8.1%", positive: false },
                ].map((card) => (
                  <div key={card.label} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-medium">{card.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{card.value}</p>
                    <p className={`text-sm font-medium ${card.positive ? "text-green-600" : "text-rose-600"}`}>
                      {card.change} vs last month
                    </p>
                  </div>
                ))}
              </div>

              {/* Mock chart */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Cash Flow Forecast — Next 6 Months</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">Live Preview</span>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {[65, 72, 68, 85, 90, 88, 95, 100, 92, 98, 105, 110].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-sm transition-all ${
                          i < 6
                            ? "bg-indigo-500"
                            : "bg-gradient-to-t from-violet-400 to-violet-300 opacity-60"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                    <span className="text-xs text-slate-500">Actual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-violet-400 opacity-60" />
                    <span className="text-xs text-slate-500">Forecasted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4" />
              Everything you need
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Powerful features for{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                financial clarity
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every tool you need to understand your cash position today and predict it with confidence tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.color === "indigo"
                        ? "bg-indigo-100 group-hover:bg-indigo-500"
                        : "bg-violet-100 group-hover:bg-violet-500"
                    } transition-colors`}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        feature.color === "indigo"
                          ? "text-indigo-600 group-hover:text-white"
                          : "text-violet-600 group-hover:text-white"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-violet-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Users className="w-4 h-4" />
              Loved by thousands
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Real results from real users
            </h2>
            <p className="text-lg text-slate-600">
              Join 12,000+ freelancers and small businesses who trust Cash Flow Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <DollarSign className="w-4 h-4" />
              Simple, transparent pricing
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Plans that grow{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                with you
              </span>
            </h2>
            <p className="text-lg text-slate-600">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border ${
                  plan.highlight
                    ? "bg-gradient-to-b from-indigo-600 to-violet-700 border-indigo-500 shadow-2xl shadow-indigo-500/25 scale-105"
                    : "bg-white border-slate-200"
                }`}
              >
                {plan.highlight && (
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlight ? "text-indigo-200" : "text-indigo-500"
                        }`}
                      />
                      <span className={`text-sm ${plan.highlight ? "text-indigo-100" : "text-slate-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full text-center font-semibold py-3 rounded-xl transition-all ${
                    plan.highlight
                      ? "bg-white text-indigo-700 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about Cash Flow Pro.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-12 relative overflow-hidden shadow-2xl shadow-indigo-500/30">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 font-medium">Cash Flow Pro</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Ready to take control of your cash flow?
              </h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of freelancers and business owners who forecast their finances with confidence.
                Start for free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  Start Forecasting Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/forecasting"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg border border-white/20 transition-all"
                >
                  Try the Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Cash Flow Pro</span>
              </div>
              <p className="text-sm leading-relaxed">
                Automated cash flow forecasting for freelancers and small businesses. Know your financial future before it arrives.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/forecasting" className="hover:text-white transition-colors">Forecasting</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Cash Flow Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
