"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen bg-white mt-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2a1525] via-[#0f1629] to-[#1a0f1a] min-h-screen flex items-center">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3d1f35]/30 via-black/40 to-[#2d1529]/40 animate-pulse"></div>

        {/* Decorative elements */}
        <aside
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-20 left-10 w-32 h-1 bg-white/20 rotate-45 blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-1 bg-white/30 -rotate-12 blur-sm"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-1 bg-white/25 rotate-12 blur-sm"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-1 bg-white/20 -rotate-45 blur-sm"></div>
          <div className="absolute bottom-20 right-10 w-28 h-1 bg-white/25 rotate-30 blur-sm"></div>

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-[#3d1f35]/20 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute top-1/2 left-1/6 w-8 h-8 bg-[#2d1529]/30 rounded-full blur-md animate-ping"></div>
        </aside>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <article className="space-y-8">
              <header className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                  <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Guard Management
                  </span>
                  <span className="block bg-gradient-to-r from-gray-100 via-white to-gray-300 bg-clip-text text-transparent font-extrabold">
                    System
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-100 leading-relaxed max-w-lg font-medium drop-shadow-lg">
                  Streamline your security operations with our
                  <span className="font-bold text-white">
                    {" "}
                    comprehensive platform
                  </span>{" "}
                  designed for
                  <span className="font-bold text-white">
                    {" "}
                    modern security management
                  </span>{" "}
                  needs.
                </p>
              </header>

              <section className="space-y-6 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-white to-gray-300 rounded-full shadow-lg"></div>
                  <span className="text-white font-semibold text-lg">
                    Real-time guard tracking and monitoring
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-white to-gray-300 rounded-full shadow-lg"></div>
                  <span className="text-white font-semibold text-lg">
                    Automated scheduling and shift management
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-white to-gray-300 rounded-full shadow-lg"></div>
                  <span className="text-white font-semibold text-lg">
                    Comprehensive reporting and analytics
                  </span>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Link
                  href="/login"
                  className="group relative bg-white text-[#0f1629] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
                >
                  <span className="relative z-10">Login Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <button className="group relative border-2 border-white text-white hover:bg-white hover:text-[#0f1629] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105 transform backdrop-blur-sm">
                  <span className="relative z-10">Learn More</span>
                </button>
              </div>
            </article>

            <aside className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                  <Image
                    src="/images/BannerLoginScreen.webp"
                    alt="Guard Management System Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover rounded-2xl"
                    priority
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-[#2a1525]/30 to-transparent rounded-3xl"></div>
              </div>

              {/* Enhanced floating elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-white/10 to-[#2d1529]/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-[#3d1f35]/20 to-white/10 rounded-full blur-3xl animate-bounce"></div>
              <div className="absolute top-1/3 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-ping"></div>
            </aside>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </section>

      {/* Updated second section with complementary colors */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0f1629] to-[#2a1525] bg-clip-text text-transparent mb-6">
              Trusted by Security Professionals
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-xl font-medium">
              Join thousands of security companies who rely on our platform to
              manage their operations
              <span className="font-bold text-[#2d1529]">
                {" "}
                efficiently and effectively
              </span>
              .
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
