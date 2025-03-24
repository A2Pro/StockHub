'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { FiClock, FiExternalLink, FiTag, FiInfo } from 'react-icons/fi';

// Dynamic import with SSR disabled
const Navbar = dynamic(() => import('../components/navbar.js'), {
  ssr: false
});

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:9284/latest_news?count=10', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setArticles(data.articles);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Error loading news articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp * 1000), 'MMM d, yyyy • h:mm a');
  };

  // Return loading placeholder during server rendering
  if (!isClient) {
    return (
      <div className="flex h-screen bg-white text-black items-center justify-center">
        <div className="text-xl">Loading news articles...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-800">Financial News</h1>
          <p className="text-gray-600 mt-2">Stay updated with the latest market news and insights</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
                <button 
                  onClick={fetchNews}
                  className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article, index) => (
                  <a 
                    key={index} 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-start">
                        <span className="flex-1">{article.title}</span>
                        <FiExternalLink className="text-indigo-500 ml-2 flex-shrink-0 mt-1" />
                      </h2>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <FiClock className="mr-1" />
                        <span>{formatDate(article.datetime)}</span>
                        <span className="mx-2">•</span>
                        <span>{article.source}</span>
                      </div>
                      
                      {article.summary && (
                        <p className="text-gray-700 mb-4">{article.summary}</p>
                      )}
                      
                      {article.related && (
                        <div className="flex items-center text-sm">
                          <FiTag className="text-indigo-500 mr-2" />
                          <div className="flex flex-wrap gap-2">
                            {article.related.split(',').map((ticker, i) => (
                              <span 
                                key={i} 
                                className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md"
                              >
                                {ticker.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  </a>
                ))}
                
                {articles.length === 0 && !isLoading && !error && (
                  <div className="text-center py-10 text-gray-500">
                    <FiInfo className="mx-auto text-4xl mb-2" />
                    <p>No news articles found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}