import { Recorder } from "./components/Recorder";

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Voice Transcription</h1>
        <p className="app-subtitle">Hold the button to start speaking</p>
      </header>

      <main className="app-main">
        <Recorder />
      </main>
    </div>
  );
}