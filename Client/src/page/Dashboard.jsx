import timeit2 from "../assets/timeit2.svg";
import { ArrowBigRight, Clock1, Download, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { offer } from "@/Lib/offer";
import OfferCard from "@/component/OfferCard";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="navbar bg-base-100/10 backdrop-blur-md shadow-sm px-4 lg:px-8 fixed top-0 left-0 right-0 z-50">
        <div className="flex-1">
          <img src={timeit2} alt="TimeIt Logo" className="h-5 w-auto" />
        </div>
        <div className="flex-none">
          <button
            onClick={() => navigate("/auth/sign-in")}
            className="group flex items-center bg-slate-800 hover:bg-slate-950 text-white px-3 py-2 hover:scale-105 rounded-full font-medium transition shadow-lg gap-1"
          >
            <span>Sign in</span>
            <ArrowBigRight className="size-4 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Main content that grows */}
      <main className="grow pt-16">
        {" "}
        {/* Added pt-16 to account for fixed navbar */}
        {/* Hero Section - Reduced height */}
        <section className="relative flex flex-col items-center justify-center text-white px-4 font-poppins min-h-[90vh] overflow-hidden">
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
          <div className="py-8 ">
            <button
              onClick={() => navigate("/auth/sign-up")}
              className="group flex items-center bg-slate-800 hover:bg-slate-950 text-white px-8 py-3 hover:scale-105 rounded-full font-medium transition shadow-lg gap-1"
            >
              <span>Get Started</span>{" "}
              <ArrowBigRight className="size-4 group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>
        {/* Features Section - Removed h-screen */}
        <div className="w-full py-12 md:py-20">
          <div className="flex flex-col justify-center items-center py-8 md:py-12">
            <div className="flex flex-col justify-center items-center py-6 md:py-10">
              <h1 className="text-3xl md:text-7xl font-stretch-50% text-center">
                What is <span className="text-blue-400">Time</span>
                <span className="text-red-400">It</span> ?
              </h1>
              <p className="text-center text-fuchsia-50 py-6 md:py-8 text-lg md:text-2xl px-4">
                We are a simple, user-friendly application designed to help you
                easily track and manage your on-the-job training (OJT) hours.
              </p>
            </div>
            <div className="w-full max-w-6xl px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {offer.map((item, index) => (
                  <OfferCard
                    key={index}
                    icon={item.icon}
                    title={item.heading}
                    description={item.text}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Will now stick to bottom */}
      <footer className="border-white/20 border-t w-full py-6 text-white mt-auto bg-black/20">
        <div className="flex flex-col justify-center items-center">
          <p className="text-center">
            © <span className="text-blue-400">Time</span>
            <span className="text-red-400">It</span> • All right reserved
          </p>
          <p className="inline-flex items-center justify-center gap-2 mt-4 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 backdrop-blur-sm transition-all">
            Developed by ShyPhen
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
