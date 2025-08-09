import React from "react";
import { Link } from "react-router";

const HeroSection = () => {
  return (
    <section className="bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-6 py-16 flex flex-col-reverse md:flex-row items-center gap-10">

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Manage Your BRAC University Thesis <br />
            <span className="text-[#7b1e3c]">With Ease</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-gray-400 max-w-lg">
            Study Sync helps BRAC University students and supervisors streamline
            thesis proposals, track progress, share resources, and collaborate effectively —
            all in one portal.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
            <Link
              to="/login"
              className="px-6 py-3 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition font-medium"
            >
              Get Started
            </Link>
            <Link
              to="/features"
              className="px-6 py-3 border border-[#7b1e3c] text-[#7b1e3c] dark:text-[#d08ea3] rounded-lg hover:bg-[#7b1e3c] hover:text-white dark:hover:text-white transition font-medium"
            >
              Explore Features
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src="../../../public/banner.jpg" 
            alt="Thesis management illustration"
            className="w-full h-full object-cover"
            
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
