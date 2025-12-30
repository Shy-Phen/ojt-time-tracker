import { X, Minus, Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useUpdateTime } from "../hooks/useTime";

const EditModal = () => {
  const { mutate } = useUpdateTime();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      adjustment: 0,
    },
  });

  const adjustment = useWatch({
    control,
    name: "adjustment",
    defaultValue: 0,
  });

  const isNegative = adjustment < 0;
  const absValue = Math.abs(adjustment);
  const displayValue =
    adjustment === 0 ? "+0" : adjustment > 0 ? `+${absValue}` : `-${absValue}`;

  const closeModal = () => {
    document.getElementById("change")?.close();
    reset();
  };

  const onSubmit = (data) => {
    mutate({ adjustment: data.adjustment });
    closeModal();
  };

  const appendDigit = (digit) => {
    const current = absValue;
    const newAbs =
      current === 0 && digit === 0
        ? 0
        : current === 0
          ? digit
          : parseInt(`${current}${digit}`);
    setValue("adjustment", isNegative ? -newAbs : newAbs, {
      shouldDirty: true,
    });
  };

  const toggleSign = () => {
    setValue("adjustment", adjustment === 0 ? -1 : -adjustment, {
      shouldDirty: true,
    });
  };

  const clear = () => {
    setValue("adjustment", 0, { shouldDirty: true });
  };

  const backspace = () => {
    const newAbs = absValue === 0 ? 0 : Math.floor(absValue / 10);
    setValue("adjustment", isNegative ? -newAbs : newAbs, {
      shouldDirty: true,
    });
  };

  return (
    <dialog className="modal" id="change">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <div className="bg-linear-to-b from-gray-50 to-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-linear-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
            <h1 className="text-sm font-medium text-gray-700">Update Time</h1>
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Adjustment (Hours)
              </label>
              <div
                className={`w-full h-20 border-2 rounded-lg text-4xl font-bold flex items-center justify-center ${
                  isNegative
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-green-50 border-green-300 text-green-600"
                }`}
              >
                {displayValue}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSign}
              className={`w-full h-12 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                isNegative
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isNegative ? (
                <Minus className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {isNegative ? "Decrease Mode" : "Increase Mode"}
            </button>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => appendDigit(num)}
                  className="h-14 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-xl font-semibold text-gray-800 shadow-sm transition-colors"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={clear}
                className="h-14 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 active:bg-red-200 text-sm font-semibold text-red-600 shadow-sm transition-colors"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => appendDigit(0)}
                className="h-14 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-xl font-semibold text-gray-800 shadow-sm transition-colors"
              >
                0
              </button>

              <button
                type="button"
                onClick={backspace}
                className="h-14 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 active:bg-orange-200 flex items-center justify-center text-orange-600 shadow-sm transition-colors"
              >
                ←
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adjustment === 0 || isSubmitting}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Backdrop click to close */}
      <div className="modal-backdrop" onClick={closeModal} />
    </dialog>
  );
};

export default EditModal;
