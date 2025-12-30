import { useDeleteTime } from "../hooks/useTime";

const DeleteModal = () => {
  const { mutate, isPending } = useDeleteTime();

  const handleClose = () => {
    document.getElementById("deleteModal")?.close();
  };

  const handleDelete = () => {
    mutate();
    document.getElementById("deleteModal")?.close();
  };

  return (
    <dialog id="deleteModal" className="modal">
      <div className="w-full max-w-67.5 mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-5 text-center">
            <h2 className="text-[17px] font-semibold text-gray-900 mb-2">
              Delete
            </h2>

            {/* Message */}
            <p className="text-[13px] text-gray-600 leading-relaxed">
              Are you sure with that?
            </p>
          </div>

          <div className="h-px bg-gray-300/50" />

          <div className="flex">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 text-[17px] font-normal text-blue-500 hover:bg-gray-100/50 active:bg-gray-200/50 transition-colors border-r border-gray-300/50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 py-3 text-[17px] font-semibold text-red-500 hover:bg-gray-100/50 active:bg-gray-200/50 transition-colors disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteModal;
