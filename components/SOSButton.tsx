
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SOSButtonProps {
  onTrigger: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onTrigger }) => {
  return (
    <button 
      onClick={onTrigger}
      className="w-16 h-16 rounded-full bg-red-600 shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center justify-center transition-transform active:scale-90 emergency-pulse border-4 border-white/20"
    >
      <AlertCircle size={32} className="text-white" />
    </button>
  );
};

export default SOSButton;
