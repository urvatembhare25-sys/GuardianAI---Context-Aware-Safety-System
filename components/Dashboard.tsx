
import React, { useEffect, useState, useRef } from 'react';
import { SafetyStatus, LocationState } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Shield, Mic, MapPin, Activity, Radio, Waves, Navigation, Lock, RefreshCw, AlertTriangle, Crosshair, Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface DashboardProps {
  status: SafetyStatus;
  isMonitoring: boolean;
  onToggleMonitor: () => void;
  triggerSOS: (type: 'FALL' | 'VOICE' | 'MANUAL' | 'SHAKE') => void;
  location: LocationState;
  onRefreshLocation: () => void;
  isLocating: boolean;
  gpsError: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  isMonitoring, 
  onToggleMonitor, 
  triggerSOS, 
  location, 
  onRefreshLocation, 
  isLocating, 
  gpsError 
}) => {
  const [acceleration, setAcceleration] = useState<{ time: number; value: number }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [audioTranscription, setAudioTranscription] = useState("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fall Detection Logic (Accelerometer)
  useEffect(() => {
    if (!isMonitoring) {
      setAcceleration([]);
      return;
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const magnitude = Math.sqrt(
        (acc.x || 0) ** 2 + 
        (acc.y || 0) ** 2 + 
        (acc.z || 0) ** 2
      );

      setAcceleration(prev => [...prev.slice(-40), { time: Date.now(), value: magnitude }]);

      if (magnitude > 38) { 
        triggerSOS('FALL');
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isMonitoring, triggerSOS]);

  const encodePCM = (data: Float32Array): string => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      int16[i] = s < 0 ? s * 32768 : s * 32767;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startVoiceSentry = async () => {
    if (!process.env.API_KEY) return;
    
    try {
      setIsListening(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: `You are a dedicated Safety Guardian. 
          Your ONLY job is to listen for signs of physical distress or danger.
          SIGNALS TO WATCH FOR: 
          - Keywords: "Help", "SOS", "Police", "Stop it", "Don't touch me", "Please no".
          - Acoustic markers: Screaming, thuds, sounds of struggling, heavy hyperventilation.
          
          BEHAVIOR:
          - Remain silent unless danger is detected.
          - If you detect high-probability danger, output exactly: "[DANGER_DETECTED]"
          - Use the environment sounds to inform your decision.`
        },
        callbacks: {
          onopen: () => console.log("Guardian AI Session Open"),
          onmessage: async (message: LiveServerMessage) => {
            const transcription = message.serverContent?.inputTranscription?.text;
            if (transcription) {
              setAudioTranscription(transcription);
              const lower = transcription.toLowerCase();
              if (lower.includes("help") || lower.includes("stop") || lower.includes("sos") || lower.includes("police")) {
                triggerSOS('VOICE');
              }
            }
            
            const modelText = message.serverContent?.modelTurn?.parts?.[0]?.text;
            if (modelText?.includes("[DANGER_DETECTED]")) {
              triggerSOS('VOICE');
            }
          },
          onclose: () => setIsListening(false),
          onerror: (e) => {
            console.error("Sentry Error:", e);
            setIsListening(false);
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;
      const session = await sessionPromise;
      sessionRef.current = session;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const base64Data = encodePCM(inputData);
        
        sessionPromiseRef.current?.then((activeSession) => {
          activeSession.sendRealtimeInput({
            media: {
              data: base64Data,
              mimeType: 'audio/pcm;rate=16000'
            }
          });
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
    } catch (err) {
      console.error("Guardian Boot Failed:", err);
      setIsListening(false);
    }
  };

  const stopVoiceSentry = () => {
    sessionRef.current?.close();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsListening(false);
    setAudioTranscription("");
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto animate-in fade-in duration-700">
      
      {/* Primary Status Card */}
      <div className={`relative p-8 rounded-[2.5rem] transition-all duration-700 overflow-hidden text-center flex flex-col items-center justify-center space-y-6 ${
        isMonitoring 
        ? 'bg-rose-500/10 border-2 border-rose-500/20 shadow-2xl shadow-rose-900/20' 
        : 'bg-slate-900 border border-slate-800 shadow-xl'
      }`}>
        {isMonitoring && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-rose-500/5 pointer-events-none" />
        )}
        
        <div className="space-y-1">
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isMonitoring ? 'text-rose-500' : 'text-slate-500'}`}>
            Guardian Engine
          </p>
          <h2 className="text-4xl font-black text-white tracking-tighter">
            {isMonitoring ? 'Monitoring' : 'Standby'}
          </h2>
        </div>

        <button 
          onClick={onToggleMonitor}
          className={`group relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 ${
            isMonitoring 
            ? 'bg-rose-600 text-white shadow-[0_15px_40px_-10px_rgba(225,29,72,0.5)]' 
            : 'bg-emerald-600 text-white shadow-[0_15px_40px_-10px_rgba(5,150,105,0.4)]'
          }`}
        >
          <div className={`absolute inset-0 rounded-full border-4 border-white/20 transition-transform duration-500 group-hover:scale-110 ${isMonitoring ? 'animate-ping opacity-20' : ''}`} />
          <Shield size={42} className="relative z-10 transition-transform duration-500 group-hover:scale-110" fill="currentColor" />
        </button>

        <p className="text-xs text-slate-400 font-medium max-w-[200px] leading-relaxed">
          {isMonitoring 
            ? 'All sensors active. Gemini AI is guarding your path.' 
            : 'Activate the shield to start autonomous protection.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Voice Sentry Bento */}
        <div className={`col-span-2 p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden ${
          isListening ? 'bg-slate-900 border-rose-500/30' : 'bg-slate-900/50 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl transition-all ${isListening ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {isListening ? <Waves className="animate-pulse" size={20} /> : <Mic size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Vocal Sentry</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{isListening ? 'Acoustic AI Active' : 'Offline'}</p>
              </div>
            </div>
            <button 
              disabled={!isMonitoring}
              onClick={isListening ? stopVoiceSentry : startVoiceSentry}
              className={`px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest transition-all ${
                !isMonitoring ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' :
                isListening ? 'bg-rose-500 text-white' : 'bg-slate-800 text-rose-500 border border-rose-500/20'
              }`}
            >
              {isListening ? 'STOP' : 'BOOT'}
            </button>
          </div>
          <div className={`h-12 flex items-center justify-center text-center px-4 transition-opacity ${isListening ? 'opacity-100' : 'opacity-30'}`}>
            <p className="text-xs font-medium italic text-slate-300 truncate w-full">
              {audioTranscription ? `"${audioTranscription}"` : 'Listening for distress sounds...'}
            </p>
          </div>
        </div>

        {/* Sensor Sparkline Bento */}
        <div className="p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800 flex flex-col justify-between h-44">
          <div className="flex items-center gap-2 text-slate-500">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">G-Force</span>
          </div>
          <div className="h-20 w-full -mx-2">
            {isMonitoring ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={acceleration}>
                  <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={2} fill="#f43f5e" fillOpacity={0.1} isAnimationActive={false} />
                  <YAxis domain={[0, 45]} hide />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <Radio size={16} className="text-slate-500" />
              </div>
            )}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Impact Sensor</div>
        </div>

        {/* Improved Location Bento */}
        <div className="p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800 flex flex-col justify-between h-44 relative group overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
            </div>
            {location.lat && !isLocating && (
              <button 
                onClick={onRefreshLocation}
                className="p-1 text-slate-400 hover:text-white transition-all"
                title="Refresh GPS"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
          
          <div className="py-2 z-10">
            {isLocating ? (
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2 size={18} className="animate-spin text-rose-500" />
                <span className="text-xs font-black uppercase tracking-tighter animate-pulse">Locating...</span>
              </div>
            ) : location.lat ? (
              <div className="space-y-1 animate-in fade-in duration-300">
                <div className="text-lg font-black text-white tracking-tighter leading-none">
                  {location.lat.toFixed(4)}° N
                </div>
                <div className="text-lg font-black text-white tracking-tighter leading-none">
                  {location.lng?.toFixed(4)}° E
                </div>
              </div>
            ) : (
              <button 
                onClick={onRefreshLocation}
                className="flex items-center gap-2 text-rose-500 hover:text-rose-400 transition-all py-2 group/btn"
              >
                <Crosshair size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                <span className="text-sm font-black uppercase tracking-tight">Enable GPS</span>
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  gpsError ? 'bg-red-500' :
                  isLocating ? 'bg-amber-500 animate-pulse' :
                  location.lat ? (location.accuracy && location.accuracy < 50 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400') : 
                  'bg-slate-700'
                }`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  {gpsError ? 'GPS Error' : isLocating ? 'Pinging Satellites' : location.lat ? 'GPS Fixed' : 'Standby'}
                </span>
              </div>
              {location.accuracy && location.lat && (
                <span className="text-[9px] font-mono text-slate-600">±{location.accuracy.toFixed(0)}m</span>
              )}
            </div>
            
            {gpsError && (
              <p className="text-[8px] text-red-500 font-bold uppercase leading-tight animate-in slide-in-from-bottom-1">
                {gpsError}
              </p>
            )}
          </div>

          {/* Background Decorative Element */}
          <div className={`absolute -bottom-4 -right-4 transition-opacity duration-1000 ${location.lat ? 'opacity-10' : 'opacity-0'}`}>
            <Navigation size={64} className="text-rose-500 rotate-45" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-4 opacity-40">
        <Lock size={12} className="text-slate-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AES-256 Cloud Channel</span>
      </div>

    </div>
  );
};

export default Dashboard;
