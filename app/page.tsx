'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    localStorage.setItem('email', email);
    alert('Thank you for subscribing!');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <Hero />
      <Features />
      <Pricing />
      <CallToAction email={email} setEmail={setEmail} handleSubscribe={handleSubscribe} />
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
        <p className="text-lg text-gray-600 mb-8">
          Cash Flow Pro helps small businesses and freelancers predict and manage their cash flow with automated forecasting and alerts.
        </p>
        <Link href="#features" className="btn btn-primary">
          Learn More
        </Link>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Feature
            icon={<ArrowRight size={24} />}
            title="Track Income and Expenses"
            description="Easily track your income and expenses to identify trends and make informed financial decisions."
          />
          <Feature
            icon={<ArrowRight size={24} />}
            title="Automated Forecasting"
            description="Get accurate and automated cash flow forecasts to help you plan for the future."
          />
          <Feature
            icon={<ArrowRight size={24} />}
            title="Personalized Recommendations"
            description="Receive personalized recommendations for improving your cash flow and reducing financial stress."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="w-full md:w-1/3 xl:w-1/3 p-6 bg-white rounded-lg shadow-md">
      {icon}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Pricing</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <PricingPlan
            title="Basic"
            price="$9.99"
            features={['Track Income and Expenses', 'Automated Forecasting']}
          />
          <PricingPlan
            title="Premium"
            price="$19.99"
            features={['Track Income and Expenses', 'Automated Forecasting', 'Personalized Recommendations']}
          />
        </div>
      </div>
    </section>
  );
}

function PricingPlan({ title, price, features }) {
  return (
    <div className="w-full md:w-1/2 xl:w-1/2 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-lg font-bold mb-4">{price}</p>
      <ul>
        {features.map((feature) => (
          <li key={feature} className="text-gray-600 mb-2">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CallToAction({ email, setEmail, handleSubscribe }) {
  return (
    <section id="call-to-action" className="py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Get Started Today!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Subscribe to our newsletter to stay up-to-date with the latest news and updates.
        </p>
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full md:w-1/2 xl:w-1/2 p-4 pl-10 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}