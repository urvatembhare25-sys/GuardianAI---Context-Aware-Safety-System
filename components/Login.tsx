
import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Lock, ArrowRight, CheckCircle2, ChevronLeft, Heart, Zap, Globe } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (phone: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(phone);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] opacity-20 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-red-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[30%] w-96 h-96 bg-rose-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0f172a_70%)]"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="w-full relative z-10 space-y-8">
        <div className="text-center animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative p-5 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl">
              <Shield className="w-14 h-14 text-rose-500" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-rose-600 rounded-full border-4 border-slate-950 shadow-lg">
              <Zap size={14} className="text-white fill-current" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Guardian<span className="text-rose-500">AI</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            EMPOWERING SAFETY THROUGH INTELLIGENCE
          </p>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-700 delay-200">
          {step === 'phone' ? (
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50"></div>
              
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Secure Access
              </h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Your journey to safer travels begins here. Enter your number to link your safety profile.
              </p>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-rose-500 text-slate-500">
                    <Smartphone size={20} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-4.5 pl-12 pr-4 text-white placeholder-slate-600 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all outline-none text-lg tracking-wider"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 animate-in slide-in-from-left-2">
                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                    <p className="text-red-400 text-xs font-bold uppercase">{error}</p>
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-rose-900/30 transition-all active:scale-[0.98] disabled:opacity-50 group/btn overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 skew-x-12"></div>
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      GET VERIFIED <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50"></div>
              <button 
                onClick={() => setStep('phone')}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group"
              >
                <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">
                  <ChevronLeft size={14} />
                </div>
                Edit Phone
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-2">Final Step</h2>
              <p className="text-slate-400 text-sm mb-8">
                Confirm your identity with the code sent to <span className="text-rose-400 font-bold">+{phone}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-between gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && i > 0) {
                          document.getElementById(`otp-${i-1}`)?.focus();
                        }
                      }}
                      className="w-full aspect-[4/5] bg-slate-950/60 border border-slate-800 rounded-xl text-center text-2xl font-black text-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                    />
                  ))}
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                    <p className="text-red-400 text-xs font-bold uppercase">{error}</p>
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-rose-900/30 transition-all active:scale-[0.98] disabled:opacity-50 group/btn overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 skew-x-12"></div>
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      VERIFY & ACTIVATE <CheckCircle2 size={20} />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-2">Didn't receive the code?</p>
                  <button 
                    type="button" 
                    className="text-xs font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest underline underline-offset-4"
                    onClick={() => {/* Resend logic */}}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
           <div className="flex flex-col items-center gap-2 text-center group">
              <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-rose-500/30 transition-colors">
                 <Heart size={18} className="text-rose-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Loved by Users</span>
           </div>
           <div className="flex flex-col items-center gap-2 text-center group">
              <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-rose-500/30 transition-colors">
                 <Globe size={18} className="text-blue-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Global Relay</span>
           </div>
           <div className="flex flex-col items-center gap-2 text-center group">
              <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-rose-500/30 transition-colors">
                 <Lock size={18} className="text-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Encrypted</span>
           </div>
        </div>

        <div className="text-center">
          <p className="text-slate-600 text-[11px] font-medium leading-relaxed max-w-[280px] mx-auto px-4">
            Protecting your privacy is our mission. Your data remains yours.
            <br />
            <span className="text-slate-500 block mt-2">© 2025 GuardianAI Safety Labs</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
