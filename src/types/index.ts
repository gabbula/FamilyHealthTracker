export type UnitSystem = 'metric' | 'imperial';

export type Gender = 'male' | 'female' | 'other';

export type Ethnicity = 'caucasian' | 'african' | 'asian' | 'hispanic' | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  twoFactorEnabled: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: Gender;
  ethnicity: Ethnicity;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthRecord {
  id: string;
  profileId: string;
  date: Date;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft' | 'in';
  glucose?: number;
  glucoseUnit?: 'mg/dL' | 'mmol/L';
  bmi?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  notes?: string;
  customFields?: Record<string, any>;
}

export interface ReferenceData {
  category: string;
  age: number;
  gender: Gender;
  ethnicity: Ethnicity;
  averageWeight: number;
  averageHeight: number;
  averageBMI: number;
  healthyWeightRange: { min: number; max: number };
  healthyBMIRange: { min: number; max: number };
}
