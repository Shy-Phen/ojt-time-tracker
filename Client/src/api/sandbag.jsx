import React, { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateTime } from "../hooks/useTime";

const EditModal = () => {
  const [adjustmentValue, setAdjustmentValue] = useState(0);
  const [isNegative, setIsNegative] = useState(false);

  const { mutate } = useUpdateTime();

  const { reset } = useForm();

  const handleCancel = () => {
    reset();
    setIsNegative(false);
    document.getElementById("change").close();
  };

  const handleNumberClick = (num) => {
    setAdjustmentValue((prev) => parseInt(prev.toString() + num.toString()));
  };

  const handleClear = () => {
    setAdjustmentValue(0);
  };

  const handleBackspace = () => {
    setAdjustmentValue((prev) => {
      const str = prev.toString();
      return str.length > 1 ? parseInt(str.slice(0, -1)) : 0;
    });
  };

  const toggleSign = () => {
    setIsNegative((prev) => !prev);
  };

  const onSubmit = () => {
    const finalValue = isNegative ? -adjustmentValue : adjustmentValue;
    console.log("Sending to API:", finalValue); // This is what you send to your API
    // Call your API mutation here with finalValue
    // mutate({ adjustment: finalValue })
    mutate({ adjustment: finalValue });

    handleCancel();
  };

  const displayValue = isNegative
    ? `-${adjustmentValue}`
    : `+${adjustmentValue}`;

  return (
    <dialog className="modal" id="change">
      <div className="w-full max-w-sm bg-linear-to-b from-gray-50 to-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
        {/* macOS-style header */}
        <div className="bg-linear-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <h1 className="text-sm font-medium text-gray-700">Update Time</h1>
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
          <div className="space-y-5">
            {/* Display Input */}
            <div className="w-full">
              <label className="block mb-2">
                <span className="text-gray-700 font-medium text-sm">
                  Adjustment (Hours)
                </span>
              </label>
              <div
                className={`w-full border-2 text-center text-4xl font-bold rounded-lg h-20 px-4 flex items-center justify-center ${
                  isNegative
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-green-50 border-green-300 text-green-600"
                }`}
              >
                {displayValue}
              </div>
            </div>

            {/* Plus/Minus Toggle Button */}
            <button
              onClick={toggleSign}
              className={`w-full h-12 rounded-lg font-semibold text-white transition-all ${
                isNegative
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isNegative ? (
                <span className="flex items-center justify-center gap-2">
                  <Minus className="w-5 h-5" /> Decrease Mode
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Increase Mode
                </span>
              )}
            </button>

            {/* Number Keyboard */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-lg h-14 text-xl font-semibold text-gray-800 transition-colors shadow-sm"
                >
                  {num}
                </button>
              ))}

              {/* Clear Button */}
              <button
                onClick={handleClear}
                className="bg-red-50 border border-red-200 hover:bg-red-100 active:bg-red-200 rounded-lg h-14 text-sm font-semibold text-red-600 transition-colors shadow-sm"
              >
                Clear
              </button>

              {/* Zero Button */}
              <button
                onClick={() => handleNumberClick(0)}
                className="bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-lg h-14 text-xl font-semibold text-gray-800 transition-colors shadow-sm"
              >
                0
              </button>

              {/* Backspace Button */}
              <button
                onClick={handleBackspace}
                className="bg-orange-50 border border-orange-200 hover:bg-orange-100 active:bg-orange-200 rounded-lg h-14 flex items-center justify-center text-orange-600 transition-colors shadow-sm"
              >
                ←
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={handleCancel}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={adjustmentValue === 0}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop" onClick={handleCancel}>
        <button type="button">close</button>
      </div>
    </dialog>
  );
};

export default EditModal;
