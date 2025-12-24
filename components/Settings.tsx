
import React, { useState } from 'react';
import { Contact } from '../types';
import { Plus, User, Phone, Trash2, Heart, ShieldCheck, LogOut, ChevronRight, BellRing } from 'lucide-react';

interface SettingsProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  onLogout?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ contacts, setContacts, onLogout }) => {
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const addContact = () => {
    if (!newName || !newPhone) return;
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      phone: newPhone,
      isEmergency: false
    };
    setContacts(prev => [...prev, newContact]);
    setNewName("");
    setNewPhone("");
    setShowAdd(false);
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-1">
        <h2 className="text-2xl font-black text-white tracking-tight">Setup Guardian</h2>
        <p className="text-slate-500 text-xs font-medium">Configure your safety network</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-sm text-rose-500 flex items-center gap-2 uppercase tracking-widest">
            <Heart size={16} fill="currentColor" />
            Trust Network
          </h3>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className={`p-2 rounded-xl transition-all ${showAdd ? 'bg-rose-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
          >
            <Plus size={20} />
          </button>
        </div>
        
        {showAdd && (
          <div className="bg-slate-900 border border-rose-500/30 p-5 rounded-3xl space-y-4 shadow-xl shadow-rose-900/10 animate-in zoom-in-95 duration-300">
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-rose-500 outline-none transition-colors" 
              />
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-rose-500 outline-none transition-colors" 
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-bold text-xs"
              >
                CANCEL
              </button>
              <button 
                onClick={addContact}
                className="flex-2 bg-rose-600 hover:bg-rose-500 text-white font-black py-4 px-8 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20"
              >
                ADD CONTACT
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {contacts.map(contact => (
            <div key={contact.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group hover:bg-slate-900 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${contact.isEmergency ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800 text-slate-400'}`}>
                  <Phone size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{contact.name}</div>
                  <div className="text-[10px] font-mono text-slate-500 tracking-tighter">{contact.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => removeContact(contact.id)}
                  className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight size={16} className="text-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-black text-sm text-indigo-400 flex items-center gap-2 uppercase tracking-widest px-1">
          <BellRing size={16} fill="currentColor" />
          Alert Settings
        </h3>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2">
          {[
            { label: 'Automatic SMS Relay', enabled: true },
            { label: 'Local Police Integration', enabled: true },
            { label: 'Low Battery Alert', enabled: false }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border-b last:border-0 border-slate-800/50">
               <span className="text-sm font-medium text-slate-300">{item.label}</span>
               <div className={`w-10 h-5 rounded-full relative transition-colors ${item.enabled ? 'bg-rose-600' : 'bg-slate-800'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.enabled ? 'left-6' : 'left-1'}`}></div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="text-emerald-500" size={24} />
        </div>
        <div>
          <div className="text-sm font-black text-emerald-500 tracking-tight uppercase">Privacy Lock Active</div>
          <p className="text-[10px] text-emerald-500/60 leading-relaxed font-medium mt-1">
            GuardianAI does not store voice recording files. All processing is transient and ephemeral. Location history is deleted every 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
