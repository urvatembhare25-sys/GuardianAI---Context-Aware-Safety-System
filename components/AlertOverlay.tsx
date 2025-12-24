
import React, { useState, useEffect } from 'react';
import { AlertOctagon, X, PhoneCall, ShieldAlert } from 'lucide-react';

interface AlertOverlayProps {
  onDismiss: () => void;
}

const AlertOverlay: React.FC<AlertOverlayProps> = ({ onDismiss }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]"></div>
        <div className="flex flex-wrap h-full w-full">
           {Array.from({length: 40}).map((_, i) => (
             <AlertOctagon key={i} size={80} className="text-white m-4 animate-pulse" />
           ))}
        </div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-xs">
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 emergency-pulse">
            <ShieldAlert size={64} className="text-white" />
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">SOS TRIGGERED</h2>
          <p className="text-red-100 font-medium">Alerts are being dispatched to your trusted contacts and local authorities.</p>
        </div>

        <div className="bg-white text-red-600 rounded-3xl p-6 shadow-2xl space-y-4">
           <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-red-400">Time to Global Dispatch</div>
              <div className="text-5xl font-black">{countdown}s</div>
           </div>
           
           <div className="flex flex-col gap-3">
             <button 
               className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
               onClick={() => window.open('tel:911')}
             >
               <PhoneCall size={20} />
               Call Emergency Now
             </button>
             <button 
               onClick={onDismiss}
               className="w-full bg-slate-100 text-slate-800 font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
             >
               <X size={18} />
               I am Safe (Cancel)
             </button>
           </div>
        </div>

        <div className="text-[10px] text-red-200 uppercase font-bold tracking-widest opacity-60">
           Tracking ID: G-SOS-{Math.floor(Math.random() * 900000) + 100000}
        </div>
      </div>
    </div>
  );
};

export default AlertOverlay;
