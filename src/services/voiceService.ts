export class VoiceService {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public static startListening(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    language: string = 'en-US'
  ): { stop: () => void } | null {
    if (!this.isSupported()) {
      onError('Voice recognition is not supported in this browser.');
      return null;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission denied.');
        } else if (event.error === 'no-speech') {
          onError('No speech detected. Please speak into microphone.');
        } else {
          onError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {}
        },
      };
    } catch (e: any) {
      onError(e?.message || 'Failed to initialize speech recognition.');
      return null;
    }
  }
}
