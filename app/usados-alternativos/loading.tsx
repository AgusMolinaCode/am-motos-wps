import React from "react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
          {[...Array(10)].map((_, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-2 bg-gray-200 dark:bg-gray-800 animate-pulse"
            >
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
