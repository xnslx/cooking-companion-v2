'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Square } from 'lucide-react';
import { VoiceChatInput } from './VoiceChatInput';

const C = {
  lavenderDark: '#9b87f5',
  lavenderLight: '#ede9fd',
  charcoal: '#1c1c1e',
  warmWhite: '#faf8f4',
  muted: '#8a8680',
  border: '#e4dfd8',
};

interface InputProps {
  inProgress: boolean;
  onSend: (text: string) => Promise<unknown>;
  isVisible?: boolean;
  onStop?: () => void;
  hideStopButton?: boolean;
  chatReady?: boolean;
}

export function CustomChatInput({
  inProgress,
  onSend,
  onStop,
  hideStopButton,
}: InputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || inProgress) return;
    setText('');
    await onSend(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTranscript = (transcript: string) => {
    const trimmed = transcript.trim();
    if (!trimmed) return;
    onSend(trimmed);
  };

  const canSend = text.trim().length > 0 && !inProgress;

  return (
    <div
      style={{
        padding: '10px 12px',
        borderTop: `1px solid ${C.border}`,
        background: C.warmWhite,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          background: '#fff',
          border: `1.5px solid ${C.border}`,
          borderRadius: 14,
          padding: '8px 10px',
        }}
      >
        {/* Mic button */}
        <div style={{ paddingBottom: 2 }}>
          <VoiceChatInput onTranscript={handleTranscript} />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inProgress ? 'Assistant is thinking...' : 'Ask anything about the recipe…'}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 13.5,
            lineHeight: 1.5,
            color: C.charcoal,
            fontFamily: "'DM Sans', sans-serif",
            overflowY: 'auto',
            maxHeight: 160,
          }}
        />

        {/* Send / Stop button */}
        {inProgress && !hideStopButton && onStop ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onStop}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: 'none',
              background: '#f70000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              paddingBottom: 2,
            }}
            title="Stop"
          >
            <Square size={11} fill="#fff" color="#fff" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={!canSend}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: 'none',
              background: canSend ? C.lavenderDark : C.border,
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s',
              paddingBottom: 2,
            }}
            title="Send"
          >
            <ArrowUp size={14} color="#fff" />
          </motion.button>
        )}
      </div>

      <p style={{ fontSize: 10.5, color: C.muted, textAlign: 'center', marginTop: 6 }}>
        Press Enter to send · Shift+Enter for new line · click mic to speak
      </p>
    </div>
  );
}
