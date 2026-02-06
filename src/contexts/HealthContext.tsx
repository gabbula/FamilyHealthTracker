import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Profile, HealthRecord, UnitSystem } from '../types';

interface HealthContextType {
  profiles: Profile[];
  healthRecords: HealthRecord[];
  unitSystem: UnitSystem;
  addProfile: (profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
  getRecordsByProfile: (profileId: string) => HealthRecord[];
  setUnitSystem: (system: UnitSystem) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

interface HealthProviderProps {
  children: ReactNode;
}

export const HealthProvider = ({ children }: HealthProviderProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>('metric');

  useEffect(() => {
    // Load from localStorage
    const storedProfiles = localStorage.getItem('profiles');
    const storedRecords = localStorage.getItem('healthRecords');
    const storedUnitSystem = localStorage.getItem('unitSystem');

    if (storedProfiles) {
      setProfiles(JSON.parse(storedProfiles));
    }
    if (storedRecords) {
      setHealthRecords(JSON.parse(storedRecords));
    }
    if (storedUnitSystem) {
      setUnitSystemState(storedUnitSystem as UnitSystem);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords));
  }, [healthRecords]);

  const addProfile = (profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfile: Profile = {
      ...profile,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProfiles([...profiles, newProfile]);
  };

  const updateProfile = (id: string, updates: Partial<Profile>) => {
    setProfiles(profiles.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    setHealthRecords(healthRecords.filter(r => r.profileId !== id));
  };

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
    };
    setHealthRecords([...healthRecords, newRecord]);
  };

  const updateHealthRecord = (id: string, updates: Partial<HealthRecord>) => {
    setHealthRecords(healthRecords.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ));
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords(healthRecords.filter(r => r.id !== id));
  };

  const getRecordsByProfile = (profileId: string) => {
    return healthRecords.filter(r => r.profileId === profileId);
  };

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system);
    localStorage.setItem('unitSystem', system);
  };

  const value = {
    profiles,
    healthRecords,
    unitSystem,
    addProfile,
    updateProfile,
    deleteProfile,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getRecordsByProfile,
    setUnitSystem,
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};
