# Family Health Tracker

A mobile-responsive web application for tracking health metrics across multiple family members. The app supports both web and mobile platforms (iOS/Android via Capacitor) and includes features like weight, height, glucose tracking, and two-factor authentication.

## Features

### ✨ Core Functionality
- **Multi-Profile Support**: Track health data for entire family (up to 10+ members)
- **Comprehensive Health Tracking**: 
  - Weight and Height measurements
  - BMI automatic calculation
  - Glucose levels
  - Blood Pressure
  - Custom health fields (user-defined metrics)
- **Unit System Selection**: 
  - Metric (kg, cm)
  - Imperial (lbs, feet/inches)
- **Reference Data Comparison**: View average health data based on age, gender, and ethnicity
- **Historical Data**: View complete health history for each family member
- **Two-Factor Authentication (2FA)**: Enhanced security for user data

### 📱 Mobile-Responsive Design
- Fully responsive UI built with Tailwind CSS
- Works seamlessly on desktop, tablet, and mobile devices
- Ready for deployment as native iOS/Android apps using Capacitor

### 🔒 Security
- User authentication system
- 2FA support for additional security
- Secure local data storage
- Ready for Firebase integration

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Mobile**: Capacitor (for iOS/Android deployment)
- **Authentication**: Firebase (infrastructure ready)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gabbula/FamilyHealthTracker.git
cd FamilyHealthTracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Usage Guide

### 1. Authentication
- Sign up with email and password
- Enable 2FA for additional security (optional)

### 2. Adding Family Members
- Click "Add Family Member" on the dashboard
- Enter name, age, gender, and ethnicity
- Profile is created instantly

### 3. Recording Health Data
- Select a family member
- Click "Add Record"
- Enter measurements (weight, height, etc.)
- Add optional fields like glucose, blood pressure, or custom metrics
- All data is saved with timestamps

### 4. Viewing Progress
- Click on any profile to view detailed history
- View reference data to compare with population averages
- Track trends over time

### 5. Unit Preferences
- Switch between Metric and Imperial units anytime
- Preference is saved and persists across sessions

## Mobile Deployment

### iOS/Android Setup with Capacitor

1. Add Capacitor platform:
```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

2. Build the web app:
```bash
npm run build
```

3. Sync with native platforms:
```bash
npx cap sync
```

4. Open in native IDE:
```bash
npx cap open ios
# or
npx cap open android
```

## Data Storage

Currently, the app uses localStorage for data persistence. For production use, consider integrating:
- Firebase Firestore for cloud storage
- PostgreSQL/MySQL for server-based storage
- IndexedDB for larger local datasets

## Security Notes

- The current implementation uses simulated authentication
- For production, integrate with Firebase Auth or similar service
- Implement proper 2FA with authenticator apps (TOTP)
- Add encryption for sensitive health data
- Implement secure API endpoints

## Customization

### Adding New Health Metrics
1. Update types in `src/types/index.ts`
2. Add form fields in `src/components/HealthRecordModal.tsx`
3. Update display in profile views

### Styling
- Modify `tailwind.config.js` for custom theme
- Update component styles in respective `.tsx` files

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
