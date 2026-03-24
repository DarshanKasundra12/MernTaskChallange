import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function parseRgbColor(color) {
  const match = color.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const parts = match[1].split(',').map((part) => part.trim());
  if (parts.length < 3) return null;

  const r = Number.parseFloat(parts[0]);
  const g = Number.parseFloat(parts[1]);
  const b = Number.parseFloat(parts[2]);
  const a = parts[3] !== undefined ? Number.parseFloat(parts[3]) : 1;

  if ([r, g, b].some((value) => Number.isNaN(value))) return null;
  return { r, g, b, a: Number.isNaN(a) ? 1 : a };
}

function resolveBackgroundColor(element) {
  let current = element;

  while (current && current !== document.documentElement) {
    const bg = window.getComputedStyle(current).backgroundColor;
    const parsed = parseRgbColor(bg);

    if (parsed && parsed.a > 0.08) {
      return parsed;
    }

    current = current.parentElement;
  }

  const bodyBg = parseRgbColor(window.getComputedStyle(document.body).backgroundColor);
  return bodyBg || { r: 0, g: 0, b: 0, a: 1 };
}

function isLightColor({ r, g, b }) {
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance >= 170;
}

function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [onLightBg, setOnLightBg] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updateEnabled = () => setEnabled(mediaQuery.matches);
    updateEnabled();

    mediaQuery.addEventListener('change', updateEnabled);
    return () => mediaQuery.removeEventListener('change', updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const onMove = (event) => {
      const { clientX, clientY } = event;
      setPosition({ x: clientX, y: clientY });

      const hovered = document.elementFromPoint(clientX, clientY);
      if (!(hovered instanceof Element)) return;

      setActive(Boolean(hovered.closest('a, button, [data-clickable="true"]')));

      const bg = resolveBackgroundColor(hovered);
      setOnLightBg(isLightColor(bg));
    };

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;
    document.body.classList.add('cursor-none');
    return () => document.body.classList.remove('cursor-none');
  }, [enabled]);

  if (!enabled) return null;

  const ringMain = onLightBg ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)';
  const ringSoft = onLightBg ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.58)';
  const ringFill = onLightBg ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)';
  const dot = onLightBg ? '#060606' : '#ffffff';
  const glow = onLightBg ? '0 0 16px rgba(0,0,0,0.35)' : '0 0 22px rgba(255,255,255,0.95)';

  return (
    <>
      <motion.div
        className="custom-cursor custom-cursor--ring"
        animate={{
          x: position.x - 17,
          y: position.y - 17,
          width: active ? 44 : 34,
          height: active ? 44 : 34,
          borderColor: active ? ringMain : ringSoft,
          backgroundColor: ringFill,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.7 }}
      />
      <motion.div
        className="custom-cursor custom-cursor--dot"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: active ? 1.25 : 1,
          backgroundColor: dot,
          boxShadow: glow,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 40, mass: 0.3 }}
      />
    </>
  );
}

export default CustomCursor;
