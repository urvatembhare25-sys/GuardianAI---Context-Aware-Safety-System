GuardianAI: Context-Aware Autonomous Women’s Safety System

GuardianAI is a proactive safety companion designed to provide protection in high-stress situations where manual intervention is impossible. Unlike traditional safety apps that require the user to unlock their phone and press a button, GuardianAI uses Sensor Fusion and Generative AI to autonomously detect danger and trigger SOS protocols.


🛡️ The Problem
In moments of crisis, a victim often lacks the time or physical ability to interact with a mobile device. Most safety apps fail because they are reactive rather than proactive.


✨ Key Features
1. Vocal Sentry (Acoustic AI): Powered by the Gemini 2.5 Flash Native Audio API, the app streams environmental audio to detect distress signatures (keywords like "HELP", "STOP", or sounds of physical struggle) in real-time.
2. Impact Logic (Fall Detection): Utilizes the device's accelerometer to monitor G-Force magnitude. If an impact exceeding 38 m/s² is detected (simulating a fall or forced movement), the system initiates an alert.
3. High-Accuracy Geolocation: Implements a multi-stage tracking strategy using navigator.geolocation with high-accuracy fallback logic to maintain a precise GPS lock for emergency dispatch.
4. Emergency Bento Dashboard: A high-performance, dark-mode UI designed for low-light visibility and quick interaction, featuring live telemetry sparklines via Recharts.
5. Privacy-First Architecture: Implements ephemeral audio processing. No voice recordings are stored on servers; only safety insights are extracted, ensuring 100% user privacy.


🚀 Tech Stack
1. Framework: React 19 (TypeScript)
2. AI Engine: Google Gemini 2.5 Flash (Multimodal Live API)
3. Styling: Tailwind CSS
4. Icons: Lucide React
5. Visualization: Recharts (Live Accelerometer Data)
6. State Management: React Hooks (useCallback, useRef, useEffect)


🛠️ How It Works
1. Activation: The user enables the "Shield" which boots the Sensor Engine and the Gemini Live Session.
2. Monitoring: The app listens for acoustic distress and feels for physical impacts simultaneously.
3. Detection: If a danger signature is found, a 5-second Fail-Safe countdown is triggered.
4. Dispatch: If not cancelled, the system vibrates the device and readies the location/medical profile for immediate transmission to the "Trust Network."
