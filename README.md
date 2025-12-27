# 🎙️ VoiceScribe – Tauri + React Voice-to-Text App

VoiceScribe is a cross-platform desktop voice-to-text application built using **Tauri**, **React (Vite)**, and the **Deepgram WebSocket API**.  
It captures microphone audio in real time and converts speech into text instantly with low latency.

---

## 🚀 Features

- 🎤 Real-time microphone recording
- 🧠 Live speech-to-text transcription
- ✍️ Final transcript generation
- 🖥️ Cross-platform desktop app (Windows / macOS / Linux)
- ⚡ Lightweight & fast (Tauri + Vite)
- 🔐 Secure API key handling using environment variables

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Desktop Framework:** Tauri (Rust backend)
- **Speech-to-Text API:** Deepgram WebSocket API
- **Audio Processing:** Web Audio API
- **Styling:** CSS animations

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

> ⚠️ Do not commit your `.env` file. It should be listed in `.gitignore`.

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd my-tauri-app
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run in Development Mode

```bash
npm run tauri dev
```

This starts:
- Vite frontend at `http://localhost:1420`
- Tauri desktop application window

---

## 🧪 How It Works

1. User clicks the microphone button
2. Microphone permission is requested
3. Audio is captured using the Web Audio API
4. PCM audio chunks are streamed to Deepgram via WebSocket
5. Deepgram returns live and final transcripts
6. UI updates in real time

---

## 🧩 Common Issues & Fixes

### ❌ Port `1420` already in use

```bash
npx kill-port 1420
```

Or restart your system.

### ❌ Microphone not working

- Ensure microphone permission is granted
- Check system microphone access
- Use Chrome or Tauri WebView

---

## 🏗️ Build Desktop App

```bash
npm run tauri build
```

The installer will be generated in:

```text
src-tauri/target/release/bundle/
```

---




## 📌 Future Improvements

- 🌍 Multi-language transcription
- 📂 Save transcripts to file
- 🎧 Audio waveform visualization
- ☁️ Cloud sync support



