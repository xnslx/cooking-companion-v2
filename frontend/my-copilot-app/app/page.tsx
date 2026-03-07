'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCoAgent } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload, FileText, ChefHat, Sparkles, ArrowRight } from 'lucide-react';
import { RecipeHeaderCard } from './components/RecipeHeaderCard';
import { IngredientsList } from './components/IngredientsList';
import { CookingSteps } from './components/CookingSteps';
import { CookingProgressBar } from './components/CookingProgressBar';
import { PageLoadAnimation } from './components/PageLoadAnimation';
import { WokLoadingAnimation } from './components/WokLoadingAnimation';
import { CustomChatInput } from './components/CustomChatInput';
import { RecipeContext } from './types';

const C = {
  lavenderDark: '#9b87f5',
  lavenderLight: '#ede9fd',
  lavender: '#b8a9f5',
  charcoal: '#1c1c1e',
  warmWhite: '#faf8f4',
  cream: '#f4f0e8',
  muted: '#8a8680',
  mutedLight: '#c0bbb5',
  border: '#e4dfd8',
  sage: '#a8c5a0',
  sageLight: '#edf5eb',
  peach: '#f5c9a0',
  peachLight: '#fef3e8',
};

const exampleRecipes = [
  {
    id: 1,
    emoji: '🍝',
    title: "Grandma's Bolognese",
    tags: ['Italian', '45 mins', '4 servings'],
    desc: 'Rich, slow-cooked meat sauce with tagliatelle and a splash of whole milk.',
    accent: C.peachLight,
    accentBorder: C.peach,
  },
  {
    id: 2,
    emoji: '🍛',
    title: 'Thai Green Curry',
    tags: ['Thai', '30 mins', '2 servings'],
    desc: 'Fragrant coconut curry with tofu, green beans, and fresh basil.',
    accent: C.sageLight,
    accentBorder: C.sage,
  },
  {
    id: 3,
    emoji: '🍞',
    title: 'Banana Bread',
    tags: ['Baking', '1 hr 10 mins', '8 slices'],
    desc: 'Moist, one-bowl banana bread with a hint of cinnamon and vanilla.',
    accent: C.lavenderLight,
    accentBorder: C.lavender,
  },
  {
    id: 4,
    emoji: '🍜',
    title: 'Homemade Ramen',
    tags: ['Japanese', '50 mins', '2 servings'],
    desc: 'Silky broth, soft-boiled eggs, chashu pork, and chewy noodles.',
    accent: C.peachLight,
    accentBorder: C.peach,
  },
  {
    id: 5,
    emoji: '🥗',
    title: 'Niçoise Salad',
    tags: ['French', '20 mins', '2 servings'],
    desc: 'Tuna, olives, green beans, and a sharp Dijon vinaigrette.',
    accent: C.sageLight,
    accentBorder: C.sage,
  },
  {
    id: 6,
    emoji: '🫓',
    title: 'Shakshuka',
    tags: ['Middle Eastern', '25 mins', '2 servings'],
    desc: 'Eggs poached in spiced tomato and pepper sauce, served with crusty bread.',
    accent: C.lavenderLight,
    accentBorder: C.lavender,
  },
];

export default function Home() {
  const { state, setState, running } = useCoAgent<RecipeContext>({
    name: 'recipe_agent',
  });
  const [introComplete, setIntroComplete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeRecipe, setActiveRecipe] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingLabel, setLoadingLabel] = useState('Parsing your recipe...');
  const inputRef = useRef<HTMLInputElement>(null);

  const LOADING_LABELS = [
    'Parsing your recipe...',
    'Identifying ingredients...',
    'Building cooking steps...',
    'Almost ready...',
  ];

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_LABELS.length;
      setLoadingLabel(LOADING_LABELS[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  async function submitFile(file: File) {
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
      if (!data.state?.recipe)
        throw new Error('Could not parse recipe. Try another file.');
      setState(data.state);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function submitExampleRecipe(recipe: (typeof exampleRecipes)[0]) {
    setError(null);
    setLoading(true);
    try {
      const text = `${recipe.title}\n\n${
        recipe.desc
      }\n\nTags: ${recipe.tags.join(', ')}`;
      const file = new File([text], `${recipe.title}.txt`, {
        type: 'text/plain',
      });
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      if (!data.state?.recipe) throw new Error('Could not parse recipe.');
      setState(data.state);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setActiveRecipe(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setActiveRecipe(null);
    }
  };

  const handleRecipeClick = (recipe: (typeof exampleRecipes)[0]) => {
    setActiveRecipe(recipe.id);
    setUploadedFile(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>

      {!introComplete && (
        <PageLoadAnimation onComplete={() => setIntroComplete(true)} />
      )}

      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: C.warmWhite,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Nav */}
        <div
          style={{
            height: 52,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            borderBottom: `1px solid ${C.border}`,
            background: C.warmWhite,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: C.lavenderDark,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChefHat size={13} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                fontSize: 15,
                color: C.charcoal,
              }}
            >
              Dishcraft
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left panel */}
          <div
            style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}
          >
            <AnimatePresence mode="wait">
              {/* Loading view */}
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60vh',
                  }}
                >
                  <div style={{ transform: 'scale(3)', transformOrigin: 'center center' }}>
                    <WokLoadingAnimation label={loadingLabel} />
                  </div>
                </motion.div>
              ) : /* Recipe view */
              state?.recipe ? (
                <motion.div
                  key="recipe"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                >
                  <CookingProgressBar
                    currentStep={state.current_step}
                    totalSteps={state.recipe.steps.length}
                  />
                  {[
                    <RecipeHeaderCard key="header" recipe={state.recipe} />,
                    <motion.div
                      key="ingredients"
                      animate={{ opacity: running ? 0.6 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IngredientsList ingredients={state.recipe.ingredients} />
                    </motion.div>,
                    <CookingSteps
                      key="steps"
                      steps={state.recipe.steps}
                      currentStep={state.current_step}
                    />,
                  ].map((panel, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: 'easeOut',
                        delay: i * 0.1,
                      }}
                    >
                      {panel}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* Upload view */
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Drop zone */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => !uploadedFile && inputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    style={{
                      border: `2px dashed ${
                        dragging
                          ? C.lavenderDark
                          : uploadedFile
                          ? C.sage
                          : C.border
                      }`,
                      borderRadius: 16,
                      background: dragging
                        ? C.lavenderLight
                        : uploadedFile
                        ? C.sageLight
                        : C.cream,
                      padding: '52px 24px',
                      cursor: uploadedFile ? 'default' : 'pointer',
                      transition: 'all 0.22s',
                      marginBottom: 28,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                    }}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.txt"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />

                    <motion.div
                      animate={{
                        y: dragging ? -4 : uploadedFile ? 0 : [0, -3, 0],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: dragging || uploadedFile ? 0 : Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: uploadedFile
                          ? C.sageLight
                          : C.lavenderLight,
                        border: `1.5px solid ${
                          uploadedFile ? C.sage : C.lavender
                        }`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {uploadedFile ? (
                        <FileText size={18} color={C.sage} />
                      ) : (
                        <Upload size={18} color={C.lavenderDark} />
                      )}
                    </motion.div>

                    <div style={{ flex: 1 }}>
                      <AnimatePresence mode="wait">
                        {uploadedFile ? (
                          <motion.div
                            key="uploaded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <p
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: C.charcoal,
                                marginBottom: 2,
                              }}
                            >
                              {uploadedFile.name}
                            </p>
                            <p style={{ fontSize: 12, color: C.muted }}>
                              {(uploadedFile.size / 1024).toFixed(0)} KB · Ready
                              to generate
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <p
                              style={{
                                fontSize: 24,
                                fontWeight: 600,
                                color: C.charcoal,
                                marginBottom: 2,
                              }}
                            >
                              {dragging
                                ? 'Drop it!'
                                : 'Drop a recipe file here or click to upload'}
                            </p>
                            <p style={{ fontSize: 12, color: C.muted }}>
                              Supports PDF and TXT
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {error && (
                        <p
                          style={{
                            fontSize: 12.5,
                            color: '#f70000',
                            marginTop: 4,
                          }}
                        >
                          {error}
                        </p>
                      )}
                    </div>

                    {uploadedFile && !loading && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          submitFile(uploadedFile);
                        }}
                        style={{
                          background: C.lavenderDark,
                          color: '#fff',
                          border: 'none',
                          borderRadius: 99,
                          padding: '8px 18px',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontFamily: "'DM Sans', sans-serif",
                          flexShrink: 0,
                        }}
                      >
                        {loading ? 'Parsing...' : 'Generate'}{' '}
                        <ArrowRight size={13} />
                      </motion.button>
                    )}

                    {loading && (
                      <div
                        style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}
                      >
                        Parsing recipe...
                      </div>
                    )}

                    {uploadedFile && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                          setError(null);
                        }}
                        style={{
                          fontSize: 11,
                          color: C.mutedLight,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          flexShrink: 0,
                        }}
                      >
                        Remove
                      </span>
                    )}
                  </motion.div>

                  {/* Section header */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: C.charcoal,
                          marginBottom: 2,
                        }}
                      >
                        Or start with an example
                      </p>
                      <p style={{ fontSize: 12, color: C.muted }}>
                        Click any recipe — the assistant will load it and you
                        can start chatting
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 14.5,
                        color: C.muted,
                        background: C.lavenderLight,
                        border: `1px solid ${C.lavender}`,
                        borderRadius: 99,
                        padding: '4px 11px',
                      }}
                    >
                      <Sparkles size={11} color={C.lavenderDark} />
                      <span style={{ fontWeight: 600, color: C.lavenderDark }}>
                        Chat to edit after loading
                      </span>
                    </div>
                  </motion.div>

                  {/* Recipe cards */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(400px, 1fr))',
                      gap: 12,
                    }}
                  >
                    {exampleRecipes.map((recipe, i) => {
                      const isActive = activeRecipe === recipe.id;
                      return (
                        <motion.div
                          key={recipe.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: 0.25 + i * 0.06,
                          }}
                          onClick={() => handleRecipeClick(recipe)}
                          whileHover={{
                            y: -2,
                            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                          }}
                          style={{
                            background: isActive ? recipe.accent : C.warmWhite,
                            border: `1.5px solid ${
                              isActive ? recipe.accentBorder : C.border
                            }`,
                            borderRadius: 14,
                            padding: '60px 20px 60px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: C.lavenderDark,
                              }}
                            />
                          )}
                          <motion.div
                            style={{
                              fontSize: 28,
                              marginBottom: 10,
                              display: 'inline-block',
                            }}
                            whileHover={{
                              scale: 1.4,
                              rotate: [0, -15, 15, -10, 10, 0],
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          >
                            {recipe.emoji}
                          </motion.div>
                          <p
                            style={{
                              fontSize: 24,
                              fontWeight: 700,
                              color: C.charcoal,
                              marginBottom: 6,
                              fontFamily: "'Lora', serif",
                              lineHeight: 1.25,
                            }}
                          >
                            {recipe.title}
                          </p>
                          <p
                            style={{
                              fontSize: 16,
                              color: C.muted,
                              lineHeight: 1.55,
                              marginBottom: 10,
                            }}
                          >
                            {recipe.desc}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 5,
                            }}
                          >
                            {recipe.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  fontSize: 12.5,
                                  color: C.muted,
                                  background: C.cream,
                                  border: `1px solid ${C.border}`,
                                  borderRadius: 99,
                                  padding: '2px 8px',
                                  fontWeight: 500,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{
                                marginTop: 10,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                              }}
                            >
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  submitExampleRecipe(recipe);
                                }}
                                style={{
                                  background: C.lavenderDark,
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 99,
                                  padding: '6px 14px',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  fontFamily: "'DM Sans', sans-serif",
                                }}
                              >
                                {loading ? 'Loading...' : 'Load in chat'}{' '}
                                <ArrowRight size={11} />
                              </motion.button>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Chat panel */}
          <div
            style={{
              width: 520,
              flexShrink: 0,
              borderLeft: `1px solid ${C.border}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            {/* Chat header */}
            <div
              style={{
                padding: '16px 18px',
                borderBottom: `1px solid ${C.border}`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: C.sage,
                  }}
                />
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: C.charcoal }}
                >
                  Recipe Assistant
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
                {state?.recipe
                  ? 'Recipe loaded — ask me anything to tweak it.'
                  : activeRecipe
                  ? 'Recipe selected — click "Load in chat" to start.'
                  : 'Upload a recipe or click an example to get started.'}
              </p>
            </div>

            {/* CopilotChat fills the rest */}
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CopilotChat className="h-full" Input={CustomChatInput as React.ComponentType<object>} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
