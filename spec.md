# Family Health Tracking Web App

## Overview
A mobile-responsive web application for tracking health metrics across family members with secure authentication and customizable units.

## Authentication
- Internet Identity integration for primary authentication
- Additional 2-factor authentication step with code verification
- Secure session management

## Family Profile Management
- Each user can create and manage up to 10 family member profiles
- Profile information includes:
  - Name and basic demographics (age, gender, ethnicity)
  - Health metrics: weight, height, BMI, glucose levels
  - Historical tracking of metric changes over time

## Unit System Support
- Users can select between MKS (kilograms, meters) and Imperial (pounds, feet/inches) units
- Unit preference applies globally across all family profiles
- Automatic conversion and display based on selected unit system

## Health Analytics
- Calculate and display BMI automatically based on height and weight
- Provide comparison with average health values based on:
  - Age group
  - Gender
  - Ethnicity
- Display health trends and changes over time for each family member

## Data Storage
The backend must store:
- User authentication data and 2FA settings
- Family member profiles with demographic information
- Health metric records with timestamps
- User preferences including unit system selection
- Historical health data for trend analysis

## Backend Operations
- Secure user registration and authentication with 2FA
- CRUD operations for family member profiles
- Health metric data entry and retrieval
- Calculation of health averages and comparisons
- Data export functionality for health records

## Mobile Responsiveness
- Fully responsive design optimized for mobile browsers
- Touch-friendly interface elements
- Adaptive layouts for various screen sizes
- Fast loading and smooth navigation on mobile devices

## Security & Privacy
- All health data is private to each user account but main user can view and add new
- Encrypted storage of sensitive health information
- Proper access control ensuring users can only access their own family data
- Secure data transmission between frontend and backend
