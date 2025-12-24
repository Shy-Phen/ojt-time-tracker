import timeit2 from "../assets/timeit2.svg";
import { SignInButton, SignedOut, UserButton } from "@clerk/clerk-react";
import { ArrowBigRight } from "lucide-react";

const Dashboard = () => {
  return (
    <>
      <div className="navbar bg-base-100/10 backdrop-blur-md shadow-sm px-4 lg:px-8 fixed top-0 left-0 right-0 z-50">
        <div className="flex-1">
          <img src={timeit2} alt="TimeIt Logo" className="h-10 w-auto" />
        </div>
        <div className="flex-none">
          <SignInButton mode="modal">
            <button className="btn btn-outline btn-info btn-sm">Sign In</button>
          </SignInButton>
        </div>
      </div>

      {/* Hero Section – add top padding to prevent content overlap */}
      <section className="relative flex flex-col items-center text-white pt-25 lg:pt-40 px-4 font-poppins min-h-screen">
        {/* Background Image */}
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
          alt="Background"
        />

        {/* Status Badge */}
        <div className="flex items-center gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2 mb-6">
          <div className="size-2.5 bg-green-500 rounded-full"></div>
          <span>Set your time goal today</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-center font-calsans text-[28px] leading-tight md:text-6xl md:leading-[1.1] mt-4 font-medium max-w-2xl">
          Set your goal, and track your progress until you achieve it.
        </h1>

        {/* Call to Action */}
        <div className="pt-8">
          <SignInButton mode="modal">
            <button className="group flex items-center bg-slate-800 hover:bg-slate-950 text-white px-8 py-3 hover:scale-105 rounded-full font-medium transition shadow-lg gap-1">
              <span>Get Started</span>{" "}
              <ArrowBigRight className="size-4 group-hover:translate-x-0.5" />
            </button>
          </SignInButton>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
