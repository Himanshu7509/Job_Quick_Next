"use client"
import React from 'react';
import Image from 'next/image'; // Use Next.js Image optimization

import adobe from "@/components/assets/adobe.png"; 
import asana from "@/components/assets/asana.png";
import linear from "@/components/assets/linear.png";
import slack from "@/components/assets/slack.png";
import spotify from "@/components/assets/spotify.png";

const CompanyLogos = () => {
  const logos = [
    { src: spotify, alt: "Spotify" },
    { src: slack, alt: "Slack" },
    { src: adobe, alt: "Adobe" },
    { src: asana, alt: "Asana" },
    { src: linear, alt: "Linear" }
  ];

  return (
    <section className="hidden md:block py-8 md:py-12 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div key={index} className="w-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120} // Set a width for Next.js optimization
                height={50} // Set a height for Next.js optimization
                className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CompanyLogos;