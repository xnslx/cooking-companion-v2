'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square } from 'lucide-react';

type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

const MAX_DURATION_MS = 60_000;

const C = {
  lavenderDark: '#9b87f5',
  lavenderLight: '#ede9fd',
  muted: '#8a8680',
  border: '#e4dfd8',
};

function AudioBars({ analyser }: { analyser: AnalyserNode | null }) {
  const [levels, setLevels] = useState([0.2, 0.2, 0.2, 0.2, 0.2]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser) {
      setLevels([0.2, 0.2, 0.2, 0.2, 0.2]);
      return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    function tick() {
      analyser!.getByteFrequencyData(data);
      const step = Math.floor(data.length / 5);
      const newLevels = Array.from({ length: 5 }, (_, i) => {
        const slice = data.slice(i * step, (i + 1) * step);
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        return Math.max(0.15, avg / 255);
      });
      setLevels(newLevels);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 16 }}>
      {levels.map((level, i) => (
        <motion.div
          key={i}
          animate={{ height: `${level * 100}%` }}
          transition={{ duration: 0.1 }}
          style={{
            width: 3,
            background: '#f70000',
            borderRadius: 2,
            minHeight: 3,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceChatInput({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [state, setState] = useState<RecordingState>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRecording = useCallback(async (cancelled = false) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

    return new Promise<void>((resolve) => {
      const recorder = mediaRecorderRef.current!;
      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        audioCtxRef.current?.close();
        analyserRef.current = null;

        if (cancelled) {
          setState('idle');
          resolve();
          return;
        }

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        chunksRef.current = [];

        if (blob.size < 1000) {
          setState('idle');
          resolve();
          return;
        }

        setState('processing');
        try {
          const form = new FormData();
          form.append('audio', blob, 'recording.webm');
          const res = await fetch('/api/transcribe', { method: 'POST', body: form });
          const data = await res.json();
          if (data.text) {
            onTranscript(data.text);
            setState('idle');
          } else {
            setState('error');
            setTimeout(() => setState('idle'), 2000);
          }
        } catch {
          setState('error');
          setTimeout(() => setState('idle'), 2000);
        }
        resolve();
      };
      recorder.stop();
    });
  }, [onTranscript]);

  const startRecording = useCallback(async () => {
    setState('idle');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(100);
      setState('recording');

      timeoutRef.current = setTimeout(() => stopRecording(), MAX_DURATION_MS);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  const handleClick = () => {
    if (state === 'idle' || state === 'error') startRecording();
    else if (state === 'recording') stopRecording();
  };

  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';
  const isError = state === 'error';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 4 }}>
              <motion.div
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#f70000', flexShrink: 0 }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <AudioBars analyser={analyserRef.current} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        disabled={isProcessing}
        animate={
          isError
            ? { x: [0, -6, 6, -4, 4, 0] }
            : isRecording
            ? { scale: [1, 1.12, 1] }
            : { scale: 1, x: 0 }
        }
        transition={
          isError
            ? { duration: 0.35 }
            : isRecording
            ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `1.5px solid ${isRecording ? '#f70000' : isError ? '#f70000' : C.border}`,
          background: isRecording ? '#fff0f0' : isError ? '#fff0f0' : C.lavenderLight,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 0,
        }}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
      >
        {isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 14,
              height: 14,
              border: `2px solid ${C.lavenderDark}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
            }}
          />
        ) : isRecording ? (
          <Square size={12} fill="#f70000" color="#f70000" />
        ) : (
          <Mic size={14} color={isError ? '#f70000' : C.lavenderDark} />
        )}
      </motion.button>
    </div>
  );
}
