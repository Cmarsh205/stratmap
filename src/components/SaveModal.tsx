import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Save, Edit3 } from "lucide-react";

interface NameInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  maxLength?: number;
}

const NameInputModal: React.FC<NameInputModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  placeholder = "Enter name...",
  initialValue = "",
  confirmText = "Save",
  cancelText = "Cancel",
  maxLength = 50,
}) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialValue);
      setError("");
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    onConfirm(trimmedName);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (error && value.trim()) setError("");
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative !bg-slate-800/95 !border !border-slate-700/50 !rounded-2xl !shadow-2xl !shadow-slate-900/50 !w-full !max-w-md transform transition-all duration-300 scale-100 opacity-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute !top-4 !right-4 w-8 h-8 !bg-slate-700/50 hover:!bg-slate-600/50 !text-slate-400 hover:!text-white !rounded-lg flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <form onSubmit={handleSubmit} className="!p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center !mx-auto !mb-6">
            <Edit3 className="w-8 h-8 text-yellow-400" />
          </div>

          {/* Title */}
          <h2 className="!text-2xl !font-bold !text-white !text-center !mb-6">
            {title}
          </h2>

          {/* Input */}
          <div className="!mb-6">
            <input
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder={placeholder}
              maxLength={maxLength}
              autoFocus
              className={`w-full !bg-slate-700/50 !border !rounded-xl !py-3 !px-4 !text-white !placeholder-slate-400 focus:!outline-none focus:!ring-2 transition-all duration-200 ${
                error
                  ? "!border-red-500/50 focus:!ring-red-500/50 focus:!border-red-500/50"
                  : "!border-slate-600/50 focus:!ring-yellow-500/75 focus:!border-yellow-500/75"
              }`}
            />
            <div className="flex justify-between items-center !mt-2">
              <div className="h-4">
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>
              <p className="text-slate-400 text-sm">
                {name.length}/{maxLength}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex !gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 !bg-slate-700/50 hover:!bg-slate-600/50 !text-slate-300 hover:!text-white border !border-slate-600/50 hover:!border-slate-500/50 !font-semibold !py-3 !px-6 !rounded-xl transition-all duration-200"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-slate-600 disabled:to-slate-600 disabled:!text-slate-500 !text-slate-900 !font-semibold !py-3 !px-6 !rounded-xl transition-all duration-200 flex items-center justify-center !gap-2 !shadow-lg hover:shadow-yellow-500/25 disabled:!shadow-none"
            >
              <Save className="w-4 h-4" />
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default NameInputModal;
