import Navbar from "../component/Navbar";
import {
  Pen,
  Download,
  FileText,
  Sparkles,
  PlusIcon,
  Trash2,
} from "lucide-react";
import CreateModal from "../component/CreateModal";
import EditModal from "../component/EditModal";
import DeleteModal from "../component/DeleteModal";
import { useGetTime } from "../hooks/useTime";
import { getLatestQuote } from "@/Lib/Helper/timeHelper";
import HistoryModal from "@/component/HistoryModal";
import { useDownloadToPdf } from "@/hooks/useDownloadTopPdf";
import { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const { data: timeData, isLoading } = useGetTime();
  const { exportToPDF } = useDownloadToPdf();
  const [isExporting, setIsExporting] = useState(false);

  const today = new Date();

  // Updated export handler to pass timeData
  const handleExport = async () => {
    setIsExporting(true);
    const result = await exportToPDF(timeData);
    setIsExporting(false);

    if (result.success) {
      toast.success("PDF exported successfully!");
    } else {
      toast.error("Failed to export PDF: " + result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center min-h-screen pt-20 px-4 sm:px-6 md:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-linear-to-br ">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-linear-to-r from-fuchsia-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-linear-to-r from-sky-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          <div className="absolute inset-0 bg-[linear-linear(90deg,#00000005_1px,transparent_1px),linear-linear(180deg,#00000005_1px,transparent_1px)] bg-size-[20px_20px] sm:bg-size-[30px_30px] md:bg-size-[40px_40px]"></div>
        </div>

        <div className="py-8 sm:py-10 md:py-14">
          <h5 className="font-extralight text-gray-500 text-sm sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] px-2 text-center">
            As of {today.toDateString()}:
          </h5>
        </div>

        <div className="relative flex items-end justify-center w-full max-w-6xl mx-auto">
          <div className="relative flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-2 sm:gap-0">
            <div className="relative text-center sm:text-right">
              <span className="font-[350] text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-[-0.02em] text-white ">
                {timeData?.data?.currentTime
                  ? timeData?.data?.currentTime
                  : "00"}
              </span>
            </div>

            <div className="relative my-2 sm:my-0 mx-2 sm:mx-4 md:mx-6">
              <span className="font-thin text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] leading-none text-transparent bg-linear-to-b from-fuchsia-400 to-pink-400 bg-clip-text">
                /
              </span>
            </div>

            <div className="relative text-center sm:text-left">
              <div className="inline-block relative">
                <span className="font-[350] text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-[-0.02em] text-white">
                  {timeData?.data?.goalTime ? timeData?.data?.goalTime : "00"}
                </span>

                {!timeData?.data ? (
                  <button
                    onClick={() =>
                      document.getElementById("createModal").showModal()
                    }
                    className="absolute -top-3 sm:-top-4 -right-6 sm:-right-8 md:-right-10 lg:-right-12 group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-blue-600 rounded-full border-2 border-blue-400/50 group-hover:border-blue-300 transition-colors duration-300"></div>

                      <div className="absolute inset-0 bg-linear-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-sm sm:blur-md opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>

                      <div className="hidden sm:block absolute -top-1 -right-1">
                        <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <PlusIcon className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white transition-colors duration-300 stroke-[1.5] group-hover:rotate-90 group-hover:scale-110" />
                    </div>
                  </button>
                ) : (
                  <div className="absolute -top-5 -right-12 md:-right-16 flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() =>
                        document.getElementById("change").showModal()
                      }
                      className="group disabled:cursor-not-allowed"
                    >
                      <div className="relative">
                        <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-disabled:bg-gray-400 group-disabled:hover:scale-100">
                          {/* Glow effect - hidden when disabled */}
                          <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm sm:blur-md opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:scale-125 group-disabled:hidden"></div>

                          <div className="hidden sm:block absolute -top-1 -right-1">
                            <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin group-disabled:hidden" />
                          </div>

                          <Pen className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 text-white transition-all duration-300 group-hover:rotate-12 stroke-[1.5] group-disabled:text-gray-200 group-disabled:hover:rotate-0" />
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        document.getElementById("deleteModal").showModal()
                      }
                      className="group"
                    >
                      <div className="relative">
                        <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                          <div className="absolute inset-0 bg-red-400 rounded-full blur-sm sm:blur-md opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:scale-125"></div>

                          <div className="hidden sm:block absolute -top-1 -right-1">
                            <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin" />
                          </div>

                          <Trash2 className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 text-white transition-all duration-300 group-hover:scale-110 stroke-[1.5]" />
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 sm:mt-0 sm:ml-10 md:ml-6 mb-6 sm:mb-7 md:mb-8">
              <span className="font-extralight text-gray-100 text-lg sm:text-xl md:text-2xl tracking-widest uppercase">
                hrs
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 w-32 sm:w-40 md:w-48 h-[0.5px] bg-linear-to-r from-transparent via-gray-300/30 to-transparent"></div>

        <div className="py-2">
          <h5 className="font-extralight text-gray-500 text-sm sm:text-base md:text-lg px-2 text-center">
            Quote of the day:
          </h5>
        </div>
        <div className="max-w-xs sm:max-w-sm md:max-w-md px-4 text-center">
          <p className="font-light text-gray-100 text-sm sm:text-base md:text-lg leading-relaxed tracking-wide">
            {!timeData?.data?.history
              ? '"Start where you are. Use what you have. Do what you can."'
              : getLatestQuote(timeData)}
          </p>
        </div>
        <div className="mt-16 sm:mt-18 md:mt-20 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-md sm:max-w-lg px-4 py-4">
          <button
            onClick={handleExport}
            disabled={isExporting || !timeData}
            className="group relative w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-linear-to-r from-fuchsia-500/10 to-pink-500/10 rounded-full blur-lg sm:blur-xl group-hover:blur-xl sm:group-hover:blur-2xl transition-all duration-500"></div>

            <div className="relative w-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/50 group-hover:border-fuchsia-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl sm:group-hover:shadow-2xl group-hover:shadow-fuchsia-500/20">
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 font-light text-gray-700 group-hover:text-fuchsia-600 text-base sm:text-lg tracking-wide">
                <Download
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isExporting ? "animate-bounce" : "group-hover:animate-bounce"}`}
                />
                <span className="truncate">
                  {isExporting ? "Exporting..." : "Pdf"}
                </span>
              </span>
            </div>
          </button>

          <button
            disabled={!timeData}
            onClick={() => document.getElementById("ViewHistory").showModal()}
            className="group relative w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-linear-to-r from-gray-400/5 to-gray-600/5 rounded-full blur-lg sm:blur-xl"></div>
            <div className="relative w-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full bg-transparent border border-gray-200/30 group-hover:border-gray-300 transition-all duration-300 group-hover:scale-105">
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 font-light text-gray-500 group-hover:text-gray-700 text-base sm:text-lg tracking-wide">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                <span className="truncate">Logs</span>
              </span>
            </div>
          </button>
        </div>
      </div>
      <EditModal />
      <CreateModal />
      <DeleteModal />
      <HistoryModal />
    </>
  );
};

export default Home;
