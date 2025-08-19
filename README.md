# Cybersecurity Flashcards

An interactive flashcard application for studying cybersecurity concepts. This React-based app helps users test their knowledge across different cybersecurity domains with confidence tracking and progress monitoring.

## Features

- **Interactive Flashcards**: Click to flip cards and reveal answers
- **Domain Filtering**: Study specific cybersecurity domains or all domains at once
- **Confidence Tracking**: Rate your knowledge level for each card:
  - ⚡ Knew it right away
  - 🤔 Had to think for a moment
  - 🧠 Had to think for a while
  - 👀 Peeked at the answer
- **Progress Monitoring**: Track your progress through the quiz
- **Color-Coded Domains**: Each cybersecurity domain has its own color scheme
- **Completion Summary**: Get a detailed breakdown of your performance
- **User Authentication**: Sign in with email/password, Google, or continue as guest
- **Progress Synchronization**: Your progress is automatically synced across devices
- **Offline Support**: Continue studying even without an internet connection
- **User Profiles**: Manage your account and preferences

## Cybersecurity Domains

- **Blue - General Security Concepts**: CIA triad, AAA framework, Zero Trust, security controls
- **Red - Threats, Vulnerabilities & Mitigations**: Phishing, malware, ransomware, threat actors
- **Green - Security Architecture**: VPN, network segmentation, TLS, cloud services
- **Yellow - Security Operations**: SIEM, system hardening, incident response
- **White - Program Management & Oversight**: AUP, risk management, RTO

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Firebase (optional but recommended for full features):
   - Follow the [Firebase Setup Guide](FIREBASE_SETUP.md) to configure authentication and database
   - Create a `.env.local` file with your Firebase configuration

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local development URL

5. Click "Sign In" in the top right to create an account or sign in

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Vite (build tool)
- Firebase (authentication & database)
- Framer Motion (animations)

## Usage

1. Select the domains you want to study using the domain filter buttons
2. Click on a flashcard to flip it and reveal the answer
3. Rate your confidence level using the buttons that appear after flipping
4. Navigate through cards using the Previous/Next buttons
5. Use the Reset Quiz button to start over
6. View your progress and confidence tracking in real-time

The app provides a comprehensive learning experience for cybersecurity professionals and students preparing for certifications or interviews.
