// Cyberpunk Color Palette
export const COLORS = {
  neonGreen: "#00ff88",
  neonCyan: "#00d9ff",
  neonPurple: "#8b5cf6",
  neonPink: "#ff0055",
  neonGold: "#ffd700",
  neonOrange: "#ff6b00",
  neonMagenta: "#ff00ff",
  neonTeal: "#00ffcc",
  
  // Backgrounds
  darkBg: "#0a0a0f",
  cardBg: "#141420",
  mutedBg: "#1a1a2e",
  
  // Text
  textPrimary: "#e0e0e0",
  textMuted: "#717182",
} as const;

// Animation Durations
export const ANIMATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 1,
} as const;

// Breakpoints (for reference)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
