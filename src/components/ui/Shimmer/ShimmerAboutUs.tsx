import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerAboutUsProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const ShimmerAboutUs: React.FC<ShimmerAboutUsProps> = ({
  animationType = 'slide',
}) => {
  return (
    <div className="pb-20 md:pb-0 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - 2 column grid */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-gray-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Title, Text, Button */}
            <div className="space-y-6">
              {/* Large Title */}
              <Shimmer className="h-12 md:h-16 lg:h-20 w-full rounded mb-4" variant="bright" animationType={animationType} />
              <Shimmer className="h-12 md:h-16 lg:h-20 w-3/4 rounded mb-6" variant="bright" animationType={animationType} />
              
              {/* Text paragraph */}
              <Shimmer className="h-6 w-full rounded mb-2" animationType={animationType} />
              <Shimmer className="h-6 w-full rounded mb-2" animationType={animationType} />
              <Shimmer className="h-6 w-5/6 rounded mb-6" animationType={animationType} />
              
              {/* Button */}
              <Shimmer className="h-12 w-48 rounded-lg" variant="bright" animationType={animationType} />
            </div>

            {/* Right Side - Large Image */}
            <div className="relative flex items-center justify-center">
              <Shimmer className="w-full max-w-md h-96 md:h-[500px] rounded-2xl" variant="bright" animationType={animationType} />
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Section - Centered text block */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-3xl p-8 md:p-12 shadow-lg border border-primary-100">
              {/* Icon and Title */}
              <div className="flex items-center gap-4 mb-6">
                <Shimmer className="w-16 h-16 rounded-xl" variant="bright" animationType={animationType} />
                <Shimmer className="h-10 w-64 rounded" variant="bright" animationType={animationType} />
              </div>
              
              {/* Text lines */}
              <Shimmer className="h-5 w-full rounded mb-3" animationType={animationType} />
              <Shimmer className="h-5 w-full rounded mb-3" animationType={animationType} />
              <Shimmer className="h-5 w-full rounded mb-3" animationType={animationType} />
              <Shimmer className="h-5 w-4/5 rounded" animationType={animationType} />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - 2 column grid of cards */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro text */}
          <div className="max-w-4xl mx-auto mb-12">
            <Shimmer className="h-6 w-full rounded mb-2" animationType={animationType} />
            <Shimmer className="h-6 w-full rounded mb-2" animationType={animationType} />
            <Shimmer className="h-6 w-3/4 mx-auto rounded" animationType={animationType} />
          </div>

          {/* Impact Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200">
                {/* Icon circle and title */}
                <div className="flex items-center gap-4 mb-6">
                  <Shimmer className="w-16 h-16 rounded-xl" variant="bright" animationType={animationType} />
                  <Shimmer className="h-7 w-48 rounded" variant="bright" animationType={animationType} />
                </div>
                
                {/* List items */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shimmer className="w-2 h-2 rounded-full mt-2 flex-shrink-0" animationType={animationType} />
                    <Shimmer className="h-4 w-full rounded" animationType={animationType} />
                  </div>
                  <div className="flex items-start gap-3">
                    <Shimmer className="w-2 h-2 rounded-full mt-2 flex-shrink-0" animationType={animationType} />
                    <Shimmer className="h-4 w-full rounded" animationType={animationType} />
                  </div>
                  <div className="flex items-start gap-3">
                    <Shimmer className="w-2 h-2 rounded-full mt-2 flex-shrink-0" animationType={animationType} />
                    <Shimmer className="h-4 w-3/4 rounded" animationType={animationType} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section - Centered text block */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-3xl p-8 md:p-12 shadow-lg border border-primary-100">
              {/* Icon and Title */}
              <div className="flex items-center gap-4 mb-6">
                <Shimmer className="w-16 h-16 rounded-xl" variant="bright" animationType={animationType} />
                <Shimmer className="h-10 w-48 rounded" variant="bright" animationType={animationType} />
              </div>
              
              {/* Text lines */}
              <Shimmer className="h-5 w-full rounded mb-3" animationType={animationType} />
              <Shimmer className="h-5 w-full rounded mb-3" animationType={animationType} />
              <Shimmer className="h-5 w-4/5 rounded" animationType={animationType} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 md:pb-12 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Shimmer className="h-12 md:h-16 w-80 mx-auto rounded mb-6" variant="bright" animationType={animationType} />
            <Shimmer className="h-6 md:h-7 w-full rounded mb-3" variant="bright" animationType={animationType} />
            <Shimmer className="h-6 md:h-7 w-5/6 mx-auto rounded mb-8" variant="bright" animationType={animationType} />
            <Shimmer className="h-12 w-48 mx-auto rounded-lg" variant="bright" animationType={animationType} />
          </div>
        </div>
      </section>
    </div>
  );
};

