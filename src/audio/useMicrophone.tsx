import { useRef } from "react";

type AudioChunkHandler = (chunk: ArrayBuffer) => void;

export function useMicrophone(onAudioChunk: AudioChunkHandler) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = async () => {
    try {
      // 1️⃣ Ask mic permission
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // 2️⃣ FORCE 16kHz AudioContext
      audioContextRef.current = new AudioContext({
        sampleRate: 16000,
      });

      // IMPORTANT: resume context (Tauri requires this)
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const source =
        audioContextRef.current.createMediaStreamSource(streamRef.current);

      const processor =
        audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);

        const pcm16 = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff;
        }

        onAudioChunk(pcm16.buffer);
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      processorRef.current = processor;

      console.log("🎙️ Microphone streaming started");
    } catch (err) {
      console.error(err);
      throw new Error("Microphone permission denied or unavailable");
    }
  };

  const stop = () => {
    processorRef.current?.disconnect();
    processorRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    console.log("🛑 Microphone stopped");
  };

  return { start, stop };
}
