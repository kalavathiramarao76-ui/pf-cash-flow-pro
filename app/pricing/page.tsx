use client;
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: number;
  features: string[];
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 9.99,
    features: ['Automated cash flow forecasting', 'Income and expense tracking', 'Basic alerts'],
  },
  {
    name: 'Pro',
    price: 19.99,
    features: [
      'Automated cash flow forecasting',
      'Income and expense tracking',
      'Advanced alerts',
      'Trend analysis',
      'Personalized recommendations',
    ],
  },
  {
    name: 'Business',
    price: 29.99,
    features: [
      'Automated cash flow forecasting',
      'Income and expense tracking',
      'Advanced alerts',
      'Trend analysis',
      'Personalized recommendations',
      'Multi-user support',
      'Customizable dashboards',
    ],
  },
];

const PricingPage = () => {
  const handleSignUp = (tier: PricingTier) => {
    localStorage.setItem('selectedTier', JSON.stringify(tier));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Pricing Plans</h1>
      <p className="text-lg mb-8">Choose a plan that fits your business needs</p>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8 w-full md:w-1/3"
          >
            <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
            <p className="text-lg mb-4">${tier.price}/month</p>
            <ul className="list-disc pl-4 mb-4">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSignUp(tier)}
            >
              Sign up <ArrowRight size={16} className="inline-block" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;