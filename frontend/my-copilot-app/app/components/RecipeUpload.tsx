'use client';

import { useState, useRef } from 'react';
import { RecipeContext } from '../types';

interface RecipeUploadProps {
  onUpload: (ctx: RecipeContext) => void;
}

export function RecipeUpload({ onUpload }: RecipeUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) throw new Error(`Upload failed (${res.status})`);

      const data = await res.json();
      if (!data.state?.recipe) throw new Error('Recipe parsing failed. Try another file.');

      onUpload(data.state);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-gray-300 bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={handleChange}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
          <span className="text-sm">Parsing recipe...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium">Drop a recipe file here or click to upload</p>
          <p className="text-xs">Supports PDF and TXT</p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
