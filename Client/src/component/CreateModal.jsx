import { useForm } from "react-hook-form";
import { useCreateTime } from "../hooks/useTime.js"; // Import your hook
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

const CreateModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const queryClient = useQueryClient();

  
  const { mutate, isPending } = useCreateTime();

  const onSubmit = (data) => {
    // Call the mutation with the form data
    mutate(data, {
      onSuccess: () => {
        reset(); // Clear the form
        document.getElementById("createModal").close();
        queryClient.invalidateQueries();
      },
    });
  };

  const handleCancel = () => {
    reset();
    document.getElementById("createModal").close();
  };

  return (
    <dialog id="createModal" className="modal">
      <div className="modal-box max-w-md bg-linear-to-b from-gray-50 to-white border border-gray-200 shadow-2xl rounded-2xl p-0 overflow-hidden">
        {/* macOS-style header with traffic lights */}
        <div className="bg-linear-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <h1 className="text-black">Set Time Goal</h1>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-gray-700 font-medium text-sm">
                  Time goal (Hours)
                </span>
              </label>
              <input
                type="number"
                {...register("goalTime", { required: true, min: 1 })}
                placeholder="Enter your time goal"
                className={`input w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all ${
                  errors.goalTime
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : ""
                }`}
                disabled={isPending} // Disable while submitting
              />
              {errors.goalTime && ( // Fixed: was errors.Time
                <label className="label">
                  <span className="label-text-alt text-red-500 text-xs">
                    This field is required and must be at least 1
                  </span>
                </label>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending} // Disable button while submitting
              >
                {isPending ? "Setting time goal..." : "Set Goal"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CreateModal;
