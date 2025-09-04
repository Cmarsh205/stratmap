import { createPortal } from "react-dom";
import operators from "r6operators";
import { X } from "lucide-react";

interface OperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperator: (imageUrl: string) => void;
}

const OperatorModal: React.FC<OperatorModalProps> = ({
  isOpen,
  onClose,
  onSelectOperator,
}) => {
  if (!isOpen) return null;

  const operatorsArray = Object.values(operators);
  const attackers = operatorsArray.filter((op) => op.role === "Attacker");
  const defenders = operatorsArray.filter((op) => op.role === "Defender");

  const getIconPath = (id: string) => `/operators/${id.toLowerCase()}.png`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 !bg-slate-900/80 !backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative !bg-slate-800/95 !backdrop-blur-sm !border !border-slate-700/50 !rounded-2xl !shadow-2xl !shadow-slate-900/50 !w-full !max-w-md transform transition-all duration-300 scale-100 opacity-100 max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 !bg-slate-700/50 hover:!bg-slate-600/50 !text-slate-400 hover:!text-white !rounded-lg flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="!p-6">
          <h2 className="!text-2xl !font-bold !text-white !text-center !mb-6">
            Select Operator
          </h2>

          {/* Attackers */}
          <section className="text-center mb-6">
            <h3 className="!font-bold !text-lg !mb-3 !border-b-2 !border-red-600 !pb-1 !text-yellow-400">
              Attackers
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {attackers.map((op) => (
                <button
                  key={op.id}
                  onClick={() => {
                    onSelectOperator(getIconPath(op.id));
                    onClose();
                  }}
                >
                  <img
                    src={getIconPath(op.id)}
                    alt={op.name}
                    title={op.name}
                    className="w-12 h-12 !rounded-lg !shadow transition-transform !mx-auto !p-0.5 bg-[#888888]"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Defenders */}
          <section className="text-center">
            <h3 className="!font-bold !text-lg !mb-3 !border-b-2 !border-blue-600 !pb-1 !text-yellow-400">
              Defenders
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {defenders.map((op) => (
                <button
                  key={op.id}
                  onClick={() => {
                    onSelectOperator(getIconPath(op.id));
                    onClose();
                  }}
                >
                  <img
                    src={getIconPath(op.id)}
                    alt={op.name}
                    title={op.name}
                    className="w-12 h-12 !rounded-lg !shadow transition-transform !mx-auto !p-0.5 bg-[#888888]"
                  />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OperatorModal;
