import { useRef, useState } from "react";
import { useMicrophone } from "../audio/useMicrophone";
import { DeepgramService } from "../services/deepgram";
import "../styles/animations.css";

export function Recorder() {
  const [recording, setRecording] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [error, setError] = useState("");

  const deepgramRef = useRef<DeepgramService | null>(null);
  const startingRef = useRef(false); // 🔒 prevents double start

  const mic = useMicrophone((chunk) => {
    deepgramRef.current?.sendAudio(chunk);
  });

  const startRecording = async () => {
    if (recording || startingRef.current) return;

    startingRef.current = true;
    setError("");

    try {
      deepgramRef.current = new DeepgramService((text, isFinal) => {
        if (isFinal) {
          setFinalText((prev) => (prev ? prev + " " + text : text));
          setLiveText("");
        } else {
          setLiveText(text);
        }
      });

      // ✅ CONNECT FIRST
      await deepgramRef.current.connect();

      // ✅ THEN START MIC
      await mic.start();

      setRecording(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to start recording"
      );
      deepgramRef.current?.disconnect();
      deepgramRef.current = null;
    } finally {
      startingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (!recording) return;

    mic.stop();
    deepgramRef.current?.disconnect();
    deepgramRef.current = null;

    setRecording(false);
    setLiveText("");
  };

  const clearTranscript = () => {
    setFinalText("");
    setLiveText("");
  };

  return (
    <div className="recorder-container">
      {/* Error Banner */}
      {error && (
        <div className="error-banner" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="error-close"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Recording Button */}
      <div className="button-container">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !recording) {
              e.preventDefault();
              startRecording();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              stopRecording();
            }
          }}
          className={`record-button ${recording ? "recording" : ""}`}
          aria-label={
            recording
              ? "Recording - Release to stop"
              : "Hold to start recording"
          }
          aria-pressed={recording}
        >
          <div className="record-button-inner">
            <div className="mic-icon">🎙️</div>
          </div>
        </button>

        {/* Status Text */}
        <div className="status-text">
          {recording ? (
            <span className="status-listening">
              <span className="pulse-dot"></span>
              Listening...
            </span>
          ) : (
            <span className="status-idle">Hold to Talk</span>
          )}
        </div>

        {/* Waveform */}
        {recording && (
          <div className="waveform" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transcription */}
      <div className="transcript-container">
        {liveText && (
          <div className="live-card">
            <div className="card-header">
              <span className="card-label">Live Transcription</span>
              <span className="live-badge">●</span>
            </div>
            <p className="live-text">{liveText}</p>
          </div>
        )}

        <div className="final-card">
          <div className="card-header">
            <span className="card-label">Transcript</span>
            {finalText && (
              <button
                onClick={clearTranscript}
                className="clear-button"
              >
                Clear
              </button>
            )}
          </div>

          {finalText ? (
            <p className="final-text">{finalText}</p>
          ) : (
            <p className="empty-text">
              Your transcription will appear here
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
