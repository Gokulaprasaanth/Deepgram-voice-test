type TranscriptHandler = (text: string, isFinal: boolean) => void;

export class DeepgramService {
  private socket: WebSocket | null = null;

  constructor(private onTranscript: TranscriptHandler) {}

  connect() {
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;

    if (!apiKey) {
      throw new Error("Missing Deepgram API key");
    }

    const url =
      "wss://api.deepgram.com/v1/listen" +
      "?encoding=linear16" +
      "&sample_rate=16000" +
      "&punctuate=true" +
      "&interim_results=true";

    // ✅ CORRECT auth format
    this.socket = new WebSocket(url, ["token", apiKey]);

    this.socket.onopen = () => {
      console.log("✅ Deepgram WebSocket connected");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const alt = data.channel?.alternatives?.[0];

      if (!alt?.transcript) return;

      this.onTranscript(alt.transcript, data.is_final);
    };

    this.socket.onerror = (err) => {
      console.error("❌ Deepgram WebSocket error", err);
    };

    this.socket.onclose = (event) => {
      console.error(
        "❌ Deepgram WebSocket closed",
        "Code:", event.code,
        "Reason:", event.reason
      );
    };
  }

  sendAudio(buffer: ArrayBuffer) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(buffer);
    }
  }

  disconnect() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
}
