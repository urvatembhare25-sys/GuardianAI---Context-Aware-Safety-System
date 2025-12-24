
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Phone, Droplet, ClipboardList, StickyNote, Save, LogOut, CheckCircle, Shield } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-rose-500 to-rose-600 p-1 shadow-xl shadow-rose-900/20">
            <div className="w-full h-full rounded-[2.3rem] bg-slate-900 flex items-center justify-center overflow-hidden border border-white/10">
              <User size={48} className="text-rose-500" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-full border-4 border-slate-950 shadow-lg">
             <Shield size={14} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mt-4 tracking-tight">{formData.name || 'Jane Doe'}</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Verified Guardian Account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Name Field */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 focus-within:border-rose-500/50 transition-all">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <User size={12} className="text-rose-500" />
              Full Name
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-transparent border-none outline-none text-white font-medium text-sm placeholder-slate-700"
              placeholder="Enter your name"
            />
          </div>

          {/* Blood Group & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 focus-within:border-rose-500/50 transition-all">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Droplet size={12} className="text-red-500" />
                Blood Group
              </label>
              <select 
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                className="w-full bg-transparent border-none outline-none text-white font-medium text-sm appearance-none"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg} className="bg-slate-900">{bg}</option>
                ))}
              </select>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 opacity-70">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Phone size={12} className="text-blue-500" />
                Linked Phone
              </label>
              <div className="text-white font-medium text-sm font-mono">{formData.phone || 'Not Linked'}</div>
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 focus-within:border-rose-500/50 transition-all">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <ClipboardList size={12} className="text-amber-500" />
              Medical Conditions
            </label>
            <input 
              type="text" 
              value={formData.medicalConditions}
              onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
              className="w-full bg-transparent border-none outline-none text-white font-medium text-sm placeholder-slate-700"
              placeholder="Allergies, chronic issues..."
            />
          </div>

          {/* Emergency Note */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 focus-within:border-rose-500/50 transition-all">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <StickyNote size={12} className="text-emerald-500" />
              Emergency Note
            </label>
            <textarea 
              rows={2}
              value={formData.emergencyNote}
              onChange={(e) => setFormData({...formData, emergencyNote: e.target.value})}
              className="w-full bg-transparent border-none outline-none text-white font-medium text-sm placeholder-slate-700 resize-none"
              placeholder="Information for responders"
            />
          </div>
        </div>

        <button 
          type="submit"
          className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${isSaved ? 'bg-emerald-600 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'}`}
        >
          {isSaved ? (
            <>
              <CheckCircle size={20} /> PROFILE UPDATED
            </>
          ) : (
            <>
              <Save size={20} /> SAVE SAFETY PROFILE
            </>
          )}
        </button>
      </form>

      <div className="pt-4 pb-8">
        <button 
          onClick={onLogout}
          className="w-full py-4 border border-slate-800 rounded-2xl text-slate-500 hover:text-rose-400 hover:border-rose-500/20 hover:bg-rose-500/5 font-bold transition-all flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
