import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
const About = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="min-h-screen w-full py-12 px-4 md:px-28">
        <h1 className=" font-semibold text-3xl">About </h1>
        <br />
        <div className="min-h-screen w-full  flex flex-col gap-8 rounded-b-4xl">
          <div className="bg-blue-100/25 min-h-80 rounded-4xl py-12 px-6 flex flex-col md:flex-row gap-4">
            <p className="text-lg font-semibold text-gray-600 w-full">
              At Janwani, we believe in the power of collective action to
              transform our communities. Civic issues, from local environmental
              concerns to broader social challenges, affect us all. But more
              importantly, they present opportunities for us to come together,
              innovate, and build a better future. <br /> <br />
              Traditional civic complaint systems in India are often opaque and
              slow. Citizens frequently feel unheard, and municipal bodies
              struggle to track issues in real-time across vast urban and rural
              landscapes. This lack of transparency leads to unresolved problems
              and a breakdown in public trust.
            </p>

            <img src="about1.png" className="h-auto w-full md:w-72" alt="" />
          </div>
          <div className="bg-blue-100/25 min-h-80 rounded-4xl py-12 px-6 flex flex-col md:flex-row gap-4">
            <img src="about2.png" className="h-auto w-full md:w-72" alt="" />
            <p className="text-lg font-semibold text-gray-600 w-full mt-3">
              We are dedicated to fostering active civic engagement and
              providing platforms for individuals to contribute meaningfully to
              solutions. Whether it's through advocating for policy changes,
              organizing community clean-ups, or supporting educational
              initiatives, we strive to create a tangible impact. <br /> <br />{" "}
              We understand that sustainable change requires collaboration, and
              we are committed to working alongside residents, local leaders,
              and other organizations to address the root causes of these
              issues.
            </p>
          </div>
          <div className="bg-blue-100/25 min-h-80 border-0 rounded-4xl py-12 px-6 flex flex-col md:flex-row gap-4">
            <p className="text-lg font-semibold text-gray-600 w-full mt-3">
              <h1 className="text-2xl text-black font-semibold">
                Why It Matters
              </h1>
              <br />
              By turning every citizen into a contributor, we aren’t just fixing
              roads or clearing garbage; we are strengthening the fabric of
              Indian democracy. Our platform fosters Digital India values,
              promoting a cleaner, greener, and more responsive nation for
              everyone.
              Our system uses modern tech stacks to ensure every report is logged, tracked, and visible, making governance more accountable than ever.
            </p>
            <img src="about3.png" className="h-auto w-full md:w-xl" alt="" />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default About;
