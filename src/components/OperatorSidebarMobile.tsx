import { useState } from "react";
import { Grid } from "lucide-react";
import OperatorModal from "./OperatorModal";

interface OperatorSidebarMobileProps {
  onSelectOperator: (imageUrl: string) => void;
}

const OperatorSidebarMobile: React.FC<OperatorSidebarMobileProps> = ({
  onSelectOperator,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        className="!bg-slate-900/90 !text-xs !border !border-slate-700/50 hover:!border-slate-600/50 !text-slate-300 hover:!text-white !py-2.5 !px-3 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2 !cursor-pointer focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/75 focus:!border-yellow-500/75"
        onClick={() => setIsOpen(true)}
      >
        <Grid size={18} />
        Select Operator
      </button>

      <OperatorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectOperator={onSelectOperator}
      />
    </div>
  );
};

export default OperatorSidebarMobile;
