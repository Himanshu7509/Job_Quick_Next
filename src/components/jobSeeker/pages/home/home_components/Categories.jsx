"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getCategoriesApi, JobsAPi } from "@/components/utils/userApi/UserApi";
import Cookies from "js-cookie"; // Make sure to install this package if not already available

// Mapping of category titles to their corresponding icons
const categoryIcons = {
  "IT & Networking": MonitorCheck,
  "Sales & Marketing": ShoppingBag,
  "Data Science": DatabaseZap,
  "Customer Service": UserSearch,
  "Digital Marketing": Building2,
  "Human Resource": GraduationCap,
  "Project Manager": Wallet,
  Accounting: WalletCards,
};

const Categories = () => {
  // Static data to use when authToken is not present
  const staticCategories = [
    { icon: MonitorCheck, title: "IT & Networking", jobs: 1254 },
    { icon: ShoppingBag, title: "Sales & Marketing", jobs: 816 },
    { icon: DatabaseZap, title: "Data Science", jobs: 2082 },
    { icon: UserSearch, title: "Customer Service", jobs: 1520 },
    { icon: Building2, title: "Digital Marketing", jobs: 1022 },
    { icon: GraduationCap, title: "Human Resource", jobs: 1496 },
    { icon: Wallet, title: "Project Manager", jobs: 1529 },
    { icon: WalletCards, title: "Accounting", jobs: 1244 },
  ];

  const router = useRouter();
  const [categoriesWithCounts, setCategoriesWithCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if authToken exists in cookies
    const authToken = Cookies.get("authToken");
    setIsAuthenticated(!!authToken);

    if (authToken) {
      // If authenticated, fetch from API
      fetchCategoriesWithCounts();
    } else {
      // If not authenticated, use static data
      const formattedStaticData = staticCategories.map((category) => ({
        _id: Math.random().toString(36).substr(2, 9), // Generate a random ID
        title: category.title,
        jobCount: category.jobs,
      }));

      setCategoriesWithCounts(formattedStaticData);
      setLoading(false);
    }
  }, []);

  const fetchCategoriesWithCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesResponse = await getCategoriesApi();
      const categoriesData = categoriesResponse.data;

      if (!categoriesData || categoriesData.length === 0) {
        setCategoriesWithCounts([]); // Handle empty array case
        setLoading(false);
        return;
      }

      // Fetch job counts for each category
      const categoriesWithCountsPromises = categoriesData.map(
        async (category) => {
          try {
            const jobsResponse = await JobsAPi({
              category: category.title,
            });
            return {
              ...category,
              jobCount: jobsResponse.data.jobs.length,
            };
          } catch (jobErr) {
            console.error(
              `Error fetching job count for category ${category.title}:`,
              jobErr
            );
            return { ...category, jobCount: 0 }; // or some other default
          }
        }
      );

      const categoriesWithCounts = await Promise.all(
        categoriesWithCountsPromises
      );
      setCategoriesWithCounts(categoriesWithCounts);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    router.push(`/jobs?category=${encodeURIComponent(categoryName)}`);
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
        {categoriesWithCounts.map((category) => {
          const Icon = categoryIcons[category.title] || null; // Get icon dynamically

          return (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category.title)}
              className="bg-white rounded p-6 shadow-lg hover:shadow-2xl border border-transparent transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-teal-100 mb-5 shadow-md">
                  {Icon ? (
                    <Icon className="w-7 h-7 text-teal-600" />
                  ) : (
                    <div>No Icon</div> // Or a default icon
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <span className="text-teal-500 bg-teal-50 px-3 py-1 rounded-full text-sm">
                  {category.jobCount} jobs
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;