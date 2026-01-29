# Quick Start Guide

## Family Health Tracker

A comprehensive health tracking application for families.

## Installation

```bash
git clone https://github.com/gabbula/FamilyHealthTracker.git
cd FamilyHealthTracker
npm install
```

## Running the App

### Development Mode
```bash
npm run dev
```
Visit http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

## Usage

### 1. Sign Up / Login
- Create an account with email and password
- Optionally enable 2FA for extra security

### 2. Add Family Members
- Click "Add Family Member"
- Enter name, age, gender, and ethnicity
- Profile is created instantly

### 3. Record Health Data
- Select a family member
- Click "Add Record"
- Enter health metrics:
  - Weight (kg or lbs)
  - Height (cm or ft/in)
  - Glucose (optional)
  - Blood Pressure (optional)
  - Custom fields (optional)
- BMI is calculated automatically

### 4. View Progress
- Click on any profile to see detailed history
- Toggle "Show Reference Data" to compare with population averages
- View all historical records in a table

### 5. Switch Units
- Use the dropdown in the header to switch between:
  - Metric (kg, cm)
  - Imperial (lbs, ft/in)
- Preference is saved automatically

## Mobile Deployment

### iOS
```bash
npm install @capacitor/ios
npx cap add ios
npm run build
npx cap sync
npx cap open ios
```

### Android
```bash
npm install @capacitor/android
npx cap add android
npm run build
npx cap sync
npx cap open android
```

## Features

✅ Multi-profile support (family of 10+)
✅ Weight & Height tracking
✅ BMI auto-calculation
✅ Glucose monitoring
✅ Blood pressure tracking
✅ Custom health fields
✅ Metric/Imperial unit switching
✅ Reference data comparison
✅ Historical data viewing
✅ 2FA security
✅ Mobile-responsive design
✅ iOS/Android ready

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- React Router DOM
- Vite
- Capacitor

## Data Storage

Currently uses localStorage. For production:
- Migrate to Firebase Firestore
- Or use PostgreSQL/MySQL backend
- Add user authentication via Firebase Auth

## Support

For issues or questions, please open an issue on GitHub.
