"use client";
import React, { useEffect, useTransition } from "react";
import Categories from "./home_components/Categories";
import HeroSection from "./home_components/HeroSection";
import CompanyLogos from "./home_components/CompanyLogos";
import RecentJobs from "./home_components/RecentJobs";
import TopCompany from "./home_components/TopCompanies";
import HomeAbout from "./home_components/HomeAbout";
import Testimonials from "./home_components/Testimonals";
import Footer from "../../common/footer/Footer";
import Header from "../../common/header/Header";
import Loader from "@/components/Loader";

const Home = () => {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {});
  }, []);

  return (
    <>
      <Header />
      {isPending ? (
        <Loader />
      ) : (
        <>
          <HeroSection />
          <CompanyLogos />
          <RecentJobs />
          <Categories />
          <TopCompany />
          <HomeAbout />
          <Testimonials />
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
