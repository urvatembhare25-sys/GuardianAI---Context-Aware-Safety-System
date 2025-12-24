
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafetyStatus, Contact, LocationState, AlertLog, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import SOSButton from './components/SOSButton';
import Settings from './components/Settings';
import AlertOverlay from './components/AlertOverlay';
import Login from './components/Login';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import { Shield, Settings as SettingsIcon, LayoutDashboard, History, User } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings' | 'profile'>('dashboard');
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>(SafetyStatus.SECURE);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('guardian_contacts');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Emergency Services', phone: '911', isEmergency: true },
      { id: '2', name: 'Family Member', phone: '+1234567890', isEmergency: false }
    ];
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('guardian_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Jane Doe',
      phone: '',
      bloodGroup: 'O+',
      medicalConditions: 'None',
      emergencyNote: 'Please contact my family immediately.'
    };
  });
  const [location, setLocation] = useState<LocationState>({ lat: null, lng: null, accuracy: null, timestamp: null });
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>(() => {
    const saved = localStorage.getItem('guardian_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('guardian_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('guardian_logs', JSON.stringify(alertLogs));
  }, [alertLogs]);

  useEffect(() => {
    localStorage.setItem('guardian_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    const handleSuccess = (pos: GeolocationPosition) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      });
      setIsLocating(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn(`Location Error (${err.code}): ${err.message}`);
      
      if (err.code === err.PERMISSION_DENIED) {
        setGpsError("Location access denied. Please enable it in browser settings.");
        setIsLocating(false);
      } else if (err.code === err.TIMEOUT) {
        // Fallback: Try with lower accuracy if high accuracy times out
        navigator.geolocation.getCurrentPosition(handleSuccess, 
          (e) => {
            setGpsError("Unable to retrieve location. Check GPS signal.");
            setIsLocating(false);
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        setGpsError("Location unavailable.");
        setIsLocating(false);
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !navigator.geolocation) return;

    // Start background tracking
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        });
        setGpsError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Location access denied.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoggedIn]);

  const triggerSOS = useCallback((type: AlertLog['type']) => {
    if (safetyStatus === SafetyStatus.SOS_TRIGGERED) return;

    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    setSafetyStatus(SafetyStatus.SOS_TRIGGERED);
    const newLog: AlertLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      timestamp: Date.now(),
      location: { ...location },
      status: 'SENT',
      details: type === 'VOICE' ? 'Acoustic pattern matched distress signature' : `Alert manually initiated via ${type.toLowerCase()}`
    };
    setAlertLogs(prev => [newLog, ...prev]);
  }, [location, safetyStatus]);

  const resetStatus = () => {
    setSafetyStatus(SafetyStatus.SECURE);
  };

  const toggleMonitoring = () => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);
    setSafetyStatus(newState ? SafetyStatus.MONITORING : SafetyStatus.SECURE);
    
    if (newState) updateLocation();

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMonitoring(false);
    setSafetyStatus(SafetyStatus.SECURE);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={(phone) => {
      setUserProfile(prev => ({ ...prev, phone }));
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 max-w-md mx-auto shadow-2xl border-x border-slate-800 relative">
      <header className="p-4 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg transition-all duration-500 ${isMonitoring ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-slate-800'}`}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight">GuardianAI</h1>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isMonitoring ? 'text-rose-400' : 'text-slate-500'}`}>
              {isMonitoring ? 'Shield Active' : 'Standby Mode'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center transition-all ${activeTab === 'profile' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900 hover:bg-slate-800'}`}
        >
          <User size={18} className={activeTab === 'profile' ? 'text-rose-400' : 'text-slate-400'} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <Dashboard 
              status={safetyStatus} 
              isMonitoring={isMonitoring}
              onToggleMonitor={toggleMonitoring}
              triggerSOS={triggerSOS}
              location={location}
              onRefreshLocation={updateLocation}
              isLocating={isLocating}
              gpsError={gpsError}
            />
          </div>
        )}
        {activeTab === 'history' && (
          <HistoryView 
            logs={alertLogs} 
            onClear={() => setAlertLogs([])} 
          />
        )}
        {activeTab === 'settings' && (
          <Settings contacts={contacts} setContacts={setContacts} onLogout={handleLogout} />
        )}
        {activeTab === 'profile' && (
          <ProfileView profile={userProfile} onUpdate={setUserProfile} onLogout={handleLogout} />
        )}
      </main>

      {safetyStatus === SafetyStatus.SOS_TRIGGERED && (
        <AlertOverlay onDismiss={resetStatus} />
      )}

      <div className="fixed bottom-24 right-6 z-40">
        <SOSButton onTrigger={() => triggerSOS('MANUAL')} />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800 p-2 flex justify-around items-center h-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.5)] z-50">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Guard' },
          { id: 'history', icon: History, label: 'Logs' },
          { id: 'settings', icon: SettingsIcon, label: 'Setup' },
          { id: 'profile', icon: User, label: 'Me' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 py-2 rounded-xl ${activeTab === tab.id ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} className={activeTab === tab.id ? 'animate-in zoom-in-110 duration-300' : ''} />
            <span className={`text-[9px] uppercase font-black tracking-widest ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
