
import React, { useState } from 'react';
import { AlertLog } from '../types';
// Added History to imports
import { Trash2, AlertTriangle, MapPin, Calendar, ChevronDown, ChevronUp, Info, History } from 'lucide-react';

interface HistoryViewProps {
  logs: AlertLog[];
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, onClear }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Safety Logs</h2>
          <p className="text-slate-500 text-xs font-medium">Recent security incidents and alerts</p>
        </div>
        {logs.length > 0 && (
          <button 
            onClick={onClear}
            className="p-2 text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-slate-900/50 rounded-lg border border-slate-800"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 border border-slate-800/50">
            <History size={32} />
          </div>
          <div>
            <h3 className="text-slate-300 font-bold">No Records Found</h3>
            <p className="text-slate-500 text-xs max-w-[200px] mt-1">Your safety history is clear. All monitored sessions were secure.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const isExpanded = expandedId === log.id;
            return (
              <div 
                key={log.id} 
                className={`bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden ${isExpanded ? 'border-rose-500/30 ring-1 ring-rose-500/10' : 'border-slate-800 hover:border-slate-700'}`}
              >
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className="w-full p-4 flex justify-between items-center text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.status === 'SENT' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-500'}`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-tight flex items-center gap-1.5">
                        {log.type} ALERT
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${log.status === 'SENT' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-slate-800/50 w-full mb-3"></div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                        <MapPin size={14} className="text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Event Location</div>
                          <div className="text-xs font-mono text-slate-300">
                            {log.location.lat?.toFixed(6)}, {log.location.lng?.toFixed(6)}
                          </div>
                        </div>
                      </div>
                      
                      {log.details && (
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                          <Info size={14} className="text-amber-400 mt-0.5" />
                          <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Dispatch Details</div>
                            <div className="text-xs text-slate-400 leading-relaxed italic">
                              "{log.details}"
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors">
                      View full incident report
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
