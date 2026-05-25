"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WordOption {
  label: string;
  emoji: string;
}

interface EmotionOption {
  label: string;
  emoji: string;
}

interface RoutineStep {
  id: number;
  label: string;
  emoji: string;
  status: "done" | "active" | "pending";
}

interface FeatureCard {
  emoji: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const WORDS: WordOption[] = [
  { label: "Eu", emoji: "🙋" },
  { label: "Quero", emoji: "💭" },
  { label: "Preciso", emoji: "❗" },
  { label: "Não", emoji: "🚫" },
  { label: "Água", emoji: "💧" },
  { label: "Comida", emoji: "🍎" },
  { label: "Ajuda", emoji: "🤝" },
  { label: "Banheiro", emoji: "🚽" },
];

const EMOTIONS: EmotionOption[] = [
  { label: "Feliz", emoji: "😊" },
  { label: "Triste", emoji: "😢" },
  { label: "Bravo", emoji: "😡" },
  { label: "Ansioso", emoji: "😰" },
  { label: "Cansado", emoji: "😴" },
  { label: "Com dor", emoji: "🤕" },
];

const INITIAL_ROUTINE: RoutineStep[] = [
  { id: 1, label: "Acordar", emoji: "☀️", status: "done" },
  { id: 2, label: "Café", emoji: "🍎", status: "done" },
  { id: 3, label: "Escola", emoji: "🏫", status: "active" },
  { id: 4, label: "Descanso", emoji: "🎮", status: "pending" },
  { id: 5, label: "Almoço", emoji: "🍽️", status: "pending" },
  { id: 6, label: "Dormir", emoji: "🌙", status: "pending" },
];

const FEATURES: FeatureCard[] = [
  {
    emoji: "💬",
    title: "Frases",
    description: "Monte frases com pictogramas e ouça com voz natural",
    color: "#534AB7",
    bg: "#EEEDFE",
  },
  {
    emoji: "😊",
    title: "Emoções",
    description: "Comunique sentimentos com facilidade",
    color: "#0F6E56",
    bg: "#E1F5EE",
  },
  {
    emoji: "📅",
    title: "Rotina",
    description: "Acompanhe o dia com timeline interativa",
    color: "#854F0B",
    bg: "#FAEEDA",
  },
  {
    emoji: "🌙",
    title: "Sensorial",
    description: "Reduza estímulos para mais conforto",
    color: "#993C1D",
    bg: "#FAECE7",
  },
  {
    emoji: "🔊",
    title: "Voz",
    description: "Controle velocidade e tom da síntese",
    color: "#3B6D11",
    bg: "#EAF3DE",
  },
  {
    emoji: "🎨",
    title: "Personalizar",
    description: "Ajuste cores e tamanho dos botões",
    color: "#993556",
    bg: "#FBEAF0",
  },
];

// ─── Global fix style (injected once) ────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      width: 100%;
    }
  `}</style>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [sensoryMode, setSensoryMode] = useState(false);
  const [phrase, setPhrase] = useState<string[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [routine, setRoutine] = useState<RoutineStep[]>(INITIAL_ROUTINE);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const addWord = (word: string) => setPhrase((prev) => [...prev, word]);
  const removeWord = (idx: number) =>
    setPhrase((prev) => prev.filter((_, i) => i !== idx));
  const clearPhrase = () => setPhrase([]);

  const speak = () => {
    if (phrase.length === 0) {
      showToast("Adicione palavras primeiro!");
      return;
    }
    const text = phrase.join(" ");
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "pt-BR";
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
    showToast(`"${text}"`);
  };

  const toggleStep = (id: number) => {
    setRoutine((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "done" ? "pending" : "done" }
          : s
      )
    );
  };

  return (
    <>
      <GlobalStyle />
      <div
        style={{
          fontFamily: "'Nunito', 'Segoe UI', sans-serif",
          background: sensoryMode ? "#f0eeee" : "#f7f6fb",
          minHeight: "100vh",
          // KEY FIX: remove maxWidth centering that caused overflow, let it fill screen
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          paddingBottom: 40,
          filter: sensoryMode ? "saturate(0.35) contrast(1.15)" : "none",
          transition: "filter 0.4s ease",
          position: "relative",
        }}
      >
        {/* ── Navbar ── */}
        <nav
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8e6f0",
            padding: "0 16px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 18,
              fontWeight: 800,
              color: "#534AB7",
              letterSpacing: "-0.5px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                background: "#534AB7",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              💬
            </span>
            ComuniCAA
          </div>

          <button
            onClick={() => {
              setSensoryMode((v) => !v);
              showToast(
                sensoryMode ? "Modo normal restaurado" : "Modo sensorial ativado"
              );
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "inherit",
              padding: "6px 10px",
              borderRadius: 20,
              border: sensoryMode
                ? "1.5px solid #534AB7"
                : "1px solid #d0cee8",
              background: sensoryMode ? "#EEEDFE" : "#f7f6fb",
              color: sensoryMode ? "#3C3489" : "#888",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            🌙 {sensoryMode ? "Normal" : "Sensorial"}
          </button>
        </nav>

        {/* ── Hero ── */}
        <section style={{ padding: "28px 16px 20px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#EEEDFE",
              color: "#3C3489",
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 14px",
              borderRadius: 20,
              marginBottom: 14,
              textTransform: "uppercase" as const,
              letterSpacing: "0.05em",
            }}
          >
            ⭐ CAA · Comunicação Alternativa
          </div>

          <h1
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#1a1830",
              lineHeight: 1.2,
              marginBottom: 10,
              letterSpacing: "-0.5px",
              margin: "0 0 10px",
            }}
          >
            Toda voz merece{" "}
            <span style={{ color: "#534AB7" }}>ser ouvida</span>
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "#666",
              lineHeight: 1.65,
              marginBottom: 20,
              padding: "0 4px",
            }}
          >
            Ferramenta de comunicação aumentativa e alternativa para apoiar
            pessoas com dificuldades de fala ou linguagem.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <button
              style={{
                background: "#534AB7",
                color: "#fff",
                border: "none",
                padding: "13px 12px",
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              ▶ Começar
            </button>
            <button
              style={{
                background: "#fff",
                color: "#1a1830",
                border: "1px solid #d0cee8",
                padding: "13px 12px",
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              ℹ O que é CAA?
            </button>
          </div>
        </section>

        {/* ── Phrase Builder ── */}
        <section style={{ padding: "0 16px 20px" }}>
          <SectionLabel emoji="💬" text="Construtor de frases" />

          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e6f0",
              borderRadius: 16,
              padding: 14,
            }}
          >
            {/* Phrase display */}
            <div
              style={{
                background: "#EEEDFE",
                borderRadius: 12,
                padding: "10px 12px",
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap" as const,
                gap: 6,
                marginBottom: 12,
              }}
            >
              {phrase.length === 0 ? (
                <span
                  style={{
                    color: "#9f9bd4",
                    fontSize: 13,
                    fontStyle: "italic",
                  }}
                >
                  Toque nas palavras abaixo...
                </span>
              ) : (
                phrase.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => removeWord(i)}
                    title="Remover"
                    style={{
                      background: "#534AB7",
                      color: "#fff",
                      border: "none",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {w} ×
                  </button>
                ))
              )}
            </div>

            {/* Word grid — 4 cols fixed */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 6,
                marginBottom: 12,
              }}
            >
              {WORDS.map((w) => (
                <button
                  key={w.label}
                  onClick={() => addWord(w.label)}
                  style={{
                    background: "#f7f6fb",
                    border: "1px solid #e8e6f0",
                    borderRadius: 12,
                    padding: "10px 4px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1a1830",
                    textAlign: "center" as const,
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    gap: 3,
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{w.emoji}</span>
                  {w.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={speak}
                style={{
                  flex: 1,
                  background: "#1D9E75",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  minWidth: 0,
                }}
              >
                🔊 Falar frase
              </button>
              <button
                onClick={clearPhrase}
                style={{
                  background: "#f7f6fb",
                  border: "1px solid #e8e6f0",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#888",
                  flexShrink: 0,
                }}
              >
                Limpar
              </button>
            </div>
          </div>
        </section>

        {/* ── Emotions ── */}
        <section style={{ padding: "0 16px 20px" }}>
          <SectionLabel emoji="😊" text="Como você está?" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {EMOTIONS.map((e) => {
              const selected = selectedEmotion === e.label;
              return (
                <button
                  key={e.label}
                  onClick={() => {
                    setSelectedEmotion(e.label);
                    showToast(`Selecionado: ${e.label}`);
                  }}
                  style={{
                    background: selected ? "#EEEDFE" : "#fff",
                    border: selected
                      ? "1.5px solid #534AB7"
                      : "1px solid #e8e6f0",
                    borderRadius: 14,
                    padding: "12px 6px",
                    cursor: "pointer",
                    textAlign: "center" as const,
                    fontFamily: "inherit",
                    width: "100%",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 3 }}>{e.emoji}</div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: selected ? "#3C3489" : "#888",
                    }}
                  >
                    {e.label}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Routine ── */}
        <section style={{ padding: "0 16px 20px" }}>
          <SectionLabel emoji="📅" text="Minha rotina de hoje" />

          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e6f0",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Progress bar */}
            <div style={{ padding: "12px 14px 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#888",
                  marginBottom: 6,
                }}
              >
                <span>Progresso</span>
                <span>
                  {routine.filter((s) => s.status === "done").length}/
                  {routine.length} etapas
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "#f0eeff",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${
                      (routine.filter((s) => s.status === "done").length /
                        routine.length) *
                      100
                    }%`,
                    background: "#534AB7",
                    borderRadius: 10,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {/* Horizontal scroll — KEY: use -webkit-overflow-scrolling for smooth iOS scroll */}
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                padding: "0 12px 12px",
                gap: 8,
                scrollbarWidth: "none" as const,
                WebkitOverflowScrolling: "touch" as never,
              }}
            >
              {routine.map((step) => {
                const isDone = step.status === "done";
                const isActive = step.status === "active";
                return (
                  <button
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    style={{
                      flex: "none",
                      width: 72,
                      background: isDone
                        ? "#E1F5EE"
                        : isActive
                        ? "#FAEEDA"
                        : "#f7f6fb",
                      border: isDone
                        ? "1.5px solid #1D9E75"
                        : isActive
                        ? "1.5px solid #BA7517"
                        : "1px solid #e8e6f0",
                      borderRadius: 14,
                      padding: "10px 8px",
                      textAlign: "center" as const,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      position: "relative" as const,
                    }}
                  >
                    {isDone && (
                      <span
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          fontSize: 10,
                          color: "#1D9E75",
                          fontWeight: 900,
                        }}
                      >
                        ✓
                      </span>
                    )}
                    <div style={{ fontSize: 22, marginBottom: 3 }}>
                      {step.emoji}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: isDone
                          ? "#0F6E56"
                          : isActive
                          ? "#854F0B"
                          : "#888",
                      }}
                    >
                      {step.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ padding: "0 16px 20px" }}>
          <SectionLabel emoji="⭐" text="Recursos" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "#fff",
                  border: "1px solid #e8e6f0",
                  borderRadius: 16,
                  padding: "14px 12px",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: f.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    marginBottom: 8,
                    flexShrink: 0,
                  }}
                >
                  {f.emoji}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#1a1830",
                    marginBottom: 3,
                  }}
                >
                  {f.title}
                </div>
                <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Toast ── */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#3C3489",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "inherit",
              zIndex: 200,
              maxWidth: "calc(100vw - 32px)",
              whiteSpace: "nowrap" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
              pointerEvents: "none" as const,
              boxShadow: "0 4px 20px rgba(83,74,183,0.25)",
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────
function SectionLabel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
        color: "#888",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {emoji} {text}
    </div>
  );
}