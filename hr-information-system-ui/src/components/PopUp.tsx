import React from "react";

interface PopUpProps {
  displayText: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({
  displayText,
  onConfirm,
  onCancel,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>

        {/* Popup content */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-700">{displayText}</h2>

          {/* Buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
