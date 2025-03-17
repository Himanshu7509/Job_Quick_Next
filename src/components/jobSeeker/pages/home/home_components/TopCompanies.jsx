"use client";
import React from "react";
import { MapPin, Briefcase, Clock, Star, ExternalLink } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbCategory } from "react-icons/tb";

// Import required Swiper styles
import "swiper/css";

const TopCompany = () => {
  const router = useRouter();

  const popularJobs = [
    {
      company: "Google",
      logo: "https://www.pngmart.com/files/22/Google-PNG-Pic.png",
      position: "Senior Software Engineer",
      location: "Mountain View, CA",
      jobType: "Full-time",
      salary: "12 LPA - 30 LPA",
      category: "Human Resource",
      applyUrl: "https://careers.google.com",
      rating: 4.8,
      reviewCount: 12453,
      workType: "Hybrid",
      experience: "3 to 5 years",
      description:
        "Join our innovative team to build next-generation search technologies that help billions of users worldwide.",
      benefits: [
        "Flexible work hours",
        "Comprehensive health benefits",
        "Professional development",
        "Stock options",
      ],
    },
    {
      company: "Amazon",
      logo: "https://pngteam.com/images/amazon-logo-png-2400x2001_abf78dd4_transparent_202878.png.png",
      position: "Product Manager",
      location: "Seattle, WA",
      jobType: "Full-time",
      salary: "10 LPA - 25 LPA",
      category: "Data Science",
      applyUrl: "https://amazon.jobs",
      rating: 4.6,
      workType: "OnSite",
      experience: "more than 5 years",
      description:
        "Drive the strategy and execution of customer-centric products that revolutionize e-commerce experience.",
      benefits: [
        "Remote work options",
        "401(k) matching",
        "Relocation assistance",
        "Career advancement",
      ],
    },
    {
      company: "Microsoft",
      logo: "https://www.freepnglogos.com/uploads/microsoft-windows-logo-png-images-30.png",
      position: "Cloud Solutions Architect",
      location: "Redmond, WA",
      jobType: "Full-time",
      salary: "14 LPA - 40 LPA",
      category: "Data Science",
      applyUrl: "https://careers.microsoft.com",
      rating: 4.7,
      workType: "Remote",
      experience: "3 to 5 years",
      description:
        "Help enterprise customers design and implement cutting-edge solutions using Microsoft's Azure cloud platform.",
      benefits: [
        "Work-life balance",
        "Generous PTO",
        "Training allowance",
        "Health & wellness programs",
      ],
    },
    {
      company: "Apple",
      logo: "https://www.pngall.com/wp-content/uploads/11/Apple-Logo-PNG-HD-Image.png",
      position: "iOS Developer",
      location: "Cupertino, CA",
      jobType: "Full-time",
      salary: "13 LPA - 16 LPA",
      category: "Data Science",
      applyUrl: "https://apple.com/careers",
      rating: 4.9,
      workType: "OnSite",
      experience: "1 to 3 years",
      description:
        "Join Apple to work on cutting-edge iOS applications and contribute to our growing ecosystem.",
      benefits: [
        "Employee stock purchase plan",
        "Wellness and fitness reimbursement",
        "Advanced training programs",
        "Flexible work schedules",
      ],
    },
    {
      company: "Meta",
      logo: "https://www.buscopng.com/wp-content/uploads/Meta-logo-6cbf608d.png",
      position: "AR/VR Engineer",
      location: "Menlo Park, CA, USA",
      jobType: "Full-time",
      salary: "11 LPA - 15 LPA",
      category: "IT & Networking",
      applyUrl: "https://meta.com/careers",
      rating: 4.5,
      workType: "Hybrid",
      experience: "3 to 5 years",
      description:
        "Develop and optimize AR/VR applications that power the future of virtual interactions at Meta.",
      benefits: [
        "Health and wellness benefits",
        "Remote-friendly policies",
        "Stock options",
        "Professional development programs",
      ],
    },
    {
      company: "Netflix",
      logo: "https://i.pinimg.com/originals/56/51/14/5651147964cb73f605089b47df4fe70f.png",
      position: "Senior Backend Engineer",
      location: "Los Gatos, CA, USA",
      jobType: "Full-time",
      salary: "11 LPA - 15 LPA",
      category: "Data Science",
      applyUrl: "https://netflix.com/careers",
      rating: 4.7,
      workType: "Remote",
      experience: "more than 5 years",
      description:
        "Build and optimize scalable backend systems that support Netflix's global content delivery.",
      benefits: [
        "Unlimited vacation policy",
        "Free Netflix subscription",
        "Health insurance coverage",
        "Employee wellness programs",
      ],
    },
  ];

  // Function to handle company click and navigate to Jobs page
  const handleCompanyClick = (companyName) => {
    router.push(`/jobs?title=${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="py-20 px-6 md:px-[10%] bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Top Companies
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Discover opportunities at the world's leading technology companies
        </p>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={32}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {popularJobs.map((job, index) => (
          <SwiperSlide key={index}>
            <div
              onClick={() => handleCompanyClick(job.company)}
              className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-200 flex flex-col h-full"
            >
              {/* Company header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 relative">
                    
                    <img src={job.logo} alt="logo" className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.company}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < Math.floor(job.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job details */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-auto">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {job.position}
                  </h4>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <TbCategory className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span>{job.category}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span>{job.jobType}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg mb-6">
                    <p className="text-teal-800 font-medium mb-1">
                      Compensation
                    </p>
                    <p className="text-gray-700">{job.salary}</p>
                  </div>
                </div>

                <Link
                  href={job.applyUrl}
                  className="flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors gap-2 mt-auto"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopCompany;
