import React from "react";
import { useGetTime, useDownloadToExcel } from "@/hooks/useTime";
import { toast } from "sonner";

const HistoryModal = () => {
  const { data } = useGetTime();
  const { mutate: downloadExcel, isPending: isDownloading } =
    useDownloadToExcel();

  const history = data?.data?.history || [];

  const closeModal = () => {
    document.getElementById("ViewHistory").close();
  };

  const handleExportClick = () => {
    if (history.length === 0) {
      toast.info("No data to export");
      return;
    }
    downloadExcel();
  };

  return (
    <div>
      <dialog id="ViewHistory" className="modal">
        <div className="modal-box max-w-4xl bg-black">
          <h3 className="font-bold text-lg mb-4">Update History</h3>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <p>No history entries found</p>
              <p className="text-sm text-gray-500">
                Start adding time to see your history here
              </p>
            </div>
          ) : (
            <div className="rounded-lg p-4 max-h-[60vh] overflow-y-auto overflow-x-auto font-mono text-sm">
              <div className="mb-2 text-gray-400 text-xs">
                Showing {history.length} entries
              </div>
              {history.map((item, index) => {
                const date = new Date(item.updatedAt);
                const dateStr = date.toLocaleDateString();
                const timeStr = date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item._id || index}
                    className="flex gap-3 mb-1 text-xs hover:bg-gray-900 px-2 py-1 rounded min-w-max"
                  >
                    <span className="text-gray-500 shrink-0">{dateStr}</span>
                    <span className="text-gray-400 shrink-0">{timeStr}</span>
                    <span className="text-green-400 shrink-0 font-semibold">
                      {item.addedTime}hrs
                    </span>
                    <span className="text-gray-300 whitespace-nowrap">
                      {item.quote}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="modal-action flex flex-row gap-2">
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={handleExportClick}
              disabled={isDownloading || history.length === 0}
            >
              {isDownloading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Export to Excel
                </>
              )}
            </button>
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
        {/* Modal backdrop for closing when clicking outside */}
        <div className="modal-backdrop" onClick={closeModal}></div>
      </dialog>
    </div>
  );
};

export default HistoryModal;
