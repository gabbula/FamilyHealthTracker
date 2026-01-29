// Weight conversions
export const kgToLbs = (kg: number): number => kg * 2.20462;
export const lbsToKg = (lbs: number): number => lbs / 2.20462;

// Height conversions
export const cmToFeet = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const feetToCm = (feet: number, inches: number = 0): number => {
  return (feet * 12 + inches) * 2.54;
};

export const cmToInches = (cm: number): number => cm / 2.54;
export const inchesToCm = (inches: number): number => inches * 2.54;

// BMI calculation
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// Glucose conversions
export const mgDlToMmolL = (mgDl: number): number => mgDl / 18.0182;
export const mmolLToMgDl = (mmolL: number): number => mmolL * 18.0182;

// BMI category
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Format display values
export const formatWeight = (weight: number, unit: 'kg' | 'lbs'): string => {
  return `${weight.toFixed(1)} ${unit}`;
};

export const formatHeight = (height: number, unit: 'cm' | 'ft' | 'in'): string => {
  if (unit === 'ft') {
    const { feet, inches } = cmToFeet(height);
    return `${feet}' ${inches}"`;
  }
  return `${height.toFixed(1)} ${unit}`;
};

export const formatGlucose = (glucose: number, unit: 'mg/dL' | 'mmol/L'): string => {
  return `${glucose.toFixed(1)} ${unit}`;
};
