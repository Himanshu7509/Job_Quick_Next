'use client';
import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br w-full from-gray-900 to-black text-white pt-16 pb-8 px-4 sm:px-10">
      <div className="flex flex-col lg:flex-row gap-2 mb-12">
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-8">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-teal-400" />
                <span className="text-xl sm:text-2xl font-bold">Job Quick</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                The Job Quick is a powerful job search platform that helps job seekers find their dream job quickly and efficiently.
              </p>
            </div>

            <div className="md:col-span-3 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-3 sm:mb-5 text-teal-400">
                Address
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                <strong>HEAD OFFICE:</strong> Office No. S11, Dharampeth Tower P No. 209, WHC Road, Nagpur- 44010
              </p>
              <div className="h-3"></div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                <strong>BRANCH OFFICE:</strong>The Iconic Corenthum, floor-25th sector-62, Noida UP- 201301
              </p>
            </div>
            
            <div className="md:col-span-2 lg:col-span-1 lg:pl-10">
              <h3 className="text-lg font-semibold mb-3 sm:mb-5 text-teal-400">
                Links
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { name: "Home", link: "/" },
                  { name: "Mocks", link: "/mock" },
                  { name: "Jobs", link: "/jobs" },
                  { name: "About", link: "/about" },
                  { name: "Contact Us", link: "/contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.link}
                      className="text-gray-400 hover:text-teal-400 transition duration-300 text-sm sm:text-base"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:hidden md:col-span-3">
              <h3 className="text-lg font-semibold mb-3 sm:mb-5 text-teal-400">
                Newsletter
              </h3>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Subscribe to stay updated on the latest job opportunities.
              </p>
              <div className="flex flex-col space-y-4 md:mr-16">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button className="bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition w-full">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block lg:w-1/4 mt-8 lg:mt-0">
          <h3 className="text-lg font-semibold mb-3 sm:mb-5 text-teal-400">
            Newsletter
          </h3>
          <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
            Subscribe to stay updated on the latest job opportunities.
          </p>
          <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-72 lg:w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button className="bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition w-full md:w-72 lg:w-full">
            Subscribe
          </button>
        </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
          © {new Date().getFullYear()} Job Portal. All rights reserved.
        </div>
        <div className="flex space-x-4">
          {[
            { Icon: Facebook, url: "https://facebook.com/" },
            { Icon: Twitter, url: "https://twitter.com/" },
            { Icon: Linkedin, url: "https://linkedin.com/in/" },
            { Icon: Instagram, url: "https://www.instagram.com/udaa.nous?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }
          ].map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="text-gray-400 hover:text-teal-400 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <item.Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;