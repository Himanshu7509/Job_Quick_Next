"use client"
import React from "react";
import {
  MonitorCheck,
  DatabaseZap,
  ShoppingBag,
  UserSearch,
  WalletCards,
  Building2,
  GraduationCap,
  Wallet,
} from "lucide-react";
//import { useNavigate } from "react-router-dom";

const Categories = () => {
 // const navigate = useNavigate();

  const categories = [
    { icon: MonitorCheck, title: "IT & Networking", jobs: 1254 },
    { icon: ShoppingBag, title: "Sales & Marketing", jobs: 816 },
    { icon: DatabaseZap, title: "Data Science", jobs: 2082 },
    { icon: UserSearch, title: "Customer Service", jobs: 1520 },
    { icon: Building2, title: "Digital Marketing", jobs: 1022 },
    { icon: GraduationCap, title: "Human Resource", jobs: 1496 },
    { icon: Wallet, title: "Project Manager", jobs: 1529 },
    { icon: WalletCards, title: "Accounting", jobs: 1244 },
  ];

  const handleCategoryClick = (categoryName) => {
  //  navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-[10%] lg:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Browse by Category
        </h1>
        <p className="text-gray-600 text-lg">
          Find your dream job in your preferred industry.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div
            key={category.title}
            onClick={() => handleCategoryClick(category.title)}
            className="bg-white rounded p-6 shadow-lg hover:shadow-2xl border border-transparent transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-teal-100 mb-5 shadow-md">
                <category.icon className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {category.title}
              </h3>
              <span className="text-teal-500 bg-teal-50 px-3 py-1 rounded-full text-sm">
                {category.jobs} jobs
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
