"use client";
import React, { useEffect, useTransition } from "react";
import AboutSection from "./aboutComponents/AboutSection";
import AboutWork from "./aboutComponents/AboutWork";
import AboutQuestion from "./aboutComponents/AboutQuestion";
import AboutBestSec from "./aboutComponents/AboutBestSec";
import Footer from "../../common/footer/Footer";
import Header from "../../common/header/Header";
import Loader from "@/components/Loader";

const About = () => {
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
          <AboutSection />
          <AboutWork />
          <AboutQuestion />
          <AboutBestSec />
          <Footer />
        </>
      )}
    </>
  );
};

export default About;
