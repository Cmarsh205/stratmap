import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText,
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "text-red-400 bg-red-500/20";
      case "warning":
        return "text-yellow-400 bg-yellow-500/20";
      case "info":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/20";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg hover:shadow-red-500/25";
      case "warning":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 shadow-lg hover:shadow-yellow-500/25";
      case "info":
        return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/25";
      default:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 shadow-lg hover:shadow-yellow-500/25";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative !bg-slate-800/95 !backdrop-blur-sm !border !border-slate-700/50 !rounded-2xl !shadow-2xl !shadow-slate-900/50 !w-full !max-w-md transform transition-all duration-300 scale-100 opacity-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 !bg-slate-700/50 hover:!bg-slate-600/50 !text-slate-400 hover:!text-white !rounded-lg flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="!p-8">
          {/* Icon */}
          <div
            className={`w-16 h-16 ${getIconColor()} !rounded-2xl flex items-center justify-center !mx-auto !mb-6`}
          >
            <AlertTriangle className="w-8 h-8" />
          </div>

          {/* Title */}
          <h2 className="!text-2xl !font-bold !text-white !text-center !mb-4">
            {title}
          </h2>

          {/* Message */}
          <p className="!text-slate-300 !text-center !mb-8 !leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex !gap-4 justify-center">
            {cancelText && (
              <button
                onClick={onClose}
                className="flex-1 !bg-slate-700/50 hover:!bg-slate-600/50 !text-slate-300 hover:!text-white !border !border-slate-600/50 hover:!border-slate-500/50 !font-semibold !py-3 !px-6 !rounded-xl transition-all duration-200"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`${
                cancelText ? "flex-1" : "w-48"
              } !font-semibold !py-3 !px-6 !rounded-xl transition-all duration-200 ${getConfirmButtonStyle()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
