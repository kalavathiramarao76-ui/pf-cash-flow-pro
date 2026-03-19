use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecommendations } from '../lib/recommendations';
import { Recommendation } from '../types/recommendation';
import Link from 'next/link';
import { ArrowRightIcon } from '../components/icons';

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const storedRecommendations = localStorage.getItem('recommendations');
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    } else {
      getRecommendations().then((data) => {
        setRecommendations(data);
        localStorage.setItem('recommendations', JSON.stringify(data));
      });
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Recommendations</h1>
      <p className="text-lg mb-6">
        Based on your cash flow data, we've generated personalized recommendations to help you improve your financial situation.
      </p>
      <ul>
        {recommendations.map((recommendation, index) => (
          <li key={index} className="mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <h2 className="text-lg font-bold mb-2">{recommendation.title}</h2>
              <p className="text-lg mb-2">{recommendation.description}</p>
              <Link
                href={recommendation.link}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Learn more <ArrowRightIcon className="inline-block w-4 h-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}