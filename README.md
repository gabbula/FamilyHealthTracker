# 🏥 Family Health Tracker

A mobile-responsive web application for tracking BMI (Body Mass Index) data for your entire family.

## Features

- **Multi-Profile Support**: Create and manage profiles for family members (up to 10+ members)
- **BMI Tracking**: Record and track BMI data over time with weight and height measurements
- **BMI Calculator**: Automatic BMI calculation based on height and weight
- **Data Visualization**: View BMI history and trends for each family member
- **Comparison Tool**: Compare your BMI with average data based on age, gender, and ethnicity
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: All data is stored locally in your browser for privacy
- **Health Resources**: Quick access to helpful health information and resources

## How to Use

1. **Open the App**: Simply open `index.html` in any modern web browser
2. **Add Family Members**: Click "Add Family Member" to create profiles
3. **Enter BMI Data**: Select a profile and add weight/height measurements
4. **View History**: See all BMI records for each family member
5. **Compare Data**: Click "View Comparison Data" to see how you compare to average data

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript (ES6+)
- LocalStorage API for data persistence

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/gabbula/FamilyHealthTracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd FamilyHealthTracker
   ```
3. Open `index.html` in your web browser

### No Build Required
This is a pure HTML/CSS/JavaScript application with no dependencies or build steps required.

## Features Overview

### Profile Management
- Create profiles with name, age, gender, and ethnicity
- Edit existing profiles
- Delete profiles (with confirmation)
- View all family members at a glance

### BMI Data Entry
- Enter weight (kg) and height (cm)
- Select the date of measurement
- Automatic BMI calculation
- Visual categorization (Underweight, Normal, Overweight, Obese)

### BMI History
- View all historical BMI entries
- See weight, height, and date for each entry
- Delete individual entries
- Entries sorted by date (newest first)

### Comparison Feature
- Compare your BMI with demographic averages
- Adjusted ranges based on ethnicity (e.g., lower thresholds for Asian populations)
- Health advice based on BMI category
- Links to authoritative health resources

## Data Privacy

All data is stored locally in your browser using LocalStorage. No data is sent to any server. Your family's health information stays completely private on your device.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Health Disclaimer

This app is for informational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for medical concerns.

## Resources

- [WHO: Obesity and Overweight](https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight)
- [CDC: About BMI](https://www.cdc.gov/healthyweight/assessing/bmi/index.html)
- [NHLBI: BMI Calculator](https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm)
- [American Heart Association: BMI in Adults](https://www.heart.org/en/healthy-living/healthy-eating/losing-weight/bmi-in-adults)