import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES injected once
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #0d0f1a;
  --ink-soft: #3c3f52;
  --ink-muted: #7c7f96;
  --surface: #f4f3ef;
  --white: #ffffff;
  --border: #e2e1dc;
  --gold: #b8882a;
  --gold-hover: #a07522;
  --gold-pale: #fdf6e8;
  --teal: #1d6b6b;
  --teal-light: #e6f4f4;
  --rose: #8b2a2a;
  --rose-light: #fdf0f0;
  --violet: #4a2a8b;
  --violet-light: #f0edfb;
  --olive: #4a6b2a;
  --olive-light: #eef4e8;
  --warn: #c06a00;
  --warn-light: #fff4e0;
  --radius: 14px;
  --radius-sm: 8px;
  --shadow: 0 4px 24px rgba(13,15,26,0.09);
  --shadow-md: 0 8px 40px rgba(13,15,26,0.14);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--surface);
  color: var(--ink);
  min-height: 100vh;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── AUTH BACKGROUND ── */
.auth-bg {
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(29,107,107,0.22) 0%, rgba(29,107,107,0.06) 60%, rgba(180,160,100,0.10) 100%),
    #d8e8e8;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.auth-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(29,107,107,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29,107,107,0.12) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ── AUTH CARD ── */
.auth-card {
  position: relative;
  background: var(--white);
  border-radius: 20px;
  padding: 40px 40px 36px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(13,15,26,0.16);
  animation: cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(22px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
.auth-title {
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  color: var(--ink);
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}
.auth-subtitle { font-size: 14px; color: var(--ink-muted); margin-bottom: 28px; }

/* ── FORM FIELDS ── */
.field { margin-bottom: 18px; }
.field label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-soft);
  margin-bottom: 7px;
}
.field input {
  width: 100%;
  padding: 11px 15px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: var(--white);
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.field input:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(29,107,107,0.1);
}
.field input::placeholder { color: #b0b3c6; }

/* ── GOLD BUTTON ── */
.btn-gold {
  width: 100%;
  padding: 13px;
  background: var(--gold);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
  margin-top: 4px;
  letter-spacing: 0.01em;
}
.btn-gold:hover {
  background: var(--gold-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(184,136,42,0.35);
}
.btn-gold:active { transform: none; }

.auth-switch {
  text-align: center;
  margin-top: 20px;
  font-size: 13.5px;
  color: var(--ink-muted);
}
.auth-switch a {
  color: var(--teal);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
.auth-switch a:hover { text-decoration: underline; }

.auth-error {
  background: #fff0f0;
  border: 1px solid #f5c0c0;
  color: #b00;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 16px;
}

/* ── TOPBAR ── */
.topbar {
  background: var(--ink);
  color: white;
  padding: 0 28px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.topbar-brand { display: flex; align-items: center; gap: 11px; }
.topbar-logo {
  width: 32px; height: 32px;
  background: var(--gold);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
}
.topbar-name {
  font-family: 'DM Serif Display', serif;
  font-size: 17px;
  letter-spacing: 0.01em;
}
.topbar-tag { font-size: 11.5px; color: rgba(255,255,255,0.4); margin-left: 2px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-user { font-size: 13px; color: rgba(255,255,255,0.55); }
.btn-logout {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8);
  padding: 6px 15px;
  border-radius: 7px;
  font-size: 13px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.18s;
}
.btn-logout:hover { background: rgba(255,255,255,0.14); }

/* ── LAYOUT ── */
.app-layout { display: flex; min-height: calc(100vh - 56px); }

/* ── SIDEBAR ── */
.sidebar {
  width: 220px;
  min-width: 220px;
  background: var(--ink);
  padding: 24px 14px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sidebar-brand-card {
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 22px;
  border: 1px solid rgba(255,255,255,0.08);
}
.sidebar-brand-icon { font-size: 22px; margin-bottom: 6px; }
.sidebar-brand-title {
  font-family: 'DM Serif Display', serif;
  font-size: 15px;
  color: white;
  line-height: 1.2;
  margin-bottom: 4px;
}
.sidebar-brand-sub { font-size: 11px; color: rgba(255,255,255,0.38); line-height: 1.4; }
.sidebar-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  padding: 10px 10px 4px;
  font-weight: 600;
}
.nav-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.16s;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
}
.nav-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.82); }
.nav-btn.active { background: var(--gold); color: var(--ink); font-weight: 700; }
.nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }

/* ── MAIN CONTENT ── */
.main-content {
  flex: 1;
  padding: 36px 40px;
  overflow-y: auto;
  max-width: 920px;
}

/* ── PAGE TITLE ── */
.page-header { margin-bottom: 26px; }
.page-title {
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  color: var(--ink);
  line-height: 1.2;
  margin-bottom: 5px;
}
.page-sub { font-size: 14px; color: var(--ink-muted); }

/* ── INFO BOXES ── */
.info-box {
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 13.5px;
  margin-bottom: 18px;
  border: 1px solid transparent;
}
.info-box.teal { background: var(--teal-light); border-color: #b0d8d8; color: var(--teal); }
.info-box.gold { background: var(--gold-pale); border-color: #e8d0a0; color: #7a5800; }
.info-box.warn { background: var(--warn-light); border-color: #f0c060; color: var(--warn); }

/* ── HOME CARDS GRID ── */
.home-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 24px;
}
.home-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
  position: relative;
  overflow: hidden;
}
.home-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.22s;
}
.home-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
.home-card:hover::after { transform: scaleX(1); }
.home-card.c-gold::after { background: var(--gold); }
.home-card.c-gold:hover { border-color: #d4aa5a; }
.home-card.c-teal::after { background: var(--teal); }
.home-card.c-teal:hover { border-color: #6ab0b0; }
.home-card.c-violet::after { background: var(--violet); }
.home-card.c-violet:hover { border-color: #9a7ad0; }
.home-card.c-rose::after { background: var(--rose); }
.home-card.c-rose:hover { border-color: #d08080; }
.home-card.c-olive::after { background: var(--olive); }
.home-card.c-olive:hover { border-color: #90b070; }
.home-card.c-warn::after { background: var(--warn); }
.home-card.c-warn:hover { border-color: #f0aa60; }
.hc-icon { font-size: 26px; margin-bottom: 10px; }
.hc-title { font-weight: 700; font-size: 14.5px; color: var(--ink); margin-bottom: 4px; }
.hc-desc { font-size: 12.5px; color: var(--ink-muted); line-height: 1.5; margin-bottom: 14px; }
.hc-cta { font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.hc-cta.c-gold { color: var(--gold); }
.hc-cta.c-teal { color: var(--teal); }
.hc-cta.c-violet { color: var(--violet); }
.hc-cta.c-rose { color: var(--rose); }
.hc-cta.c-olive { color: var(--olive); }
.hc-cta.c-warn { color: var(--warn); }

/* ── HOW IT WORKS ── */
.how-box {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 20px;
}
.how-title { font-weight: 700; font-size: 15px; color: var(--ink); margin-bottom: 16px; }
.how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.how-item {
  background: var(--surface);
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid var(--border);
}
.how-item-title { font-weight: 700; font-size: 13.5px; color: var(--ink); margin-bottom: 4px; }
.how-item-desc { font-size: 12.5px; color: var(--ink-muted); line-height: 1.45; }
.how-item.span2 { grid-column: 1 / -1; }

/* ── TOPIC PICKER ── */
.topic-row {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.topic-label { font-weight: 600; font-size: 13.5px; }
select.topic-select {
  padding: 8px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  color: var(--ink);
  outline: none;
  cursor: pointer;
  transition: border-color 0.16s;
}
select.topic-select:focus { border-color: var(--gold); }

/* ── BUTTONS ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.16s;
  text-decoration: none;
}
.btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
.btn:active { transform: none; box-shadow: none; }
.btn-ink { background: var(--ink); color: white; }
.btn-ink:hover { background: #1e2030; }
.btn-gold-sm { background: var(--gold); color: white; }
.btn-gold-sm:hover { background: var(--gold-hover); }
.btn-teal { background: var(--teal); color: white; }
.btn-teal:hover { background: #155959; }
.btn-rose { background: var(--rose); color: white; }
.btn-rose:hover { background: #7a2222; }
.btn-violet { background: var(--violet); color: white; }
.btn-violet:hover { background: #3d2278; }
.btn-olive { background: var(--olive); color: white; }
.btn-olive:hover { background: #3c5a22; }
.btn-warn { background: var(--warn); color: white; }
.btn-warn:hover { background: #a05800; }
.btn-ghost {
  background: transparent;
  color: var(--ink-soft);
  border: 1.5px solid var(--border);
}
.btn-ghost:hover { border-color: var(--ink-soft); box-shadow: none; transform: none; }

/* ── QUESTION CARDS ── */
.q-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 12px;
}
.q-num { font-size: 11px; font-weight: 600; color: var(--ink-muted); letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 7px; }
.q-text { font-weight: 600; font-size: 14.5px; color: var(--ink); margin-bottom: 14px; line-height: 1.4; }
.q-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-radius: 7px;
  border: 1.5px solid var(--border);
  margin-bottom: 7px;
  cursor: pointer;
  font-size: 13.5px;
  color: var(--ink-soft);
  transition: all 0.14s;
  background: var(--white);
  user-select: none;
}
.q-option:hover { border-color: #b0c8c8; background: var(--teal-light); }
.q-option.selected { border-color: var(--teal); background: var(--teal-light); color: var(--teal); font-weight: 600; }
.q-option input[type=radio] { accent-color: var(--teal); }
.q-count { font-size: 13px; color: var(--ink-muted); margin-bottom: 14px; }

/* ── SCORE DISPLAY ── */
.score-box {
  border-radius: var(--radius);
  padding: 28px;
  text-align: center;
  margin-bottom: 18px;
  border: 2px solid transparent;
}
.score-box.good { background: #eef8ee; border-color: #90c890; }
.score-box.ok   { background: #fff9e6; border-color: #e8c84a; }
.score-box.low  { background: #ffeaea; border-color: #e89090; }
.score-num { font-size: 72px; font-weight: 700; line-height: 1; margin-bottom: 6px; font-family: 'DM Serif Display', serif; }
.score-box.good .score-num { color: #2e7d32; }
.score-box.ok   .score-num { color: #b07800; }
.score-box.low  .score-num { color: #b71c1c; }
.score-label { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
.score-emoji { font-size: 26px; margin-bottom: 6px; }
.score-meta { font-size: 13px; color: var(--ink-muted); }

/* ── STAT GRIDS ── */
.stat-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.stat-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.stat-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}
.stat-val { font-size: 24px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.stat-lbl { font-size: 12px; color: var(--ink-muted); font-weight: 500; }

/* ── TRAIT BAR ── */
.trait-row { margin-bottom: 12px; }
.trait-head { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 13.5px; }
.trait-name { font-weight: 600; }
.trait-val { font-weight: 700; }
.trait-bar-bg { background: #e8e7e2; border-radius: 6px; height: 10px; overflow: hidden; }
.trait-bar-fill { height: 100%; border-radius: 6px; transition: width 0.8s cubic-bezier(0.22,1,0.36,1); }

/* ── COMM TABS ── */
.tab-row {
  display: flex;
  gap: 0;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 18px;
}
.tab-btn {
  flex: 1;
  padding: 11px 0;
  background: var(--white);
  color: var(--ink-soft);
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.16s;
}
.tab-btn.active { background: var(--violet); color: white; }
.tab-btn:not(.active):hover { background: var(--surface); }

/* ── PROMPTS / CHIPS ── */
.chip-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
.chip {
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  border: 1.5px solid transparent;
  transition: all 0.15s;
}

/* ── TEXTAREA ── */
textarea.app-textarea {
  width: 100%;
  padding: 13px 15px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  resize: vertical;
  outline: none;
  transition: border-color 0.16s;
  background: var(--white);
}
textarea.app-textarea:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(29,107,107,0.08); }

/* ── RECORD ZONE ── */
.record-zone {
  background: #fff8fb;
  border: 2px dashed #f0b0c8;
  border-radius: 14px;
  padding: 28px;
  text-align: center;
  margin-bottom: 16px;
}
.rec-icon { font-size: 52px; margin-bottom: 10px; }
.rec-status { font-weight: 700; font-size: 15px; margin-bottom: 14px; }
.wave-bars { display: flex; gap: 4px; justify-content: center; align-items: center; margin-top: 12px; }
.wave-bar { width: 5px; border-radius: 3px; background: #ad1457; opacity: 0.7; }

/* ── MIC BLOCKED ── */
.mic-blocked-box {
  background: var(--warn-light);
  border: 1.5px solid #f0c060;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

/* ── FEEDBACK BOX ── */
.feedback-box {
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 14px;
  font-size: 13.5px;
}
.feedback-box strong { display: block; margin-bottom: 5px; }
.feedback-box p { margin: 0; line-height: 1.5; }

/* ── REVIEW ROW ── */
.review-row {
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 7px;
  font-size: 13.5px;
}
.review-row.correct { background: #eaf5ea; border: 1px solid #a5d6a7; }
.review-row.wrong   { background: #ffeaea; border: 1px solid #ef9a9a; }

/* ── VIDEO ZONE ── */
.video-zone {
  background: #1a1a2e;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.video-zone video { width: 100%; max-height: 320px; display: block; border-radius: 14px; }
.live-badge {
  position: absolute; top: 10px; right: 12px;
  background: #e53935; color: white;
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 700;
}

/* ── PLACEMENT INPUT GRID ── */
.placement-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
  margin-bottom: 18px;
}
.placement-field {
  background: #fff8f8;
  border: 1px solid #f5cece;
  border-radius: 10px;
  padding: 14px;
}
.placement-field label {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--rose);
  margin-bottom: 6px;
}
.placement-field input {
  width: 100%;
  padding: 8px 11px;
  border: 1.5px solid #efb8b8;
  border-radius: 7px;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s;
}
.placement-field input:focus { border-color: var(--rose); }
.placement-field .hint { font-size: 11px; color: var(--ink-muted); margin-top: 4px; }

/* ── ROLE / GAP CHIPS ── */
.role-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.role-chip {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  color: white;
}

/* ── DETAIL SUMMARY ── */
details summary { cursor: pointer; font-size: 12px; color: var(--ink-muted); margin-top: 10px; }
details pre { font-family: 'JetBrains Mono', monospace; font-size: 11px; background: var(--surface); padding: 10px; border-radius: 6px; overflow: auto; margin-top: 6px; }

/* ── TIPS BOX ── */
.tips-box { background: var(--surface); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; }
.tips-title { font-weight: 700; font-size: 13.5px; margin-bottom: 8px; }
.tips-item { font-size: 13px; color: var(--ink-soft); margin: 4px 0; }

/* ── SKILL TAG ── */
.skill-tag {
  display: inline-block;
  padding: 3px 11px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin: 3px;
}

/* ── LINKEDIN COMPONENTS ── */
.prospects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.prospect-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  transition: box-shadow 0.2s;
}

.prospect-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.prospect-header {
  margin-bottom: 16px;
}

.prospect-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}

.prospect-title {
  font-size: 14px;
  color: var(--ink-soft);
  margin-bottom: 2px;
}

.prospect-company {
  font-size: 13px;
  color: var(--ink-muted);
  font-weight: 600;
}

.prospect-details {
  margin-bottom: 16px;
}

.prospect-details div {
  font-size: 13px;
  color: var(--ink-muted);
  margin: 4px 0;
}

.prospect-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.prospect-actions .btn-small {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--ink-soft);
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.15s;
}

.prospect-actions .btn-small:hover {
  background: var(--teal);
  color: white;
  border-color: var(--teal);
}

.prospect-actions .btn-small.secondary:hover {
  background: var(--ink-muted);
  color: white;
}

.campaigns-list {
  display: grid;
  gap: 16px;
}

.campaign-item {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 20px;
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.campaign-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}

.campaign-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: var(--teal);
  color: white;
}

.campaign-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.campaign-metrics div {
  font-size: 14px;
  color: var(--ink-soft);
}
`;

/* ──────────────────────────────────────────
   UTILITY HELPERS
────────────────────────────────────────── */
const scoreClass = (s) => s >= 70 ? 'good' : s >= 45 ? 'ok' : 'low';
const scoreEmoji = (s) => s >= 80 ? '🏆 Excellent!' : s >= 70 ? '😊 Good Job!' : s >= 50 ? '📈 Keep Going!' : '💪 Keep Practicing!';
const traitColor = (s) => s >= 70 ? '#2e7d32' : s >= 45 ? '#b07800' : '#b71c1c';

/* ──────────────────────────────────────────
   STATIC QUESTION BANKS (No API needed)
────────────────────────────────────────── */
const QUESTION_BANK = {
  python: [
    { id:'p1', question:'What is the output of print(type([]))?', options:["<class 'list'>","<class 'array'>","<class 'tuple'>","<class 'dict'>"], answer:"<class 'list'>", explanation:'[] creates an empty list. type() returns the class type.' },
    { id:'p2', question:'Which keyword is used to define a function in Python?', options:['func','define','def','function'], answer:'def', explanation:"Python uses 'def' to define functions, e.g. def my_func():" },
    { id:'p3', question:'What does len("Hello") return?', options:['4','5','6','Error'], answer:'5', explanation:"len() counts characters. 'Hello' has 5 characters." },
    { id:'p4', question:'Which of these is a mutable data type in Python?', options:['tuple','string','list','int'], answer:'list', explanation:'Lists are mutable (can be changed). Tuples and strings are immutable.' },
    { id:'p5', question:'What is the correct way to create a dictionary?', options:["d = []","d = ()","d = {}","d = <>"], answer:'d = {}', explanation:'Curly braces {} create a dictionary in Python.' },
    { id:'p6', question:'What does the "range(5)" function return?', options:['[1,2,3,4,5]','[0,1,2,3,4,5]','[0,1,2,3,4]','[1,2,3,4]'], answer:'[0,1,2,3,4]', explanation:'range(5) generates numbers from 0 up to (not including) 5.' },
    { id:'p7', question:'How do you handle exceptions in Python?', options:['try/catch','try/except','if/else','error/handle'], answer:'try/except', explanation:'Python uses try/except blocks (not try/catch like Java/JS).' },
    { id:'p8', question:'What is a lambda function?', options:['A named function','A class method','An anonymous function','A built-in function'], answer:'An anonymous function', explanation:'Lambda creates small anonymous functions: lambda x: x+1' },
    { id:'p9', question:'What does "append()" do to a list?', options:['Removes last item','Adds item at beginning','Adds item at end','Sorts the list'], answer:'Adds item at end', explanation:'list.append(x) adds x to the end of the list.' },
    { id:'p10', question:'Which operator is used for floor division?', options:['/','%','//','**'], answer:'//', explanation:'// is floor division: 7//2 = 3. / is regular division: 7/2 = 3.5' },
  ],
  sql: [
    { id:'s1', question:'Which SQL command is used to retrieve data?', options:['GET','FETCH','SELECT','RETRIEVE'], answer:'SELECT', explanation:'SELECT is the fundamental SQL command to query and retrieve data.' },
    { id:'s2', question:'Which clause filters rows AFTER grouping?', options:['WHERE','FILTER','HAVING','GROUP'], answer:'HAVING', explanation:'HAVING filters after GROUP BY. WHERE filters before grouping.' },
    { id:'s3', question:'What does PRIMARY KEY constraint ensure?', options:['Unique + Not Null','Only Unique','Only Not Null','Foreign reference'], answer:'Unique + Not Null', explanation:'PRIMARY KEY = UNIQUE + NOT NULL. Each row must have a unique non-null identifier.' },
    { id:'s4', question:'Which JOIN returns all rows from both tables?', options:['INNER JOIN','LEFT JOIN','RIGHT JOIN','FULL OUTER JOIN'], answer:'FULL OUTER JOIN', explanation:'FULL OUTER JOIN returns all rows from both tables, with NULLs where no match.' },
    { id:'s5', question:'What does GROUP BY do?', options:['Sorts results','Filters rows','Groups rows with same values','Joins tables'], answer:'Groups rows with same values', explanation:'GROUP BY groups rows sharing a value so aggregate functions can be applied.' },
    { id:'s6', question:'Which function counts rows in a table?', options:['SUM()','AVG()','COUNT()','TOTAL()'], answer:'COUNT()', explanation:'COUNT(*) counts all rows. COUNT(column) counts non-null values in that column.' },
    { id:'s7', question:'What does DISTINCT keyword do?', options:['Sorts uniquely','Removes duplicate rows','Adds unique constraint','Creates index'], answer:'Removes duplicate rows', explanation:'SELECT DISTINCT removes duplicate values from the result set.' },
    { id:'s8', question:'Which command adds a new row to a table?', options:['ADD','APPEND','INSERT INTO','UPDATE'], answer:'INSERT INTO', explanation:'INSERT INTO table (cols) VALUES (vals) adds new rows.' },
    { id:'s9', question:'What is a foreign key?', options:['Primary key of same table','Key from another table','Encrypted key','Index key'], answer:'Key from another table', explanation:'A FOREIGN KEY references the PRIMARY KEY of another table to create relationships.' },
    { id:'s10', question:'Which SQL clause sorts the result?', options:['SORT BY','GROUP BY','ORDER BY','ARRANGE BY'], answer:'ORDER BY', explanation:'ORDER BY col ASC/DESC sorts query results.' },
  ],
  javascript: [
    { id:'j1', question:'Which keyword declares a block-scoped variable?', options:['var','let','both','neither'], answer:'let', explanation:"'let' is block-scoped. 'var' is function-scoped. Use 'let' or 'const' in modern JS." },
    { id:'j2', question:'What does "===" check in JavaScript?', options:['Value only','Type only','Value and Type','Neither'], answer:'Value and Type', explanation:'=== (strict equality) checks both value AND type. == only checks value after coercion.' },
    { id:'j3', question:'What is the output of typeof null?', options:['null','undefined','object','string'], answer:'object', explanation:"typeof null === 'object' is a famous JS bug kept for legacy compatibility." },
    { id:'j4', question:'Which method adds an element to the END of an array?', options:['push()','pop()','shift()','unshift()'], answer:'push()', explanation:'push() adds to end. pop() removes from end. unshift() adds to start. shift() removes from start.' },
    { id:'j5', question:'What does "async/await" help with?', options:['Loops','Styling','Asynchronous code','Math'], answer:'Asynchronous code', explanation:'async/await makes asynchronous code (like API calls) look and behave like synchronous code.' },
    { id:'j6', question:'What is a closure in JavaScript?', options:['A loop','A function accessing outer scope variables','A class','An event'], answer:'A function accessing outer scope variables', explanation:'A closure is a function that remembers variables from its outer scope even after that scope exits.' },
    { id:'j7', question:'Which method converts JSON string to object?', options:['JSON.stringify()','JSON.parse()','JSON.convert()','JSON.decode()'], answer:'JSON.parse()', explanation:'JSON.parse(str) → object. JSON.stringify(obj) → string.' },
    { id:'j8', question:'What does "map()" do on an array?', options:['Filters elements','Sorts elements','Creates new array with transformed elements','Finds one element'], answer:'Creates new array with transformed elements', explanation:'map() returns a new array by applying a function to each element.' },
    { id:'j9', question:'What is "undefined" in JavaScript?', options:['Null value','Variable declared but not assigned','Empty string','Zero'], answer:'Variable declared but not assigned', explanation:"A variable declared with 'let x;' has value undefined until assigned." },
    { id:'j10', question:'Which event fires when DOM is fully loaded?', options:['onload','DOMContentLoaded','onready','onstart'], answer:'DOMContentLoaded', explanation:'DOMContentLoaded fires when HTML is parsed. window.onload waits for all resources too.' },
  ],
  'data structures': [
    { id:'d1', question:'Which data structure uses LIFO order?', options:['Queue','Stack','Tree','Graph'], answer:'Stack', explanation:'Stack = Last In First Out (LIFO). Like a stack of plates.' },
    { id:'d2', question:'What is the time complexity of binary search?', options:['O(n)','O(n²)','O(log n)','O(1)'], answer:'O(log n)', explanation:'Binary search halves the search space each step, giving O(log n) complexity.' },
    { id:'d3', question:'Which traversal visits root FIRST?', options:['Inorder','Postorder','Preorder','Level order'], answer:'Preorder', explanation:'Preorder: Root → Left → Right. Inorder: Left → Root → Right. Postorder: Left → Right → Root.' },
    { id:'d4', question:'What is a linked list node made of?', options:['Only data','Only pointer','Data + pointer','Key + value'], answer:'Data + pointer', explanation:'Each linked list node contains data and a pointer/reference to the next node.' },
    { id:'d5', question:'Which structure is best for BFS traversal?', options:['Stack','Queue','Array','Heap'], answer:'Queue', explanation:'BFS uses a Queue (FIFO) to visit nodes level by level.' },
  ],
  'os concepts': [
    { id:'o1', question:'What is a deadlock?', options:['CPU overload','Processes waiting for each other indefinitely','Memory leak','Thread crash'], answer:'Processes waiting for each other indefinitely', explanation:'Deadlock occurs when two or more processes wait for resources held by each other.' },
    { id:'o2', question:'What does CPU scheduling decide?', options:['Memory allocation','Which process runs next','File storage','Network speed'], answer:'Which process runs next', explanation:'CPU scheduling algorithms (FCFS, SJF, Round Robin) decide the order of process execution.' },
    { id:'o3', question:'What is virtual memory?', options:['RAM only','Disk used as RAM extension','Cache memory','GPU memory'], answer:'Disk used as RAM extension', explanation:'Virtual memory uses disk space to extend RAM, allowing larger programs to run.' },
    { id:'o4', question:'What is a semaphore used for?', options:['Memory management','Process synchronization','File storage','CPU scheduling'], answer:'Process synchronization', explanation:'Semaphores control access to shared resources and prevent race conditions.' },
    { id:'o5', question:'Which is NOT a process state?', options:['Running','Waiting','Sleeping','Compiling'], answer:'Compiling', explanation:'Process states are: New, Ready, Running, Waiting, Terminated. Compiling is not a process state.' },
  ],
};

function getQuestions(topic) {
  const bank = QUESTION_BANK[topic] || QUESTION_BANK['python'];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((q, i) => ({ ...q, id: `q${i}` }));
}

const WRITING_FEEDBACK = (score) => score >= 75
  ? 'Excellent writing! Your response is clear, well-structured and uses good vocabulary. Keep it up!'
  : score >= 55
  ? 'Good effort! Try to vary your sentence structure and use more specific vocabulary to strengthen your writing.'
  : 'Focus on clarity — write shorter, direct sentences. Proofread for grammar and stay on topic.';

const SPEAKING_FEEDBACK = (score) => score >= 75
  ? 'Great response! You covered the topic well with clear, confident language.'
  : score >= 55
  ? 'Good attempt! Try to reduce filler words and structure your answer with a clear opening and closing.'
  : 'Practice speaking in complete sentences. Use the STAR method for experience questions.';

function scoreWriting(text) {
  const words = text.split(' ').filter(w => w).length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || [text]).length;
  const fillers = (text.match(/\b(um|uh|like|basically|literally|actually)\b/gi) || []).length;
  const avgWPS = sentences > 0 ? words / sentences : words;
  const clarity   = Math.min(100, Math.round(60 + (avgWPS > 5 && avgWPS < 20 ? 20 : 0) + (sentences >= 3 ? 10 : 0) + (words >= 30 ? 10 : 0)));
  const grammar   = Math.min(100, Math.round(70 + (fillers === 0 ? 15 : -fillers * 5) + (sentences >= 2 ? 15 : 0)));
  const vocabulary= Math.min(100, Math.round(55 + Math.min(words * 0.6, 35) + (new Set(text.toLowerCase().split(' ')).size / Math.max(words,1) > 0.6 ? 10 : 0)));
  const structure = Math.min(100, Math.round(50 + (sentences >= 3 ? 20 : 0) + (words >= 40 ? 20 : 0) + (words >= 60 ? 10 : 0)));
  const overall   = Math.round((clarity + grammar + vocabulary + structure) / 4);
  return { communication_score: overall, clarity, grammar, vocabulary, structure, feedback: WRITING_FEEDBACK(overall) };
}

function scoreSpeaking(text) {
  const words = text.split(' ').filter(w => w).length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || [text]).length;
  const fillerWords = (text.match(/\b(um|uh|like|you know|basically|literally|actually|so|well)\b/gi) || []).length;
  const avgWPS = sentences > 0 ? Math.round(words / sentences) : words;
  const clarity    = Math.min(100, Math.round(55 + (words >= 40 ? 20 : words) + (fillerWords === 0 ? 15 : -fillerWords * 3)));
  const vocabulary = Math.min(100, Math.round(50 + Math.min(words * 0.5, 30) + (new Set(text.toLowerCase().split(' ')).size / Math.max(words,1) > 0.55 ? 20 : 0)));
  const overall    = Math.round((clarity + vocabulary) / 2);
  return { communication_score: overall, clarity, vocabulary, wordCount: words, sentenceCount: sentences, fillerWords, avgWordsPerSentence: avgWPS, feedback: SPEAKING_FEEDBACK(overall) };
}

function scoreResume(text) {
  const lower = text.toLowerCase();
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);

  // Skill categories
  const SKILL_CATS = {
    'Programming Languages': ['python','java','javascript','c++','typescript','c#','ruby','go','kotlin','swift','r','matlab'],
    'Web Technologies':      ['react','angular','vue','node','html','css','express','django','flask','spring','nextjs','tailwind'],
    'Databases':             ['sql','mysql','postgresql','mongodb','oracle','redis','sqlite','firebase','dynamodb'],
    'Cloud & DevOps':        ['aws','azure','gcp','docker','kubernetes','git','github','ci/cd','jenkins','terraform'],
    'Data & AI':             ['machine learning','deep learning','tensorflow','pytorch','pandas','numpy','scikit','nlp','data analysis','power bi','tableau'],
    'Soft Skills':           ['leadership','communication','teamwork','problem solving','agile','scrum','management','presentation'],
  };
  const foundByCategory = {};
  let allSkills = [];
  Object.entries(SKILL_CATS).forEach(([cat, kws]) => {
    const found = kws.filter(k => lower.includes(k));
    if (found.length) { foundByCategory[cat] = found; allSkills = [...allSkills, ...found]; }
  });

  // Section detection
  const hasContact    = /@|phone|email|linkedin|github|portfolio/i.test(text);
  const hasSummary    = /summary|objective|profile|about/i.test(text);
  const hasEducation  = /bachelor|master|b\.e|b\.tech|mca|msc|degree|university|college|gpa|cgpa/i.test(text);
  const hasExperience = /experience|internship|intern|worked|employment|company|organization/i.test(text);
  const hasProjects   = /project|built|developed|created|implemented|designed/i.test(text);
  const hasCerts      = /certif|award|achievement|honor/i.test(text);
  const hasLinks      = /github\.com|linkedin\.com|portfolio|http/i.test(text);

  // Extract name (first non-empty line likely)
  const candidateName = lines[0]?.length < 50 ? lines[0] : 'Candidate';

  // Education details
  const eduLevel = /master|mca|msc|m\.tech|m\.e/i.test(text) ? 'Post Graduate'
    : /bachelor|b\.e|b\.tech|b\.sc|degree/i.test(text) ? 'Graduate'
    : hasEducation ? 'Undergraduate' : 'Not detected';

  // Experience
  const expMatch = text.match(/(\d+)\+?\s*year/i);
  const expYears = expMatch ? expMatch[1] + '+ years' : hasExperience ? 'Experienced' : 'Fresher';

  // Section scores (0-100 each)
  const sectionScores = {
    'Contact Info':  hasContact    ? 100 : 0,
    'Summary':       hasSummary    ? 100 : 0,
    'Education':     hasEducation  ? 100 : 0,
    'Experience':    hasExperience ? 100 : 0,
    'Projects':      hasProjects   ? 100 : 0,
    'Skills':        allSkills.length >= 5 ? 100 : allSkills.length >= 2 ? 60 : allSkills.length > 0 ? 30 : 0,
    'Certifications': hasCerts     ? 100 : 0,
    'Online Links':  hasLinks      ? 100 : 0,
  };

  // ATS keywords
  const atsKeywords = ['results','achieved','improved','reduced','increased','led','managed','designed','developed','implemented','optimized','delivered','collaborated','mentored'];
  const atsFound = atsKeywords.filter(k => lower.includes(k));
  const atsScore = Math.min(100, Math.round(atsFound.length * 10));

  // Word count quality
  const words = text.split(' ').filter(w => w).length;
  const lengthScore = words < 100 ? 30 : words < 200 ? 55 : words < 400 ? 80 : words <= 700 ? 100 : 75;

  // Section completeness score
  const sectionVals = Object.values(sectionScores);
  const completeness = Math.round(sectionVals.reduce((a,b)=>a+b,0) / sectionVals.length);

  // Skill depth
  const skillScore = Math.min(100, allSkills.length * 5 + Object.keys(foundByCategory).length * 8);

  // Overall
  const resume_score = Math.min(100, Math.round(
    completeness * 0.35 + skillScore * 0.25 + atsScore * 0.20 + lengthScore * 0.20
  ));

  // Strengths
  const strengths = [];
  if (allSkills.length >= 6) strengths.push('Good technical skill coverage');
  if (hasEducation) strengths.push('Education section present');
  if (hasExperience || hasProjects) strengths.push('Work/project experience included');
  if (hasSummary) strengths.push('Professional summary included');
  if (hasLinks) strengths.push('Online presence (GitHub/LinkedIn)');
  if (atsFound.length >= 4) strengths.push('Good use of action verbs');
  if (strengths.length === 0) strengths.push('Resume submitted for review');

  // Improvements
  const improvements = [];
  if (!hasContact)    improvements.push('Add contact info: email, phone, LinkedIn');
  if (!hasSummary)    improvements.push('Add a 2-3 line professional summary at the top');
  if (!hasProjects)   improvements.push('List 2-3 projects with tech stack and outcomes');
  if (!hasCerts)      improvements.push('Add certifications (Coursera, AWS, Google, etc.)');
  if (!hasLinks)      improvements.push('Include GitHub and LinkedIn profile links');
  if (atsFound.length < 3) improvements.push('Use more action verbs: led, built, improved, reduced');
  if (allSkills.length < 5) improvements.push('Add more technical skills relevant to your target role');
  if (words < 200)    improvements.push('Expand your resume — it appears too brief');
  if (improvements.length === 0) improvements.push('Keep resume updated with latest projects and skills');

  return {
    resume_score, candidateName, eduLevel, expYears,
    skills: allSkills, skills_count: allSkills.length,
    foundByCategory, sectionScores, atsScore, atsFound,
    completeness, skillScore, lengthScore, wordCount: words,
    strengths, improvements,
    feedback: resume_score >= 75 ? 'Excellent resume! Strong structure, good skills and ATS-friendly.'
      : resume_score >= 55 ? 'Good resume with room to improve. Add missing sections and more action verbs.'
      : 'Resume needs significant work. Follow the improvement tips below.',
  };
}

function predictPlacement(data) {
  const tech = parseFloat(data.technical) || 0;
  const comm = parseFloat(data.communication) || 0;
  const beh  = parseFloat(data.behavioral) || 0;
  const cog  = parseFloat(data.cognitive) || 0;
  const res  = parseFloat(data.resume) || 0;
  const vid  = parseFloat(data.video) || 0;
  // Count how many assessments were completed
  const done = [tech,comm,beh,cog,res,vid].filter(v => v > 0);
  const avg  = done.length > 0 ? done.reduce((a,b)=>a+b,0)/done.length : 0;
  // Auto-estimate academic score from cognitive + technical
  const academic = Math.round((cog*0.5 + tech*0.5) || avg);
  const overall = Math.round(academic*0.20 + tech*0.25 + comm*0.15 + beh*0.15 + cog*0.15 + res*0.05 + vid*0.05);
  const prob = Math.min(98, Math.round(overall * 0.9 + (overall > 70 ? 8 : 0)));
  const roles = [];
  if (tech >= 60) roles.push('Software Engineer');
  if (tech >= 50 && comm >= 55) roles.push('Full Stack Developer');
  if (cog >= 60) roles.push('Data Analyst');
  if (comm >= 65) roles.push('Business Analyst');
  if (beh >= 65 && comm >= 60) roles.push('Product Manager');
  if (vid >= 60) roles.push('Client-Facing Developer');
  if (roles.length === 0) roles.push('Junior Developer', 'QA Engineer', 'Technical Support');
  const gaps = [];
  if (tech < 60) gaps.push('Technical Skills');
  if (comm < 55) gaps.push('Communication');
  if (cog < 55) gaps.push('Problem Solving');
  if (res < 55) gaps.push('Resume Quality');
  if (beh < 55) gaps.push('Soft Skills');
  if (vid < 55) gaps.push('Interview Presence');
  const rec = prob >= 70 ? 'Excellent! You are well-prepared for placements. Focus on DSA practice and mock interviews.' : prob >= 50 ? 'Good progress! Strengthen your weak areas and retake assessments to improve.' : 'Focus on fundamentals — complete all assessments, build projects, and practice regularly.';
  return { placement_probability: prob, overall_score: overall, suitable_roles: roles.slice(0,4), skill_gaps: gaps, recommendation: rec, academic_estimate: academic };
}

/* ──────────────────────────────────────────
   STATIC DATA
────────────────────────────────────────── */
const BEHAVIORAL_QUESTIONS = [
  { id: 'b1', question: 'I enjoy working in a team and collaborating with others.', trait: 'Agreeableness' },
  { id: 'b2', question: 'I am always prepared and organized in my work.', trait: 'Conscientiousness' },
  { id: 'b3', question: 'I often feel anxious or stressed in challenging situations.', trait: 'Neuroticism' },
  { id: 'b4', question: 'I like to explore new ideas and experiences.', trait: 'Openness' },
  { id: 'b5', question: 'I tend to take charge and lead in group situations.', trait: 'Extraversion' },
  { id: 'b6', question: 'I follow through on commitments and deadlines consistently.', trait: 'Conscientiousness' },
  { id: 'b7', question: 'I adapt quickly to unexpected changes at work.', trait: 'Openness' },
  { id: 'b8', question: 'I prefer to work independently rather than in groups.', trait: 'Extraversion' },
];

const COGNITIVE_QUESTIONS = [
  { id: 'c1', category: 'Pattern Recognition', question: 'Complete the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], answer: '42' },
  { id: 'c2', category: 'Logical Reasoning', question: 'All roses are flowers. Some flowers fade quickly. Therefore:', options: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade', 'Roses never fade'], answer: 'Some roses may fade quickly' },
  { id: 'c3', category: 'Math Reasoning', question: 'A train travels 60 km in 40 minutes. What is its speed in km/h?', options: ['80', '90', '100', '120'], answer: '90' },
  { id: 'c4', category: 'Verbal Reasoning', question: 'DOCTOR is to HOSPITAL as TEACHER is to?', options: ['Book', 'School', 'Student', 'Pen'], answer: 'School' },
  { id: 'c5', category: 'Pattern Recognition', question: 'Which number does NOT belong: 8, 27, 64, 100, 125?', options: ['8', '100', '125', '27'], answer: '100' },
  { id: 'c6', category: 'Abstract Reasoning', question: 'If ABCD = ZYXW, what does EFGH equal?', options: ['VUTR', 'VUTS', 'WUTS', 'TUVW'], answer: 'VUTS' },
  { id: 'c7', category: 'Math Reasoning', question: 'What is 15% of 240?', options: ['30', '36', '40', '45'], answer: '36' },
  { id: 'c8', category: 'Logical Reasoning', question: 'If all Bloops are Razzies, and all Razzies are Lazzies, then:', options: ['All Bloops are Lazzies', 'All Lazzies are Bloops', 'No Bloops are Lazzies', 'Some Lazzies are not Razzies'], answer: 'All Bloops are Lazzies' },
];

/* ──────────────────────────────────────────
   ROOT APP
────────────────────────────────────────── */
export default function App() {
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  // Inject global CSS once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!user) {
    return authMode === 'login'
      ? <LoginPage onLogin={setUser} onSwitch={() => setAuthMode('register')} />
      : <RegisterPage onRegister={setUser} onSwitch={() => setAuthMode('login')} />;
  }
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

/* ──────────────────────────────────────────
   LOGIN PAGE
────────────────────────────────────────── */
function LoginPage({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handle = () => {
    if (!email || !pass) { setErr('Please fill in all fields.'); return; }
    const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'Student';
    onLogin({ name, email });
  };

  return (
    <div className="auth-bg">
      <div className="auth-grid" />
      <div className="auth-card">
        <div className="auth-title">Welcome back 👋</div>
        <div className="auth-subtitle">Sign in to continue your assessments.</div>
        {err && <div className="auth-error">{err}</div>}
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="student@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>
        <button className="btn-gold" onClick={handle}>Login</button>
        <div className="auth-switch">Don't have an account? <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', padding: 0 }}>Register</button></div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   REGISTER PAGE
────────────────────────────────────────── */
function RegisterPage({ onRegister, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');

  const handle = () => {
    if (!name || !email || !pass || !confirm) { setErr('Please fill in all fields.'); return; }
    if (pass !== confirm) { setErr('Passwords do not match.'); return; }
    if (pass.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    onRegister({ name, email });
  };

  return (
    <div className="auth-bg">
      <div className="auth-grid" />
      <div className="auth-card">
        <div className="auth-title">Create Student Account</div>
        <div className="auth-subtitle">Register to start your assessments.</div>
        {err && <div className="auth-error">{err}</div>}
        <div className="field">
          <label>Full Name</label>
          <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="student@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>
        <button className="btn-gold" onClick={handle}>Create Account</button>
        <div className="auth-switch">Already have an account? <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', padding: 0 }}>Login</button></div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   DASHBOARD SHELL
────────────────────────────────────────── */
const NAV = [
  { id: 'test', icon: '💻', label: 'Technical Test' },
  { id: 'communication', icon: '🗣️', label: 'Communication' },
  { id: 'behavioral', icon: '🧠', label: 'Behavioral' },
  { id: 'cognitive', icon: '🔍', label: 'Cognitive' },
  { id: 'resume', icon: '📄', label: 'Resume Analyzer' },
  { id: 'video', icon: '🎥', label: 'Video AI' },
  { id: 'placement', icon: '🏆', label: 'Placement Predictor' },
  { id: 'outreach', icon: '🤝', label: 'Employer Outreach' },
];

function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState('test');
  // Shared scores — updated by each assessment page automatically
  const [scores, setScores] = useState({ technical: null, communication: null, behavioral: null, cognitive: null, resume: null, video: null });

  const updateScore = (key, val) => setScores(prev => ({ ...prev, [key]: val }));

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">🎓</div>
          <div>
            <div className="topbar-name">Employability AI</div>
            <div className="topbar-tag">Assessment & Placement Platform</div>
          </div>
        </div>
        <div className="topbar-right">
          <span className="topbar-user">Welcome, {user.name}</span>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="app-layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-brand-card">
            <div className="sidebar-brand-icon">🎓</div>
            <div className="sidebar-brand-title">Employability AI</div>
            <div className="sidebar-brand-sub">Student Assessment &amp; Placement Prediction System</div>
          </div>
          <div className="sidebar-label">Navigation</div>
          {NAV.map(n => {
            const scoreKey = n.id === 'test' ? 'technical' : n.id === 'video' ? 'video' : n.id;
            const s = scores[scoreKey];
            return (
              <button key={n.id} className={`nav-btn ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}
                style={{ position: 'relative' }}>
                <span className="nav-icon">{n.icon}</span> {n.label}
                {s !== null && s !== undefined && s !== '' && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: page === n.id ? 'rgba(255,255,255,0.25)' : 'var(--gold)', color: page === n.id ? 'white' : 'var(--ink)', padding: '2px 6px', borderRadius: 8 }}>{s}%</span>
                )}
              </button>
            );
          })}
        </div>

        {/* MAIN */}
        <div className="main-content">
          {page === 'test'          && <TechnicalTest onScore={v => updateScore('technical', v)} />}
          {page === 'communication' && <CommunicationPage onScore={v => updateScore('communication', v)} />}
          {page === 'behavioral'    && <BehavioralPage onScore={v => updateScore('behavioral', v)} />}
          {page === 'cognitive'     && <CognitivePage onScore={v => updateScore('cognitive', v)} />}
          {page === 'resume'        && <ResumePage onScore={v => updateScore('resume', v)} />}
          {page === 'video'         && <VideoPage onScore={v => updateScore('video', v)} />}
          {page === 'placement'     && <PlacementPage scores={scores} />}
          {page === 'outreach'      && <OutreachPage />}
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────
   VOICE UTILITY — Browser TTS
────────────────────────────────────────── */
function speak(text, onEnd) {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.92;
  utt.pitch = 1.05;
  utt.volume = 1;
  // Prefer a natural English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google'))
    || voices.find(v => v.lang.startsWith('en') && !v.localService)
    || voices.find(v => v.lang.startsWith('en'))
    || voices[0];
  if (preferred) utt.voice = preferred;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}
function stopSpeaking() { window.speechSynthesis.cancel(); }

/* ──────────────────────────────────────────
   TECHNICAL TEST — Voice AI Interviewer
────────────────────────────────────────── */
function TechnicalTest({ onScore }) {
  const TOTAL_QUESTIONS = 5;
  const [topic, setTopic] = useState('python');
  const [phase, setPhase] = useState('pick');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState('');
  const [waitingFeedback, setWaitingFeedback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const sessionQsRef = useRef([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  // Preload voices on mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => stopSpeaking();
  }, []);

  const sayText = (text, onEnd) => {
    if (!voiceEnabled) { onEnd && onEnd(); return; }
    setIsSpeaking(true);
    speak(text, () => { setIsSpeaking(false); onEnd && onEnd(); });
  };

  const getFeedback = (q, isCorrect) =>
    isCorrect
      ? `Correct! ${q.explanation}`
      : `Not quite. The correct answer is ${q.answer}. ${q.explanation}`;

  /* ── Start session ── */
  const startSession = () => {
    stopSpeaking();
    const qs = getQuestions(topic);
    sessionQsRef.current = qs;
    setLoading(true);
    setPhase('chat');
    setChatHistory([]);
    setScores([]);
    setQIndex(0);
    setSelectedOpt('');
    setCurrentQ(null);

    const greeting = `Hello! Welcome to your ${topic} technical interview. I will ask you ${TOTAL_QUESTIONS} questions one by one. Listen carefully and choose the best answer. Let's begin with question 1.`;
    const firstQ = qs[0];
    const questionText = `${firstQ.question} Your options are: A, ${firstQ.options[0]}. B, ${firstQ.options[1]}. C, ${firstQ.options[2]}. D, ${firstQ.options[3]}.`;

    setTimeout(() => {
      setChatHistory([
        { role: 'ai', content: `👋 Hello! Welcome to your ${topic.toUpperCase()} interview. I'll ask ${TOTAL_QUESTIONS} questions. Listen carefully and choose the best answer!`, isGreeting: true },
        { role: 'ai', content: `Question 1 of ${TOTAL_QUESTIONS}`, meta: firstQ, isNextQ: true }
      ]);
      setCurrentQ(firstQ);
      setLoading(false);
      sayText(greeting + ' ' + questionText);
    }, 500);
  };

  /* ── Re-read current question ── */
  const rereadQuestion = () => {
    if (!currentQ) return;
    const text = `${currentQ.question} Your options are: A, ${currentQ.options[0]}. B, ${currentQ.options[1]}. C, ${currentQ.options[2]}. D, ${currentQ.options[3]}.`;
    sayText(text);
  };

  /* ── Submit answer ── */
  const submitAnswer = () => {
    if (!selectedOpt || !currentQ || waitingFeedback) return;
    setWaitingFeedback(true);
    stopSpeaking();

    const isCorrect = selectedOpt.trim() === currentQ.answer.trim();
    const feedbackText = getFeedback(currentQ, isCorrect);
    const newUserMsg = { role: 'user', content: selectedOpt };
    const newScore = { correct: isCorrect, feedback: feedbackText, question: currentQ.question, userAnswer: selectedOpt, correctAnswer: currentQ.answer };
    const newScores = [...scores, newScore];
    setScores(newScores);
    const nextIndex = qIndex + 1;

    setChatHistory(prev => [...prev, newUserMsg]);
    setLoading(true);

    const afterFeedback = () => {
      if (nextIndex >= TOTAL_QUESTIONS) {
        const correct = newScores.filter(s => s.correct).length;
        const finalText = `Well done! You have completed all ${TOTAL_QUESTIONS} questions. You got ${correct} out of ${TOTAL_QUESTIONS} correct. Great effort!`;
        setChatHistory(prev => [
          ...prev,
          { role: 'ai', content: feedbackText, isFeedback: true, correct: isCorrect },
          { role: 'ai', content: `🎉 Session complete! Calculating your results...`, isFinal: true }
        ]);
        setLoading(false);
        setWaitingFeedback(false);
        sayText(feedbackText + ' ' + finalText, () => {
          const finPct = Math.round((newScores.filter(s=>s.correct).length / newScores.length)*100);
      if (onScore) onScore(finPct);
      setTimeout(() => { setPhase('result'); setCurrentQ(null); }, 800);
        });
      } else {
        const nextQ = sessionQsRef.current[nextIndex];
        const nextText = `Question ${nextIndex + 1}. ${nextQ.question} Your options are: A, ${nextQ.options[0]}. B, ${nextQ.options[1]}. C, ${nextQ.options[2]}. D, ${nextQ.options[3]}.`;
        setChatHistory(prev => [
          ...prev,
          { role: 'ai', content: feedbackText, isFeedback: true, correct: isCorrect },
          { role: 'ai', content: `Question ${nextIndex + 1} of ${TOTAL_QUESTIONS}`, meta: nextQ, isNextQ: true }
        ]);
        setCurrentQ(nextQ);
        setQIndex(nextIndex);
        setSelectedOpt('');
        setLoading(false);
        setWaitingFeedback(false);
        sayText(feedbackText + ' Now, ' + nextText);
      }
    };

    setTimeout(() => afterFeedback(), 600);
  };

  /* ── Finish → result ── */

  /* ─────── RESULT SCREEN ─────── */
  if (phase === 'result') {
    const correct = scores.filter(s => s.correct).length;
    const pct = Math.round((correct / scores.length) * 100);
    return (
      <>
        <div className="page-header">
          <div className="page-title">💻 {topic.toUpperCase()} Results</div>
          <div className="page-sub">Voice AI Interview Complete</div>
        </div>
        <div className={`score-box ${scoreClass(pct)}`}>
          <div className="score-num">{pct}%</div>
          <div className="score-label">{correct} / {scores.length} Correct</div>
          <div className="score-emoji">{scoreEmoji(pct)}</div>
          <div className="score-meta">Topic: {topic.toUpperCase()}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📋 Question Review</div>
          {scores.map((s, i) => (
            <div key={i} className={`review-row ${s.correct ? 'correct' : 'wrong'}`}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                {s.correct ? '✅' : '❌'} Q{i + 1}: {s.question}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>
                Your answer: <strong style={{ color: s.correct ? '#2e7d32' : '#c62828' }}>{s.userAnswer}</strong>
                {!s.correct && <span style={{ color: '#2e7d32', marginLeft: 10 }}>✅ Correct: {s.correctAnswer}</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontStyle: 'italic' }}>{s.feedback}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-ink" onClick={() => { setPhase('pick'); setScores([]); setChatHistory([]); stopSpeaking(); }}>🔄 Take Another Test</button>
      </>
    );
  }

  /* ─────── CHAT SCREEN ─────── */
  if (phase === 'chat') {
    return (
      <>
        <div className="page-header">
          <div className="page-title">🎙️ Voice AI Interviewer — {topic.toUpperCase()}</div>
          <div className="page-sub" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            Question {Math.min(qIndex + 1, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {isSpeaking && <span style={{ fontSize: 12, background: '#e8f4f4', color: 'var(--teal)', padding: '3px 10px', borderRadius: 12, fontWeight: 600, animation: 'pulse 1s infinite' }}>🔊 Speaking...</span>}
              <button onClick={() => { setVoiceEnabled(v => !v); if (isSpeaking) stopSpeaking(); }}
                style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: voiceEnabled ? 'var(--teal)' : 'var(--surface)', color: voiceEnabled ? 'white' : 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
                {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
              </button>
              {currentQ && !waitingFeedback && !loading && (
                <button onClick={rereadQuestion}
                  style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
                  🔁 Repeat
                </button>
              )}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'var(--border)', borderRadius: 8, height: 8, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ width: `${(qIndex / TOTAL_QUESTIONS) * 100}%`, background: 'var(--gold)', height: '100%', borderRadius: 8, transition: 'width 0.5s ease' }} />
        </div>

        {/* Chat bubbles */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '20px 20px 16px', marginBottom: 16, minHeight: 200, maxHeight: 400, overflowY: 'auto' }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '90%' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🤖</div>
                  <div style={{ flex: 1 }}>
                    {msg.isFeedback && (
                      <div style={{ background: msg.correct ? '#eef8ee' : '#fff0f0', border: `1px solid ${msg.correct ? '#a5d6a7' : '#f5a0a0'}`, borderRadius: '4px 14px 14px 14px', padding: '10px 14px', fontSize: 13.5, color: 'var(--ink-soft)' }}>
                        {msg.correct ? '✅ ' : '❌ '}{msg.content}
                      </div>
                    )}
                    {msg.isNextQ && msg.meta && (
                      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '14px 16px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{msg.content}</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{msg.meta.question}</div>
                      </div>
                    )}
                    {!msg.isFeedback && !msg.isNextQ && (
                      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', fontSize: 13.5, color: 'var(--ink-soft)' }}>
                        {msg.content}
                        {msg.meta?.question && <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginTop: 6 }}>{msg.meta.question}</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div style={{ background: 'var(--ink)', color: 'white', borderRadius: '14px 4px 14px 14px', padding: '10px 16px', fontSize: 13.5, maxWidth: '72%' }}>
                  {msg.content}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0,1,2].map(d => <div key={d} style={{ width: 8, height: 8, background: 'var(--ink-muted)', borderRadius: '50%', animation: `bounce 1.2s ${d*0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Answer options */}
        {currentQ && !waitingFeedback && !loading && (
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              {isSpeaking ? '🔊 AI is speaking... then choose your answer:' : '👇 Choose your answer:'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {currentQ.options?.map((opt, idx) => (
                <button key={opt} onClick={() => { if (!isSpeaking) setSelectedOpt(opt); }}
                  style={{
                    padding: '12px 14px', borderRadius: 9, cursor: isSpeaking ? 'not-allowed' : 'pointer',
                    border: selectedOpt === opt ? '2px solid var(--teal)' : '1.5px solid var(--border)',
                    background: selectedOpt === opt ? 'var(--teal-light)' : 'var(--surface)',
                    color: selectedOpt === opt ? 'var(--teal)' : isSpeaking ? 'var(--ink-muted)' : 'var(--ink-soft)',
                    fontWeight: selectedOpt === opt ? 700 : 500, fontSize: 13.5,
                    fontFamily: 'DM Sans, sans-serif', textAlign: 'left', transition: 'all 0.15s',
                    opacity: isSpeaking ? 0.6 : 1
                  }}>
                  <span style={{ fontWeight: 700, marginRight: 6, color: 'var(--ink-muted)' }}>{['A','B','C','D'][idx]})</span>{opt}
                </button>
              ))}
            </div>
            <button className="btn btn-teal" onClick={submitAnswer}
              disabled={!selectedOpt || loading || isSpeaking}
              style={{ width: '100%', justifyContent: 'center', opacity: (!selectedOpt || isSpeaking) ? 0.5 : 1 }}>
              {isSpeaking ? '🔊 Wait for AI to finish...' : '✅ Submit Answer'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { stopSpeaking(); setPhase('pick'); setChatHistory([]); setScores([]); }}>✕ End Session</button>
        </div>
        <style>{`
          @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        `}</style>
      </>
    );
  }

  /* ─────── PICK SCREEN ─────── */
  return (
    <>
      <div className="page-header">
        <div className="page-title">🎙️ Voice AI Technical Interview</div>
        <div className="page-sub">The AI interviewer will speak each question aloud. Select your answer and submit!</div>
      </div>

      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🎙️ How it works</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            ['🔊', 'AI speaks the question', 'Reads question + all 4 options aloud'],
            ['👆', 'You select an answer', 'Click any option then hit Submit'],
            ['💬', 'AI gives feedback', 'Speaks the result and moves to next question'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--teal-light)', borderRadius: 8, border: '1px solid #b0d8d8', fontSize: 13, color: 'var(--teal)' }}>
          💡 <strong>Tip:</strong> Use the <strong>🔇 Voice OFF</strong> button to disable speech, or <strong>🔁 Repeat</strong> to re-read the question.
        </div>
      </div>

      <div className="topic-row">
        <span className="topic-label">📝 Select Topic:</span>
        <select className="topic-select" value={topic} onChange={e => setTopic(e.target.value)}>
          <option value="python">Python</option>
          <option value="sql">SQL</option>
          <option value="javascript">JavaScript</option>
          <option value="data structures">Data Structures</option>
          <option value="os concepts">OS Concepts</option>
        </select>
        <button className="btn btn-gold-sm" onClick={startSession} disabled={loading}>
          {loading ? '⏳ Starting...' : '🎙️ Start Voice Interview'}
        </button>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────
   COMMUNICATION
────────────────────────────────────────── */
function CommunicationPage({ onScore }) {
  const [tab, setTab] = useState(0);
  return (
    <>
      <div className="page-header"><div className="page-title">🗣️ Communication Evaluator</div></div>
      <div className="tab-row">
        {['✍️ Writing Evaluation', '🎤 Speaking Evaluator'].map((t, i) => (
          <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>
      {tab === 0 ? <WritingTab onScore={onScore} /> : <SpeakingTab onScore={onScore} />}
    </>
  );
}

function WritingTab({ onScore }) {
  const PROMPTS = ['Introduce yourself', 'Your dream career', 'A project you built', 'Why you chose CS', 'Your strengths'];
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const r = scoreWriting(text);
      if (onScore) onScore(r.communication_score);
      setResult(r);
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <div className="info-box teal">📝 Pick a topic and write 4–6 sentences about it.</div>
      <div className="chip-row">
        {PROMPTS.map(p => (
          <span key={p} className="chip"
            style={{ background: prompt === p ? '#4a2a8b' : '#f0edfb', color: prompt === p ? 'white' : '#4a2a8b', border: `1.5px solid ${prompt === p ? '#4a2a8b' : '#c0b0e8'}` }}
            onClick={() => setPrompt(p)}>{p}</span>
        ))}
      </div>
      <textarea className="app-textarea" style={{ height: 180, marginBottom: 8 }} value={text} onChange={e => setText(e.target.value)}
        placeholder="Write your paragraph here... (4–6 sentences recommended)" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: 'var(--ink-muted)' }}>
        <span>{text.split(' ').filter(w => w).length} words</span>
        <button style={{ background: 'none', border: 'none', color: '#c06a00', cursor: 'pointer', fontSize: 13 }} onClick={() => { setText(''); setResult(null); }}>🗑️ Clear</button>
      </div>
      <button className="btn btn-violet" onClick={analyze} disabled={loading}>{loading ? '⏳ Evaluating...' : '📊 Evaluate Writing'}</button>

      {result && (
        <div style={{ marginTop: 18 }}>
          <div className={`score-box ${scoreClass(result.communication_score ?? 0)}`}>
            <div className="score-num">{result.communication_score ?? 'N/A'}</div>
            <div className="score-label">Writing Score</div>
          </div>
          <div className="stat-grid-2">
            {[['📖 Clarity', result.clarity], ['📝 Grammar', result.grammar], ['💬 Vocabulary', result.vocabulary], ['📐 Structure', result.structure]].map(([l, v]) => (
              <div key={l} className="stat-card"><div className="stat-val" style={{ color: 'var(--violet)' }}>{v ?? 'N/A'}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>
          {result.feedback && <div className="feedback-box" style={{ background: '#ede7f6', border: '1px solid #c0b0e8' }}><strong>💬 Feedback</strong><p>{result.feedback}</p></div>}
          <details><summary>Raw API response</summary><pre>{JSON.stringify(result, null, 2)}</pre></details>
        </div>
      )}
    </div>
  );
}

function SpeakingTab({ onScore }) {
  const PROMPTS = ['Tell me about yourself', 'Why should we hire you?', 'Describe a challenging project', 'What are your strengths?', 'Where do you see yourself in 5 years?'];
  const [activePrompt, setActivePrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speakText, setSpeakText] = useState('');
  const [speakResult, setSpeakResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recStatus, setRecStatus] = useState('Press 🎙️ to start recording');
  const [micBlocked, setMicBlocked] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        setRecStatus('✅ Recording saved. Transcribing...');
        setSpeakText('[Voice recorded — please type your spoken answer in Manual Mode for AI analysis]');
        setShowManual(true);
      };
      mr.start();
      mediaRef.current = mr;
      setIsRecording(true);
      setRecStatus('🔴 Recording...');
    } catch {
      setMicBlocked(true);
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream?.getTracks().forEach(t => t.stop());
    setIsRecording(false);
  };

  const analyze = () => {
    if (!speakText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const sr = scoreSpeaking(speakText);
      if (onScore) onScore(sr.communication_score);
      setSpeakResult(sr);
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <div className="info-box" style={{ background: '#fce4ec', border: '1px solid #f48fb1', color: '#ad1457' }}>🎤 Press Start Recording, speak your answer, then Stop. AI will evaluate your speech!</div>
      <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 7 }}>📌 Pick an interview question:</p>
      <div className="chip-row">
        {PROMPTS.map(p => (
          <span key={p} className="chip"
            style={{ background: activePrompt === p ? '#880e4f' : '#fce4ec', color: activePrompt === p ? 'white' : '#ad1457', border: `1.5px solid ${activePrompt === p ? '#880e4f' : '#f48fb1'}` }}
            onClick={() => { setActivePrompt(p); setSpeakText(''); setSpeakResult(null); }}>{p}</span>
        ))}
      </div>
      {activePrompt && <div className="info-box" style={{ background: '#880e4f', color: 'white', border: 'none' }}>❓ <strong>Question:</strong> {activePrompt}</div>}

      <div className="record-zone">
        <div className="rec-icon">{isRecording ? '🔴' : '🎙️'}</div>
        <div className="rec-status" style={{ color: isRecording ? '#c62828' : '#ad1457' }}>{isRecording ? '🔴 Recording... Speak now!' : recStatus}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {!isRecording
            ? <button className="btn btn-rose" onClick={startRecording}>🎙️ Start Recording</button>
            : <button className="btn" style={{ background: '#c62828', color: 'white' }} onClick={stopRecording}>⏹️ Stop Recording</button>}
        </div>
        {isRecording && (
          <div className="wave-bars">
            {[1,2,3,4,5,4,3,2,1].map((h, i) => <div key={i} className="wave-bar" style={{ height: h * 8 }} />)}
          </div>
        )}
      </div>

      {micBlocked && (
        <div className="mic-blocked-box">
          <p style={{ fontWeight: 700, color: 'var(--warn)', marginBottom: 8 }}>🔒 Microphone Blocked!</p>
          <p style={{ fontSize: 13, marginBottom: 8 }}>Allow microphone access in browser settings, then refresh. Or use manual mode:</p>
          <button className="btn btn-warn" onClick={() => { setShowManual(true); setMicBlocked(false); }}>✏️ Switch to Manual Mode</button>
        </div>
      )}

      {showManual && (
        <div style={{ marginBottom: 14 }}>
          <div className="info-box" style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32' }}>✏️ Manual Mode — Type your spoken answer below.</div>
          <textarea className="app-textarea" style={{ height: 150 }} value={speakText} onChange={e => setSpeakText(e.target.value)}
            placeholder="Type your spoken answer as you would say it..." />
          <button style={{ fontSize: 12, color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }} onClick={() => setShowManual(false)}>← Back to Voice Mode</button>
        </div>
      )}

      {speakText && !showManual && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ color: '#ad1457', fontWeight: 700, marginBottom: 6, fontSize: 13 }}>📝 Transcribed Speech:</p>
          <div style={{ background: '#f9f9f9', border: '1.5px solid #ad1457', borderRadius: 8, padding: 12, fontSize: 14 }}>{speakText}</div>
        </div>
      )}

      {speakText && !speakResult && (
        <button className="btn btn-rose" onClick={analyze} disabled={loading}>{loading ? '⏳ Evaluating...' : '📊 Evaluate My Speech'}</button>
      )}

      {speakResult && (
        <div style={{ marginTop: 16 }}>
          <div className={`score-box ${scoreClass(speakResult.communication_score ?? 0)}`}>
            <div className="score-num">{speakResult.communication_score ?? 'N/A'}</div>
            <div className="score-label">Speaking Score</div>
            <div className="score-emoji">{scoreEmoji(speakResult.communication_score ?? 0)}</div>
          </div>
          <div className="stat-grid-3">
            {[['📝 Word Count', speakResult.wordCount, speakResult.wordCount >= 50], ['📐 Sentences', speakResult.sentenceCount, speakResult.sentenceCount >= 4], ['⚠️ Filler Words', speakResult.fillerWords, speakResult.fillerWords === 0], ['📏 Avg Words/Sent', speakResult.avgWordsPerSentence, speakResult.avgWordsPerSentence >= 8 && speakResult.avgWordsPerSentence <= 20], ['📖 Clarity', speakResult.clarity ?? 'N/A', true], ['💬 Vocabulary', speakResult.vocabulary ?? 'N/A', true]].map(([l, v, ok]) => (
              <div key={l} className="stat-card" style={{ background: ok ? '#e8f5e9' : '#fff3e0', border: `1px solid ${ok ? '#a5d6a7' : '#ffcc80'}` }}>
                <div className="stat-val" style={{ color: ok ? '#2e7d32' : '#e65100' }}>{v}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
          {speakResult.feedback && <div className="feedback-box" style={{ background: '#fce4ec', border: '1px solid #f48fb1' }}><strong>💬 AI Feedback</strong><p>{speakResult.feedback}</p></div>}
          <div className="tips-box">
            <div className="tips-title" style={{ color: '#ad1457' }}>🎯 Speaking Tips</div>
            {['Speak in short, clear sentences (10–15 words)', 'Start with a confident opening statement', 'Use the STAR method for experience questions', 'Pause after key points — silence shows confidence', 'Avoid starting every sentence with "So" or "Basically"'].map((t, i) => <div key={i} className="tips-item">✅ {t}</div>)}
          </div>
          <button className="btn btn-rose" onClick={() => { setSpeakText(''); setSpeakResult(null); }}>🔄 Try Again</button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   BEHAVIORAL
────────────────────────────────────────── */
function BehavioralPage({ onScore }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const OPTS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  const OPT_VAL = { 'Strongly Disagree': 20, 'Disagree': 40, 'Neutral': 60, 'Agree': 80, 'Strongly Agree': 100 };

  const submit = () => {
    const traits = {};
    BEHAVIORAL_QUESTIONS.forEach(q => {
      if (!traits[q.trait]) traits[q.trait] = [];
      traits[q.trait].push(OPT_VAL[answers[q.id]] ?? 60);
    });
    const traitScores = {};
    Object.entries(traits).forEach(([t, vals]) => { traitScores[t] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length); });
    const overall = Math.round(Object.values(traitScores).reduce((a, b) => a + b, 0) / Object.values(traitScores).length);
    if (onScore) onScore(overall);
    setResult({ overall, traitScores });
  };

  if (result) return (
    <>
      <div className="page-header"><div className="page-title">🧠 Behavioral Results</div></div>
      <div className={`score-box ${scoreClass(result.overall)}`}>
        <div className="score-num">{result.overall}%</div>
        <div className="score-label">Overall Behavioral Score</div>
        <div className="score-emoji">{scoreEmoji(result.overall)}</div>
      </div>
      <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>📊 Big-5 Personality Traits</div>
        {Object.entries(result.traitScores).map(([trait, score]) => (
          <div key={trait} className="trait-row">
            <div className="trait-head">
              <span className="trait-name">{trait}</span>
              <span className="trait-val" style={{ color: traitColor(score) }}>{score}%</span>
            </div>
            <div className="trait-bar-bg">
              <div className="trait-bar-fill" style={{ width: `${score}%`, background: traitColor(score) }} />
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-teal" onClick={() => { setAnswers({}); setResult(null); }}>🔄 Retake</button>
    </>
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">🧠 Behavioral Assessment</div>
        <div className="page-sub">Rate each statement honestly — no right or wrong answers!</div>
      </div>
      <div className="info-box teal">💡 Your responses reveal personality traits valued by employers.</div>
      {BEHAVIORAL_QUESTIONS.map((q, i) => (
        <div key={q.id} className="q-card">
          <div className="q-num">Q{i + 1} · {q.trait}</div>
          <div className="q-text">{q.question}</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {OPTS.map(opt => (
              <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                style={{ padding: '6px 12px', fontSize: 12, borderRadius: 7, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: answers[q.id] === opt ? 700 : 500, background: answers[q.id] === opt ? 'var(--teal)' : 'var(--surface)', color: answers[q.id] === opt ? 'white' : 'var(--ink-soft)', border: answers[q.id] === opt ? '2px solid var(--teal)' : '1.5px solid var(--border)', transition: 'all 0.14s' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="q-count">{Object.keys(answers).length}/{BEHAVIORAL_QUESTIONS.length} answered</div>
      <button className="btn btn-teal" onClick={submit}>🧠 Get Personality Results</button>
    </>
  );
}

/* ──────────────────────────────────────────
   COGNITIVE
────────────────────────────────────────── */
function CognitivePage({ onScore }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const submit = () => {
    let correct = 0;
    COGNITIVE_QUESTIONS.forEach(q => { if (answers[q.id] === q.answer) correct++; });
    const pct = Math.round((correct / COGNITIVE_QUESTIONS.length) * 100);
    if (onScore) onScore(pct);
    setResult({ correct, total: COGNITIVE_QUESTIONS.length, percentage: pct });
  };

  if (result) return (
    <>
      <div className="page-header"><div className="page-title">🔍 Cognitive Results</div></div>
      <div className={`score-box ${scoreClass(result.percentage)}`}>
        <div className="score-num">{result.percentage}%</div>
        <div className="score-label">{result.correct} / {result.total} Correct</div>
        <div className="score-emoji">{scoreEmoji(result.percentage)}</div>
      </div>
      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📋 Answer Review</div>
      {COGNITIVE_QUESTIONS.map((q, i) => {
        const ok = answers[q.id] === q.answer;
        return (
          <div key={q.id} className={`review-row ${ok ? 'correct' : 'wrong'}`}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{i + 1}. {q.question}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Your: <strong style={{ color: ok ? '#2e7d32' : '#c62828' }}>{answers[q.id] || '—'}</strong>
              {!ok && <span style={{ color: '#2e7d32', marginLeft: 10 }}>✅ Correct: {q.answer}</span>}
              {ok && <span style={{ color: '#2e7d32', marginLeft: 10 }}>✅ Correct!</span>}
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="btn btn-rose" onClick={() => { setAnswers({}); setResult(null); }}>🔄 Retake</button>
      </div>
    </>
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">🔍 Cognitive Reasoning Test</div>
        <div className="page-sub">8 questions — patterns, logic, and math!</div>
      </div>
      <div className="info-box warn">💡 Read each question carefully. Choose the best answer.</div>
      {COGNITIVE_QUESTIONS.map((q, i) => (
        <div key={q.id} className="q-card">
          <div className="q-num">#{i + 1} — {q.category}</div>
          <div className="q-text">{q.question}</div>
          {q.options.map(opt => (
            <label key={opt} className={`q-option ${answers[q.id] === opt ? 'selected' : ''}`} onClick={() => setAnswers({ ...answers, [q.id]: opt })}
              style={answers[q.id] === opt ? { borderColor: 'var(--warn)', background: 'var(--warn-light)', color: 'var(--warn)' } : {}}>
              <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => {}} />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <div className="q-count">{Object.keys(answers).length}/{COGNITIVE_QUESTIONS.length} answered</div>
      <button className="btn btn-warn" onClick={submit}>🔍 Submit &amp; See Results</button>
    </>
  );
}

/* ──────────────────────────────────────────
   RESUME
────────────────────────────────────────── */
function ResumePage({ onScore }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const r = scoreResume(text);
      if (onScore) onScore(r.resume_score);
      setResult(r);
      setLoading(false);
    }, 1000);
  };

  const scoreColor = (s) => s >= 75 ? '#2e7d32' : s >= 50 ? '#b07800' : '#b71c1c';
  const scoreBg    = (s) => s >= 75 ? '#eef8ee' : s >= 50 ? '#fff9e6' : '#ffeaea';
  const scoreBar   = (s) => s >= 75 ? '#4caf50' : s >= 50 ? '#ffc107' : '#f44336';

  return (
    <>
      <div className="page-header">
        <div className="page-title">📄 Resume Analyzer</div>
        <div className="page-sub">Paste your resume text for a full professional analysis.</div>
      </div>

      {!result ? (
        <>
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--olive)' }}>📋 What gets analyzed:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {['📌 Section completeness','🛠️ Technical skills','🎯 ATS keywords','📏 Resume length','🎓 Education level','💼 Experience depth'].map(item => (
                <div key={item} style={{ background: 'var(--surface)', borderRadius: 8, padding: '8px 12px', fontSize: 12.5, color: 'var(--ink-soft)', border: '1px solid var(--border)' }}>{item}</div>
              ))}
            </div>
          </div>
          <textarea className="app-textarea" style={{ height: 260, marginBottom: 12 }}
            value={text} onChange={e => setText(e.target.value)}
            placeholder={"Paste your full resume text here...\n\nInclude:\n• Contact info (name, email, phone, LinkedIn)\n• Professional summary\n• Education details\n• Work experience / internships\n• Projects\n• Technical skills\n• Certifications"} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>{text.split(' ').filter(w=>w).length} words</span>
            <button style={{ fontSize: 12, color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setText('')}>🗑️ Clear</button>
          </div>
          <button className="btn btn-olive" onClick={analyze} disabled={loading || !text.trim()}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </>
      ) : (
        <div>
          {/* ── HEADER CARD ── */}
          <div style={{ background: 'var(--ink)', color: 'white', borderRadius: 16, padding: '24px 28px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: scoreBg(result.resume_score), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: scoreColor(result.resume_score) }}>{result.resume_score}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 3 }}>{result.candidateName}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{result.eduLevel} · {result.expYears} · {result.skills_count} skills detected</div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${result.resume_score}%`, background: scoreBar(result.resume_score), height: '100%', borderRadius: 8, transition: 'width 1s ease' }} />
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 5 }}>{result.feedback}</div>
            </div>
            <button onClick={() => setResult(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans,sans-serif' }}>✏️ Edit</button>
          </div>

          {/* ── SCORE BREAKDOWN ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            {/* Section Completeness */}
            <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--ink)' }}>📋 Section Completeness</div>
              {Object.entries(result.sectionScores).map(([sec, sc]) => (
                <div key={sec} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ color: sc > 0 ? 'var(--ink-soft)' : 'var(--ink-muted)' }}>{sc > 0 ? '✅' : '❌'} {sec}</span>
                    <span style={{ fontWeight: 700, color: sc > 0 ? '#2e7d32' : '#c62828', fontSize: 12 }}>{sc > 0 ? 'Present' : 'Missing'}</span>
                  </div>
                  <div style={{ background: '#eee', borderRadius: 4, height: 5 }}>
                    <div style={{ width: `${sc}%`, background: sc > 0 ? '#4caf50' : '#eee', height: '100%', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Score Metrics */}
            <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--ink)' }}>📊 Quality Metrics</div>
              {[
                { label: 'Completeness', val: result.completeness, icon: '📋' },
                { label: 'Skill Depth',  val: result.skillScore,   icon: '🛠️' },
                { label: 'ATS Score',    val: result.atsScore,     icon: '🎯' },
                { label: 'Length Score', val: result.lengthScore,  icon: '📏' },
              ].map(m => (
                <div key={m.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span>{m.icon} {m.label}</span>
                    <span style={{ fontWeight: 700, color: scoreColor(m.val) }}>{m.val}%</span>
                  </div>
                  <div style={{ background: '#eee', borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${m.val}%`, background: scoreBar(m.val), height: '100%', borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--ink-muted)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                📝 Word count: <strong style={{ color: 'var(--ink)' }}>{result.wordCount}</strong>
                <span style={{ marginLeft: 8, color: result.wordCount >= 200 && result.wordCount <= 700 ? '#2e7d32' : '#b07800' }}>
                  {result.wordCount < 200 ? '(too short)' : result.wordCount > 700 ? '(too long)' : '(ideal)'}
                </span>
              </div>
            </div>
          </div>

          {/* ── SKILLS BY CATEGORY ── */}
          {Object.keys(result.foundByCategory).length > 0 && (
            <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🛠️ Skills Detected by Category</div>
              {Object.entries(result.foundByCategory).map(([cat, skills]) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>{cat}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {skills.map(s => (
                      <span key={s} style={{ background: 'var(--olive-light)', color: 'var(--olive)', border: '1px solid #b0d090', padding: '3px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, textTransform: 'capitalize' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── ATS KEYWORDS ── */}
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>🎯 ATS Action Keywords</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-muted)', marginBottom: 12 }}>These power words improve ATS (Applicant Tracking System) ranking</div>
            {result.atsFound.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {result.atsFound.map(k => (
                  <span key={k} style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', padding: '3px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600 }}>✓ {k}</span>
                ))}
              </div>
            ) : <div style={{ fontSize: 13, color: 'var(--ink-muted)', fontStyle: 'italic' }}>No action keywords detected — add words like "led", "built", "improved", "reduced"</div>}
          </div>

          {/* ── STRENGTHS & IMPROVEMENTS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div style={{ background: '#eef8ee', border: '1.5px solid #a5d6a7', borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#2e7d32', marginBottom: 12 }}>✅ Strengths</div>
              {result.strengths.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#2e7d32', fontWeight: 700, marginTop: 1 }}>+</span>
                  <span style={{ color: 'var(--ink-soft)' }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff9e6', border: '1.5px solid #f0c060', borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#b07800', marginBottom: 12 }}>📌 Improvements</div>
              {result.improvements.map((imp, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#b07800', fontWeight: 700, marginTop: 1 }}>→</span>
                  <span style={{ color: 'var(--ink-soft)' }}>{imp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── PRO TIPS ── */}
          <div style={{ background: 'var(--ink)', color: 'white', borderRadius: 14, padding: 20, marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 Pro Resume Tips</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Keep it 1 page', 'Recruiters spend ~6 seconds on a resume'],
                ['Use bullet points', 'Start each point with a strong action verb'],
                ['Quantify results', '"Improved speed by 40%" beats "improved speed"'],
                ['Tailor for each job', 'Match keywords from the job description'],
                ['Clean formatting', 'No tables or columns — ATS cannot parse them'],
                ['Save as PDF', 'Preserves formatting across all devices'],
              ].map(([title, desc]) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-olive" onClick={() => { setResult(null); setText(''); }}>🔄 Analyze Another Resume</button>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────
   VIDEO AI
────────────────────────────────────────── */
function VideoPage({ onScore }) {
  const INTERVIEW_QUESTIONS = [
    { q: 'Tell me about yourself and your background.', tip: 'Look at the camera. Speak clearly and confidently.' },
    { q: 'What are your greatest strengths?', tip: 'Sit straight. Use specific examples.' },
    { q: 'Why do you want to work in this field?', tip: 'Show enthusiasm. Maintain eye contact.' },
    { q: 'Describe a challenging situation and how you handled it.', tip: 'Use the STAR method. Stay calm and composed.' },
    { q: 'Where do you see yourself in 5 years?', tip: 'Smile naturally. Be confident and clear.' },
  ];

  const videoRef   = useRef(null);
  const timerRef   = useRef(null);
  const streamRef  = useRef(null);
  const [phase, setPhase]         = useState('setup');   // setup | interview | result
  const [camStarted, setCamStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOn, setVoiceOn]     = useState(true);
  const [qIndex, setQIndex]       = useState(0);
  const [timeLeft, setTimeLeft]   = useState(60);
  const [answers, setAnswers]     = useState([]);        // {q, spokenAnswer, score, tip}
  const [status, setStatus]       = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState('');

  // Preload voices
  useEffect(() => {
    window.speechSynthesis?.getVoices();
    window.speechSynthesis && (window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices());
    return () => { stopEverything(); };
  }, []);

  // Reattach stream to video element whenever phase changes (fixes blank camera on interview screen)
  useEffect(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  const stopEverything = () => {
    stopSpeaking();
    clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  /* ── Camera ── */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamStarted(true);
    } catch {
      alert('Camera/microphone access denied. Please use http://localhost:3001');
    }
  };

  /* ── Start Interview ── */
  const startInterview = () => {
    if (!camStarted) { alert('Please start the camera first!'); return; }
    setPhase('interview');
    setQIndex(0);
    setAnswers([]);
    askQuestion(0);
  };

  /* ── Ask Question by voice ── */
  const askQuestion = (idx) => {
    if (idx >= INTERVIEW_QUESTIONS.length) { endInterview(); return; }
    const { q, tip } = INTERVIEW_QUESTIONS[idx];
    setQIndex(idx);
    setTranscript('');
    setTimeLeft(60);
    setStatus('🔊 AI is asking the question...');
    clearInterval(timerRef.current);

    const intro = idx === 0
      ? `Hello! Welcome to your video interview. I will ask you ${INTERVIEW_QUESTIONS.length} questions. Look at the camera and answer confidently. Here is question ${idx + 1}. ${q}`
      : `Question ${idx + 1}. ${q}`;

    if (voiceOn) {
      setIsSpeaking(true);
      speak(intro, () => {
        setIsSpeaking(false);
        setStatus(`💡 Tip: ${tip}`);
        startListening(idx);
        startTimer(idx);
      });
    } else {
      setStatus(`💡 Tip: ${tip}`);
      startListening(idx);
      startTimer(idx);
    }
  };

  /* ── Speech Recognition ── */
  const startListening = (idx) => {
    setIsRecording(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setTranscript(''); return; }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(' ');
      setTranscript(t);
    };
    rec.onerror = () => {};
    rec.start();
    recognitionRef.current = rec;
  };

  /* ── Timer countdown (60s per question) ── */
  const startTimer = (idx) => {
    let t = 60;
    setTimeLeft(t);
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) { clearInterval(timerRef.current); submitAnswer(idx); }
    }, 1000);
  };

  /* ── Submit Answer ── */
  const submitAnswer = (idx) => {
    clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    setIsRecording(false);
    const spokenAnswer = transcript || '(No answer recorded)';
    const words = spokenAnswer.split(' ').filter(w => w).length;
    const score = Math.min(100, Math.round(
      40 + Math.min(words * 1.2, 30) +
      (spokenAnswer.length > 20 ? 15 : 0) +
      Math.floor(Math.random() * 15)
    ));
    const newAnswer = { q: INTERVIEW_QUESTIONS[idx].q, spokenAnswer, score, tip: INTERVIEW_QUESTIONS[idx].tip };
    setAnswers(prev => {
      const updated = [...prev, newAnswer];
      const nextIdx = idx + 1;
      if (nextIdx >= INTERVIEW_QUESTIONS.length) {
        setTimeout(() => endInterviewWithAnswers(updated), 500);
      } else {
        const transMsg = `Good answer! Moving to question ${nextIdx + 1}.`;
        if (voiceOn) {
          setIsSpeaking(true);
          setStatus('Moving to next question...');
          speak(transMsg, () => { setIsSpeaking(false); askQuestion(nextIdx); });
        } else {
          setTimeout(() => askQuestion(nextIdx), 600);
        }
      }
      return updated;
    });
  };

  /* ── End Interview ── */
  const endInterview = () => setPhase('result');
  const endInterviewWithAnswers = (finalAnswers) => {
    stopSpeaking();
    stopEverything();
    setCamStarted(false);
    const avg = Math.round(finalAnswers.reduce((s, a) => s + a.score, 0) / finalAnswers.length);
    if (onScore) onScore(avg);
    if (voiceOn) {
      speak(`Interview complete! Your overall score is ${avg} percent. Great effort!`);
    }
    setPhase('result');
  };

  /* ── RESULT SCREEN ── */
  if (phase === 'result') {
    const avg = answers.length > 0 ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length) : 0;
    return (
      <>
        <div className="page-header">
          <div className="page-title">🎥 Video Interview Results</div>
          <div className="page-sub">AI Video Interview Complete</div>
        </div>
        <div className={`score-box ${scoreClass(avg)}`}>
          <div className="score-num">{avg}%</div>
          <div className="score-label">Overall Interview Score</div>
          <div className="score-emoji">{scoreEmoji(avg)}</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📋 Question Review</div>
        {answers.map((a, i) => (
          <div key={i} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--violet)', marginBottom: 6 }}>Q{i+1}: {a.q}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', background: 'var(--surface)', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontStyle: 'italic' }}>
              "{a.spokenAnswer}"
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontWeight: 700, color: traitColor(a.score), fontSize: 18 }}>{a.score}%</div>
              <div style={{ flex: 1, background: '#eee', borderRadius: 6, height: 8 }}>
                <div style={{ width: `${a.score}%`, background: traitColor(a.score), height: '100%', borderRadius: 6 }} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 6 }}>💡 {a.tip}</div>
          </div>
        ))}
        <div className="tips-box" style={{ marginTop: 8 }}>
          <div className="tips-title" style={{ color: 'var(--violet)' }}>🎯 Interview Tips</div>
          {['Always look directly at the camera lens — not the screen','Sit straight with shoulders back to project confidence','Pause briefly before answering to collect your thoughts','Speak slowly and clearly — avoid rushing','Use specific examples from your experience'].map((t, i) => (
            <div key={i} className="tips-item">✅ {t}</div>
          ))}
        </div>
        <button className="btn btn-violet" onClick={() => { setPhase('setup'); setAnswers([]); setTranscript(''); }}>🔄 Try Again</button>
      </>
    );
  }

  /* ── INTERVIEW SCREEN ── */
  if (phase === 'interview') {
    const currentQ = INTERVIEW_QUESTIONS[qIndex];
    const progress = Math.round((qIndex / INTERVIEW_QUESTIONS.length) * 100);
    return (
      <>
        <div className="page-header">
          <div className="page-title">🎥 Video Interview</div>
          <div className="page-sub" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            Question {qIndex + 1} of {INTERVIEW_QUESTIONS.length}
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {isSpeaking && <span style={{ fontSize: 12, background: '#ede7f6', color: 'var(--violet)', padding: '3px 10px', borderRadius: 12, fontWeight: 600 }}>🔊 Speaking...</span>}
              <button onClick={() => { setVoiceOn(v => !v); if (isSpeaking) stopSpeaking(); }}
                style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: voiceOn ? 'var(--violet)' : 'var(--surface)', color: voiceOn ? 'white' : 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 600 }}>
                {voiceOn ? '🔊 Voice ON' : '🔇 Voice OFF'}
              </button>
            </span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: 'var(--border)', borderRadius: 8, height: 8, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: 'var(--violet)', height: '100%', borderRadius: 8, transition: 'width 0.5s' }} />
        </div>

        {/* Camera feed */}
        <div className="video-zone" style={{ marginBottom: 14 }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxHeight: 280, display: 'block', borderRadius: 14 }} />
          <div className="live-badge">🔴 LIVE</div>
          {/* Timer badge */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: timeLeft <= 10 ? '#e53935' : 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
            ⏱ {timeLeft}s
          </div>
        </div>

        {/* Current Question */}
        <div style={{ background: 'var(--ink)', color: 'white', borderRadius: 12, padding: '16px 20px', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            Question {qIndex + 1} of {INTERVIEW_QUESTIONS.length}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{currentQ.q}</div>
        </div>

        {/* Status / tip */}
        {status && (
          <div style={{ background: 'var(--violet-light)', border: '1px solid #c5b8e8', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, color: 'var(--violet)', marginBottom: 12 }}>
            {status}
          </div>
        )}

        {/* Live transcript */}
        {isRecording && (
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#e53935', borderRadius: '50%' }} />
              Live transcript
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', fontStyle: 'italic', minHeight: 40 }}>
              {transcript || 'Listening... speak your answer now'}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-violet" onClick={() => submitAnswer(qIndex)} disabled={isSpeaking}
            style={{ opacity: isSpeaking ? 0.5 : 1 }}>
            {isSpeaking ? '🔊 Wait...' : '✅ Submit Answer'}
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { stopEverything(); setCamStarted(false); setPhase('setup'); }}>✕ End</button>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </>
    );
  }

  /* ── SETUP SCREEN ── */
  return (
    <>
      <div className="page-header">
        <div className="page-title">🎥 Video AI Interview</div>
        <div className="page-sub">AI asks interview questions by voice while your camera is on. Answer each question in 60 seconds!</div>
      </div>

      {/* Camera preview */}
      <div className="video-zone" style={{ marginBottom: 14 }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ display: camStarted ? 'block' : 'none', width: '100%', maxHeight: 280, borderRadius: 14 }} />
        {!camStarted && <div style={{ textAlign: 'center', color: '#888' }}><div style={{ fontSize: 48 }}>📷</div><div>Camera off — click Start Camera</div></div>}
        {camStarted && <div className="live-badge">✅ Ready</div>}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {!camStarted
          ? <button className="btn btn-violet" onClick={startCamera}>📷 Start Camera</button>
          : <button className="btn btn-teal" onClick={startInterview}>🎙️ Start Video Interview</button>}
        {camStarted && <button className="btn btn-ghost" onClick={() => { stopEverything(); setCamStarted(false); }}>⏹️ Stop Camera</button>}
      </div>

      {/* How it works */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🎙️ How it works</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['📷', 'Camera stays on', 'Practice your eye contact and posture while answering'],
            ['🔊', 'AI speaks questions', 'Each question is read aloud clearly'],
            ['🎤', 'You answer verbally', 'Your speech is transcribed live on screen'],
            ['⏱️', '60 seconds each', 'Timer counts down — submit when ready'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'var(--surface)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-box teal">
        💡 <strong>5 Interview Questions:</strong> {INTERVIEW_QUESTIONS.map(q => q.q.split(' ').slice(0,4).join(' ')+'...').join(' · ')}
      </div>
    </>
  );
}

/* ──────────────────────────────────────────
   PLACEMENT PREDICTOR
────────────────────────────────────────── */
function PlacementPage({ scores }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const SCORE_ITEMS = [
    { key: 'technical',     icon: '💻', label: 'Technical',     page: 'Technical Test' },
    { key: 'communication', icon: '🗣️', label: 'Communication', page: 'Communication' },
    { key: 'behavioral',    icon: '🧠', label: 'Behavioral',    page: 'Behavioral' },
    { key: 'cognitive',     icon: '🔍', label: 'Cognitive',     page: 'Cognitive' },
    { key: 'resume',        icon: '📄', label: 'Resume',        page: 'Resume Analyzer' },
    { key: 'video',         icon: '🎥', label: 'Video AI',      page: 'Video AI' },
  ];

  const completed = SCORE_ITEMS.filter(s => scores?.[s.key] !== null && scores?.[s.key] !== undefined);
  const pending   = SCORE_ITEMS.filter(s => scores?.[s.key] === null || scores?.[s.key] === undefined);

  // Auto-predict whenever scores change and at least 1 is done
  useEffect(() => {
    if (completed.length > 0) {
      setResult(predictPlacement({
        technical:     scores?.technical     ?? 0,
        communication: scores?.communication ?? 0,
        behavioral:    scores?.behavioral    ?? 0,
        cognitive:     scores?.cognitive     ?? 0,
        resume:        scores?.resume        ?? 0,
        video:         scores?.video         ?? 0,
      }));
    }
  }, [scores]);

  const predict = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(predictPlacement({
        technical:     scores?.technical     ?? 0,
        communication: scores?.communication ?? 0,
        behavioral:    scores?.behavioral    ?? 0,
        cognitive:     scores?.cognitive     ?? 0,
        resume:        scores?.resume        ?? 0,
        video:         scores?.video         ?? 0,
      }));
      setLoading(false);
    }, 900);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">🏆 Placement Predictor</div>
        <div className="page-sub">AI evaluates all your assessment scores automatically.</div>
      </div>

      {/* Score Status Cards */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>📊 Your Assessment Scores</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {SCORE_ITEMS.map(item => {
            const val = scores?.[item.key];
            const done = val !== null && val !== undefined;
            return (
              <div key={item.key} style={{ background: done ? '#eef8ee' : 'var(--surface)', border: `1.5px solid ${done ? '#a5d6a7' : 'var(--border)'}`, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{item.label}</div>
                {done
                  ? <div style={{ fontSize: 22, fontWeight: 700, color: traitColor(val) }}>{val}%</div>
                  : <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontStyle: 'italic' }}>Not done yet</div>}
              </div>
            );
          })}
        </div>

        {pending.length > 0 && (
          <div className="info-box warn" style={{ marginBottom: 0 }}>
            ⚠️ <strong>Pending:</strong> {pending.map(p => p.page).join(', ')} — complete them for a more accurate prediction.
          </div>
        )}
      </div>

      {completed.length === 0
        ? <div className="info-box" style={{ background: '#ffebee', border: '1px solid #f5c0c0', color: 'var(--rose)' }}>
            ⚠️ Complete at least one assessment to see your placement prediction. The result will update automatically!
          </div>
        : <button className="btn btn-rose" onClick={predict} disabled={loading}>
            {loading ? '⏳ Recalculating...' : '🔄 Recalculate'}
          </button>
      }

      {result && (
        <div style={{ marginTop: 22 }}>
          <div className={`score-box ${scoreClass(result.placement_probability ?? 0)}`} style={{ border: '2px solid var(--rose)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 4 }}>🎯 Placement Probability</div>
            <div className="score-num">{result.placement_probability ?? 'N/A'}%</div>
            <div className="score-emoji">{scoreEmoji(result.placement_probability ?? 0)}</div>
            <div className="score-meta">Overall Score: <strong>{result.overall_score ?? 'N/A'}</strong></div>
          </div>

          {/* Score breakdown used */}
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>📊 Score Breakdown</div>
            {SCORE_ITEMS.filter(s => scores?.[s.key] !== null && scores?.[s.key] !== undefined).map(item => (
              <div key={item.key} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{item.icon} {item.label}</span>
                  <span style={{ fontWeight: 700, color: traitColor(scores[item.key]) }}>{scores[item.key]}%</span>
                </div>
                <div style={{ background: '#eee', borderRadius: 6, height: 7 }}>
                  <div style={{ width: `${scores[item.key]}%`, background: traitColor(scores[item.key]), height: '100%', borderRadius: 6 }} />
                </div>
              </div>
            ))}
            {result?.academic_estimate && <div style={{ fontSize: 13, marginTop: 8, color: 'var(--ink-muted)' }}>🎓 Academic Score (estimated): <strong style={{ color: 'var(--ink)' }}>{result.academic_estimate}%</strong></div>}
          </div>

          {result.suitable_roles?.length > 0 && (
            <div className="feedback-box" style={{ background: '#eef8ee', border: '1px solid #a5d6a7' }}>
              <strong>✅ Suitable Job Roles</strong>
              <div className="role-chips" style={{ marginTop: 8 }}>
                {result.suitable_roles.map(r => <span key={r} className="role-chip" style={{ background: 'var(--olive)' }}>{r}</span>)}
              </div>
            </div>
          )}

          {result.skill_gaps?.length > 0 && (
            <div className="feedback-box" style={{ background: 'var(--warn-light)', border: '1px solid #f0c060' }}>
              <strong>⚠️ Skills to Improve</strong>
              <div className="role-chips" style={{ marginTop: 8 }}>
                {result.skill_gaps.map(g => <span key={g} className="role-chip" style={{ background: 'var(--warn)' }}>{g}</span>)}
              </div>
            </div>
          )}

          {result.recommendation && (
            <div className="feedback-box" style={{ background: '#f0edfb', border: '1px solid #c0b0e8' }}>
              <strong>💡 AI Recommendation</strong>
              <p>{result.recommendation}</p>
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-muted)', fontStyle: 'italic' }}>✨ Results update automatically as you complete more assessments.</div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────
   EMPLOYER OUTREACH PAGE
────────────────────────────────────────── */
function OutreachPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState({});
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);
  const [surveyTemplate, setSurveyTemplate] = useState({});
  const [selectedEmployers, setSelectedEmployers] = useState([]);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    employer_id: '',
    meeting_type: 'demo',
    preferred_date: '',
    notes: ''
  });
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [linkedinProspects, setLinkedinProspects] = useState([]);
  const [linkedinAuthStatus, setLinkedinAuthStatus] = useState(null);
  const [linkedinCampaigns, setLinkedinCampaigns] = useState([]);
  const [linkedinTemplates, setLinkedinTemplates] = useState({});
  const [showProspectSearch, setShowProspectSearch] = useState(false);
  const [prospectSearchCriteria, setProspectSearchCriteria] = useState({
    keywords: 'CHRO OR Head of Talent OR HR Director',
    company_size: '51-200',
    industries: ['Information Technology', 'Software Development'],
    locations: ['India', 'United States'],
    seniority_level: 'Director',
    limit: 50
  });

  useEffect(() => {
    loadEmployers();
    loadMetrics();
  }, []);

  const loadEmployers = async () => {
    try {
      const response = await fetch('http://localhost:8001/employers');
      const data = await response.json();
      setEmployers(data);
    } catch (error) {
      console.error('Failed to load employers:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8001/employers/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'prospects', label: 'Prospects', icon: '🎯' },
    { id: 'linkedin-automation', label: 'LinkedIn Automation', icon: '💼' },
    { id: 'outreach', label: 'Outreach', icon: '📤' },
    { id: 'email-automation', label: 'Email Automation', icon: '📧' },
    { id: 'surveys', label: 'Surveys', icon: '📝' },
    { id: 'survey-builder', label: 'Survey Builder', icon: '📋' },
    { id: 'meetings', label: 'Meetings', icon: '🤝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">🤝 Employer Outreach Management</div>
        <div className="page-sub">LinkedIn outreach workflow for 2000+ employers</div>
      </div>

      {/* Workflow Steps */}
      <div className="how-box">
        <div className="how-title">🔄 Outreach Workflow</div>
        <div className="how-grid">
          <div className="how-item">
            <div className="how-item-title">1. Target Strategy</div>
            <div className="how-item-desc">Define ICP: CHRO, Head of Talent, HR Director. Industries: IT Services, GCCs, Startups. Size: 200+ employees.</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">2. Prospect Discovery</div>
            <div className="how-item-desc">LinkedIn Sales Navigator → Phantombuster/TexAu/Evaboot → CSV export → 2000 contacts.</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">3. Data Structuring</div>
            <div className="how-item-desc">Import to Airtable/HubSpot/Notion → Clean duplicates → Add tags (industry, priority, status).</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">4. Segmentation</div>
            <div className="how-item-desc">Group by: IT Services, Product Companies, Startups, GCCs.</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">5. Outreach Automation</div>
            <div className="how-item-desc">Expandi/Dripify/Zopto → 20-30 connections/day → Automated follow-ups.</div>
          </div>
          <div className="how-item span2">
            <div className="how-item-title">6. Messaging Workflow</div>
            <div className="how-item-desc">Connection request → Survey message → Value message → Partnership pitch. Follow-up every 2-3 days.</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">7. Survey Collection</div>
            <div className="how-item-desc">Google Forms/Typeform → Collect responses → Generate skill gap insights.</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">8. Engagement Qualification</div>
            <div className="how-item-desc">Classify: Hot/Warm/Cold → Prioritize high-interest employers.</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">9. Meeting & Conversion</div>
            <div className="how-item-desc">Calendly scheduling → Demos/discussions → Convert to partnerships.</div>
          </div>
          <div className="how-item">
            <div className="how-item-title">10. Analytics & Optimization</div>
            <div className="how-item-desc">Track metrics → Google Sheets/Excel/Tableau → Continuous optimization.</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <div className="info-box teal">
            🎯 <strong>Target:</strong> 2000 prospects → 600-700 connections → 150 responses → 40 meetings → 10-15 partnerships
          </div>

          {metrics && (
            <div className="stat-grid-3">
              <div className="stat-card">
                <div className="stat-val">{employers.length}</div>
                <div className="stat-lbl">Total Prospects</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{metrics.by_status?.connected || 0}</div>
                <div className="stat-lbl">Connected</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{metrics.meetings || 0}</div>
                <div className="stat-lbl">Meetings</div>
              </div>
            </div>
          )}

          <div className="home-grid">
            <div className="home-card c-teal">
              <div className="hc-icon">🎯</div>
              <div className="hc-title">Define Target Strategy</div>
              <div className="hc-desc">Set up your Ideal Customer Profile and targeting criteria.</div>
              <div className="hc-cta c-teal">Configure ICP</div>
            </div>
            <div className="home-card c-violet">
              <div className="hc-icon">�</div>
              <div className="hc-title">LinkedIn Automation</div>
              <div className="hc-desc">Automated prospect discovery and connection requests via Sales Navigator.</div>
              <button
                className="hc-cta c-violet"
                onClick={() => setActiveTab('linkedin-automation')}
              >
                Start Automation
              </button>
            </div>
            <div className="home-card c-gold">
              <div className="hc-icon">📊</div>
              <div className="hc-title">Import Prospects</div>
              <div className="hc-desc">Upload CSV data from LinkedIn Sales Navigator exports.</div>
              <div className="hc-cta c-gold">Import Data</div>
            </div>
            <div className="home-card c-rose">
              <div className="hc-icon">🤖</div>
              <div className="hc-title">Setup Automation</div>
              <div className="hc-desc">Configure outreach sequences and messaging workflows.</div>
              <div className="hc-cta c-rose">Configure</div>
            </div>
            <div className="home-card c-olive">
              <div className="hc-icon">📅</div>
              <div className="hc-title">Schedule Meetings</div>
              <div className="hc-desc">Book demos and consultations with Calendly integration.</div>
              <button
                className="hc-cta c-olive"
                onClick={() => setActiveTab('meetings')}
              >
                Book Meetings
              </button>
            </div>
            <div className="home-card c-indigo">
              <div className="hc-icon">📈</div>
              <div className="hc-title">Track Performance</div>
              <div className="hc-desc">Monitor conversion rates and optimize your outreach.</div>
              <button
                className="hc-cta c-indigo"
                onClick={() => setActiveTab('analytics')}
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prospects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Prospect Database</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-violet">+ Add Prospect</button>
              <label className="btn btn-teal" style={{ cursor: 'pointer' }}>
                📊 Import CSV
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const response = await fetch('http://localhost:8001/employers/import-csv', {
                        method: 'POST',
                        body: formData
                      });
                      const result = await response.json();
                      alert(result.message + (result.errors.length > 0 ? `\nErrors: ${result.errors.join(', ')}` : ''));
                      loadEmployers(); // Refresh the list
                    } catch (error) {
                      alert('Import failed: ' + error.message);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="info-box gold" style={{ marginBottom: 16 }}>
            📤 <strong>Import Format:</strong> Upload CSV from LinkedIn Sales Navigator with columns: Company Name, First Name, Last Name, Title, Email, Profile URL, Industry, Company Size
          </div>

          {employers.length === 0 ? (
            <div className="info-box warn">
              📭 No prospects yet. Import your LinkedIn data or add manually.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {employers.slice(0, 10).map(employer => (
                <div key={employer.id} className="q-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                        {employer.contact_name} at {employer.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 8 }}>
                        {employer.role} • {employer.industry} • {employer.company_size}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className={`role-chip`} style={{ background: employer.priority === 'hot' ? 'var(--rose)' : employer.priority === 'warm' ? 'var(--gold)' : 'var(--teal)' }}>
                          {employer.priority}
                        </span>
                        <span className={`role-chip`} style={{ background: 'var(--violet)' }}>
                          {employer.status}
                        </span>
                        {employer.tags?.map(tag => (
                          <span key={tag} className={`role-chip`} style={{ background: 'var(--olive)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                        Added {new Date(employer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'outreach' && (
        <div>
          <div className="info-box gold">
            📤 <strong>Daily Limit:</strong> Send 20-30 connection requests per day to avoid LinkedIn restrictions.
          </div>

          <div className="home-grid">
            <div className="home-card c-teal">
              <div className="hc-icon">🔗</div>
              <div className="hc-title">Connection Requests</div>
              <div className="hc-desc">Send personalized connection requests to prospects.</div>
              <div className="hc-cta c-teal">Send Requests</div>
            </div>
            <div className="home-card c-violet">
              <div className="hc-icon">�</div>
              <div className="hc-title">Email Automation</div>
              <div className="hc-desc">Send automated email sequences with predefined templates.</div>
              <div className="hc-cta c-violet" onClick={() => setActiveTab('email-automation')}>Send Emails</div>
            </div>
            <div className="home-card c-rose">
              <div className="hc-icon">📅</div>
              <div className="hc-title">Schedule Follow-ups</div>
              <div className="hc-desc">Set reminders for 2-3 day follow-up intervals.</div>
              <div className="hc-cta c-rose">Schedule</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'email-automation' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Email Automation</h3>
            <button className="btn btn-ink" onClick={() => setActiveTab('outreach')}>← Back to Outreach</button>
          </div>

          <div className="info-box teal" style={{ marginBottom: 16 }}>
            📧 <strong>Email Templates:</strong> Use predefined templates for different outreach stages or create custom messages.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            {/* Template Selection */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Choose Template</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { id: 'connection_request', label: 'Connection Request', icon: '🔗' },
                  { id: 'survey', label: 'Survey Request', icon: '📝' },
                  { id: 'value_proposition', label: 'Value Proposition', icon: '💡' },
                  { id: 'meeting_request', label: 'Meeting Request', icon: '🤝' }
                ].map(template => (
                  <button
                    key={template.id}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--ink-soft)'
                    }}
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:8001/email/templates');
                        const templates = await response.json();
                        const selectedTemplate = templates[template.id];
                        setEmailTemplate({
                          ...selectedTemplate,
                          step: template.id
                        });
                      } catch (error) {
                        console.error('Failed to load template:', error);
                      }
                    }}
                  >
                    {template.icon} {template.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Composer */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Compose Email</h4>
              <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Select Recipient</label>
                  <select
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 14
                    }}
                    onChange={(e) => setSelectedEmployerId(parseInt(e.target.value))}
                  >
                    <option value="">Choose an employer...</option>
                    {employers.filter(e => e.email).map(employer => (
                      <option key={employer.id} value={employer.id}>
                        {employer.contact_name} at {employer.name} ({employer.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Subject</label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 14
                    }}
                    value={emailTemplate.subject || ''}
                    onChange={(e) => setEmailTemplate({...emailTemplate, subject: e.target.value})}
                    placeholder="Email subject line"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Message</label>
                  <textarea
                    style={{
                      width: '100%',
                      height: 200,
                      padding: '12px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 14,
                      resize: 'vertical'
                    }}
                    value={emailTemplate.message || ''}
                    onChange={(e) => setEmailTemplate({...emailTemplate, message: e.target.value})}
                    placeholder="Email message content"
                  />
                </div>

                <button
                  className="btn btn-violet"
                  disabled={!selectedEmployerId || !emailTemplate.subject || !emailTemplate.message}
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:8001/email/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          employer_id: selectedEmployerId,
                          subject: emailTemplate.subject,
                          message: emailTemplate.message,
                          step: emailTemplate.step
                        })
                      });
                      const result = await response.json();
                      alert('Email sent successfully!');
                      setEmailTemplate({});
                      setSelectedEmployerId(null);
                    } catch (error) {
                      alert('Failed to send email: ' + error.message);
                    }
                  }}
                >
                  📧 Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'surveys' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Survey Management</h3>
            <button className="btn btn-violet" onClick={() => setActiveTab('survey-builder')}>+ Create Survey</button>
          </div>

          <div className="info-box teal">
            📝 <strong>Survey Goal:</strong> Collect employer responses to understand hiring needs and skill gaps.
          </div>

          <div className="home-grid">
            <div className="home-card c-teal">
              <div className="hc-icon">📋</div>
              <div className="hc-title">Create Survey</div>
              <div className="hc-desc">Design questions about hiring challenges and skill requirements.</div>
              <div className="hc-cta c-teal" onClick={() => setActiveTab('survey-builder')}>Design Survey</div>
            </div>
            <div className="home-card c-violet">
              <div className="hc-icon">📊</div>
              <div className="hc-title">Collect Responses</div>
              <div className="hc-desc">Track survey completion and analyze responses.</div>
              <div className="hc-cta c-violet">View Responses</div>
            </div>
            <div className="home-card c-rose">
              <div className="hc-icon">🎯</div>
              <div className="hc-title">Generate Insights</div>
              <div className="hc-desc">Extract skill gap data and employer priorities.</div>
              <div className="hc-cta c-rose">Analyze</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'survey-builder' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Survey Builder</h3>
            <button className="btn btn-ink" onClick={() => setActiveTab('surveys')}>← Back to Surveys</button>
          </div>

          <div className="info-box gold" style={{ marginBottom: 16 }}>
            📋 <strong>Survey Templates:</strong> Use predefined templates or create custom surveys for employer feedback.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            {/* Template Selection */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Choose Template</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { id: 'hiring_challenges', label: 'Hiring Challenges', icon: '🎯' },
                  { id: 'skill_gaps', label: 'Skill Gap Analysis', icon: '📈' }
                ].map(template => (
                  <button
                    key={template.id}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--ink-soft)'
                    }}
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:8001/surveys/templates');
                        const templates = await response.json();
                        const selectedTemplate = templates[template.id];
                        setSurveyTemplate(selectedTemplate);
                      } catch (error) {
                        console.error('Failed to load template:', error);
                      }
                    }}
                  >
                    {template.icon} {template.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Survey Preview & Send */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Survey Preview</h4>
              <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 20 }}>
                {surveyTemplate.title ? (
                  <div>
                    <h5 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{surveyTemplate.title}</h5>
                    <p style={{ color: 'var(--ink-muted)', marginBottom: 16 }}>{surveyTemplate.description}</p>

                    <div style={{ marginBottom: 16 }}>
                      <h6 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Questions Preview:</h6>
                      {surveyTemplate.questions?.map((q, i) => (
                        <div key={i} style={{ marginBottom: 12, padding: 12, background: 'var(--surface)', borderRadius: 8 }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{i + 1}. {q.question}</div>
                          {q.type === 'multiple_choice' && (
                            <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                              Options: {q.options?.join(', ')}
                            </div>
                          )}
                          {q.type === 'rating' && (
                            <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                              Rating scale: {q.scale}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Select Recipients</label>
                      <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                        {employers.filter(e => e.email).map(employer => (
                          <label key={employer.id} style={{ display: 'block', marginBottom: 4 }}>
                            <input
                              type="checkbox"
                              value={employer.id}
                              onChange={(e) => {
                                const id = parseInt(e.target.value);
                                setSelectedEmployers(prev =>
                                  e.target.checked
                                    ? [...prev, id]
                                    : prev.filter(x => x !== id)
                                );
                              }}
                              style={{ marginRight: 8 }}
                            />
                            {employer.contact_name} at {employer.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      className="btn btn-violet"
                      disabled={!surveyTemplate.title || selectedEmployers.length === 0}
                      onClick={async () => {
                        try {
                          const response = await fetch('http://localhost:8001/surveys/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: surveyTemplate.title,
                              description: surveyTemplate.description,
                              questions: surveyTemplate.questions || [],
                              employer_ids: selectedEmployers
                            })
                          });
                          const result = await response.json();
                          alert(result.message);
                          setSurveyTemplate({});
                          setSelectedEmployers([]);
                        } catch (error) {
                          alert('Failed to create survey: ' + error.message);
                        }
                      }}
                    >
                      📤 Create & Send Survey
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: 40 }}>
                    Select a template to preview and send surveys
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'meetings' && (
        <div>
          <div className="info-box gold">
            🤝 <strong>Meeting Goal:</strong> Convert interested employers into partnerships through personalized demos and consultations.
          </div>

          <div className="home-grid">
            <div className="home-card c-teal">
              <div className="hc-icon">📅</div>
              <div className="hc-title">Schedule Meeting</div>
              <div className="hc-desc">Book meetings with interested prospects using Calendly integration.</div>
              <button
                className="hc-cta c-teal"
                onClick={() => setShowMeetingScheduler(true)}
              >
                Schedule Meeting
              </button>
            </div>
            <div className="home-card c-violet">
              <div className="hc-icon">📋</div>
              <div className="hc-title">Meeting Types</div>
              <div className="hc-desc">Choose from demo, consultation, or partnership discussion formats.</div>
              <div className="hc-cta c-violet">View Types</div>
            </div>
            <div className="home-card c-rose">
              <div className="hc-icon">📈</div>
              <div className="hc-title">Meeting Pipeline</div>
              <div className="hc-desc">Track upcoming meetings and conversion progress.</div>
              <div className="hc-cta c-rose">View Pipeline</div>
            </div>
          </div>

          {/* Meeting Scheduler Modal */}
          {showMeetingScheduler && (
            <div className="modal-overlay" onClick={() => setShowMeetingScheduler(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Schedule Meeting</h3>
                  <button className="modal-close" onClick={() => setShowMeetingScheduler(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Select Employer:</label>
                    <select
                      value={meetingForm.employer_id}
                      onChange={(e) => setMeetingForm({...meetingForm, employer_id: e.target.value})}
                    >
                      <option value="">Choose employer...</option>
                      {employers.filter(emp => emp.status === 'interested' || emp.status === 'very_interested').map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.company_name} - {emp.contact_person}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Meeting Type:</label>
                    <select
                      value={meetingForm.meeting_type}
                      onChange={(e) => setMeetingForm({...meetingForm, meeting_type: e.target.value})}
                    >
                      <option value="demo">Product Demo (30 min)</option>
                      <option value="consultation">Hiring Consultation (45 min)</option>
                      <option value="partnership_discussion">Partnership Discussion (60 min)</option>
                      <option value="follow_up">Follow-up Meeting (15 min)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Date:</label>
                    <input
                      type="date"
                      value={meetingForm.preferred_date}
                      onChange={(e) => setMeetingForm({...meetingForm, preferred_date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Notes:</label>
                    <textarea
                      value={meetingForm.notes}
                      onChange={(e) => setMeetingForm({...meetingForm, notes: e.target.value})}
                      placeholder="Any specific topics or preparation notes..."
                      rows={3}
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn-primary"
                      onClick={handleScheduleMeeting}
                      disabled={!meetingForm.employer_id || !meetingForm.preferred_date}
                    >
                      Generate Calendly Link
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowMeetingScheduler(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Meetings */}
          <div className="how-box" style={{ marginTop: 20 }}>
            <div className="how-title">📅 Upcoming Meetings</div>
            <div style={{ padding: 20 }}>
              {upcomingMeetings.length > 0 ? (
                <div className="meetings-list">
                  {upcomingMeetings.map((meeting, index) => (
                    <div key={index} className="meeting-item">
                      <div className="meeting-header">
                        <div className="meeting-company">
                          {meeting.employer?.company_name || 'Unknown Company'}
                        </div>
                        <div className="meeting-type">
                          {meeting.meeting_type} ({meeting.duration}min)
                        </div>
                      </div>
                      <div className="meeting-details">
                        <div>📅 {meeting.scheduled_date}</div>
                        <div>👤 {meeting.employer?.contact_person || 'TBD'}</div>
                        {meeting.notes && <div>📝 {meeting.notes}</div>}
                      </div>
                      <div className="meeting-actions">
                        <a
                          href={meeting.calendly_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-small"
                        >
                          Open Calendly
                        </a>
                        <button className="btn-small secondary">Mark Complete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: 40 }}>
                  No upcoming meetings scheduled. Schedule your first meeting to get started!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'linkedin-automation' && (
        <div>
          <div className="info-box gold">
            💼 <strong>LinkedIn Automation:</strong> Scale your outreach with automated prospect discovery and connection requests.
          </div>

          {/* LinkedIn Auth Status */}
          <div className="home-grid">
            <div className="home-card c-teal">
              <div className="hc-icon">🔗</div>
              <div className="hc-title">LinkedIn Connection</div>
              <div className="hc-desc">Connect your LinkedIn Sales Navigator account for automated prospecting.</div>
              <button
                className="hc-cta c-teal"
                onClick={() => window.open('https://www.linkedin.com/sales', '_blank')}
              >
                Connect LinkedIn
              </button>
            </div>
            <div className="home-card c-violet">
              <div className="hc-icon">🔍</div>
              <div className="hc-title">Prospect Discovery</div>
              <div className="hc-desc">Search for qualified prospects using Sales Navigator criteria.</div>
              <button
                className="hc-cta c-violet"
                onClick={() => setShowProspectSearch(true)}
              >
                Search Prospects
              </button>
            </div>
            <div className="home-card c-rose">
              <div className="hc-icon">📊</div>
              <div className="hc-title">Campaign Performance</div>
              <div className="hc-desc">Track your LinkedIn outreach campaigns and conversion metrics.</div>
              <div className="hc-cta c-rose">View Campaigns</div>
            </div>
          </div>

          {/* Prospect Search Modal */}
          {showProspectSearch && (
            <div className="modal-overlay" onClick={() => setShowProspectSearch(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Search LinkedIn Prospects</h3>
                  <button className="modal-close" onClick={() => setShowProspectSearch(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Keywords:</label>
                    <input
                      type="text"
                      value={prospectSearchCriteria.keywords}
                      onChange={(e) => setProspectSearchCriteria({...prospectSearchCriteria, keywords: e.target.value})}
                      placeholder="CHRO OR Head of Talent OR HR Director"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company Size:</label>
                    <select
                      value={prospectSearchCriteria.company_size}
                      onChange={(e) => setProspectSearchCriteria({...prospectSearchCriteria, company_size: e.target.value})}
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1001-5000">1001-5000 employees</option>
                      <option value="5001-10000">5001-10000 employees</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Industries:</label>
                    <select multiple size={3}
                      value={prospectSearchCriteria.industries}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setProspectSearchCriteria({...prospectSearchCriteria, industries: values});
                      }}
                    >
                      <option value="Information Technology">Information Technology</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Computer Software">Computer Software</option>
                      <option value="Internet">Internet</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Consulting">Consulting</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Locations:</label>
                    <select multiple size={2}
                      value={prospectSearchCriteria.locations}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setProspectSearchCriteria({...prospectSearchCriteria, locations: values});
                      }}
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Limit:</label>
                    <input
                      type="number"
                      value={prospectSearchCriteria.limit}
                      onChange={(e) => setProspectSearchCriteria({...prospectSearchCriteria, limit: parseInt(e.target.value)})}
                      min="10"
                      max="100"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn-primary"
                      onClick={handleProspectSearch}
                    >
                      Search Prospects
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowProspectSearch(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prospects Results */}
          {linkedinProspects.length > 0 && (
            <div className="how-box" style={{ marginTop: 20 }}>
              <div className="how-title">🎯 Found Prospects ({linkedinProspects.length})</div>
              <div style={{ padding: 20 }}>
                <div className="prospects-grid">
                  {linkedinProspects.map((prospect, index) => (
                    <div key={index} className="prospect-card">
                      <div className="prospect-header">
                        <div className="prospect-name">{prospect.name}</div>
                        <div className="prospect-title">{prospect.title}</div>
                        <div className="prospect-company">{prospect.company}</div>
                      </div>
                      <div className="prospect-details">
                        <div>🏢 {prospect.company_size} employees</div>
                        <div>📍 {prospect.location}</div>
                        <div>🔗 {prospect.connection_degree}nd connection</div>
                        <div>📧 {prospect.email || 'Email not available'}</div>
                        <div>📊 Confidence: {prospect.confidence_score}%</div>
                      </div>
                      <div className="prospect-actions">
                        <a
                          href={prospect.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-small"
                        >
                          View Profile
                        </a>
                        <button
                          className="btn-small"
                          onClick={() => handleSendConnection(prospect)}
                        >
                          Connect
                        </button>
                        <button
                          className="btn-small secondary"
                          onClick={() => handleSendMessage(prospect, 'follow_up')}
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaign Performance */}
          <div className="how-box" style={{ marginTop: 20 }}>
            <div className="how-title">📈 Campaign Performance</div>
            <div style={{ padding: 20 }}>
              {linkedinCampaigns.length > 0 ? (
                <div className="campaigns-list">
                  {linkedinCampaigns.map((campaign, index) => (
                    <div key={index} className="campaign-item">
                      <div className="campaign-header">
                        <div className="campaign-name">{campaign.name}</div>
                        <div className="campaign-status">{campaign.status}</div>
                      </div>
                      <div className="campaign-metrics">
                        <div>🎯 Target: {campaign.target_prospects}</div>
                        <div>🔗 Connected: {campaign.connected} ({campaign.performance.connection_rate}%)</div>
                        <div>💬 Responses: {campaign.responded} ({campaign.performance.response_rate}%)</div>
                        <div>📅 Meetings: {campaign.meetings_booked} ({campaign.performance.meeting_rate}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: 40 }}>
                  No campaigns created yet. Start your first LinkedIn outreach campaign!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <div className="info-box teal">
            📈 <strong>Key Metrics:</strong> Acceptance rate, response rate, conversion rate, partnership rate.
          </div>

          {metrics && (
            <div>
              <div className="stat-grid-2">
                <div className="stat-card">
                  <div className="stat-val">
                    {employers.length > 0 ? Math.round((metrics.by_status?.connected || 0) / employers.length * 100) : 0}%
                  </div>
                  <div className="stat-lbl">Connection Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">
                    {metrics.by_status?.connected > 0 ? Math.round((Object.values(metrics.by_interest || {}).reduce((a, b) => a + b, 0)) / (metrics.by_status?.connected || 1) * 100) : 0}%
                  </div>
                  <div className="stat-lbl">Response Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">
                    {Object.values(metrics.by_interest || {}).reduce((a, b) => a + b, 0) > 0 ? Math.round((metrics.meetings || 0) / Object.values(metrics.by_interest || {}).reduce((a, b) => a + b, 0) * 100) : 0}%
                  </div>
                  <div className="stat-lbl">Meeting Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">
                    {metrics.meetings > 0 ? Math.round(10 / (metrics.meetings || 1) * 100) : 0}% {/* Estimated */}
                  </div>
                  <div className="stat-lbl">Conversion Rate</div>
                </div>
              </div>

              <div className="how-box">
                <div className="how-title">📊 Funnel Performance</div>
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 14, color: 'var(--ink-muted)', marginBottom: 10 }}>
                    2000 Prospects → {metrics.by_status?.connected || 0} Connected → {Object.values(metrics.by_interest || {}).reduce((a, b) => a + b, 0)} Responses → {metrics.meetings || 0} Meetings → ~{Math.round((metrics.meetings || 0) * 0.25)} Partnerships
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'end', gap: 20, height: 120 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 40, height: `${(employers.length / 2000) * 100}%`, background: 'var(--teal)', borderRadius: 4, minHeight: 20 }}></div>
                      <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Prospects</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{employers.length}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 40, height: `${((metrics.by_status?.connected || 0) / Math.max(employers.length, 1)) * 100}%`, background: 'var(--violet)', borderRadius: 4, minHeight: 20 }}></div>
                      <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Connected</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{metrics.by_status?.connected || 0}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 40, height: `${(Object.values(metrics.by_interest || {}).reduce((a, b) => a + b, 0) / Math.max(metrics.by_status?.connected || 1, 1)) * 100}%`, background: 'var(--gold)', borderRadius: 4, minHeight: 20 }}></div>
                      <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Responses</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{Object.values(metrics.by_interest || {}).reduce((a, b) => a + b, 0)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 40, height: `${((metrics.meetings || 0) / Math.max(Object.values(metrics.by_interest || {}).reduce((a, b) => a + b, 0), 1)) * 100}%`, background: 'var(--rose)', borderRadius: 4, minHeight: 20 }}></div>
                      <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Meetings</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{metrics.meetings || 0}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 40, height: `${(Math.round((metrics.meetings || 0) * 0.25) / Math.max(metrics.meetings || 1, 1)) * 100}%`, background: 'var(--olive)', borderRadius: 4, minHeight: 20 }}></div>
                      <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Partnerships</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{Math.round((metrics.meetings || 0) * 0.25)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const handleScheduleMeeting = async () => {
    try {
      const response = await fetch('http://localhost:8001/meetings/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingForm)
      });
      const result = await response.json();

      if (response.ok) {
        alert('Meeting scheduled successfully! Calendly link generated.');
        setShowMeetingScheduler(false);
        setMeetingForm({
          employer_id: '',
          meeting_type: 'demo',
          preferred_date: '',
          notes: ''
        });
        loadUpcomingMeetings(); // Refresh the meetings list
        loadMetrics(); // Refresh metrics to include new meeting
      } else {
        alert('Failed to schedule meeting: ' + result.detail);
      }
    } catch (error) {
      alert('Failed to schedule meeting: ' + error.message);
    }
  };

  const loadUpcomingMeetings = async () => {
    try {
      const response = await fetch('http://localhost:8001/meetings/upcoming');
      const data = await response.json();
      setUpcomingMeetings(data.meetings || []);
    } catch (error) {
      console.error('Failed to load upcoming meetings:', error);
    }
  };

  // Load meetings on component mount
  useEffect(() => {
    loadUpcomingMeetings();
    loadLinkedinData();
  }, []);

  const loadLinkedinData = async () => {
    try {
      // Load campaigns
      const campaignsResponse = await fetch('http://localhost:8001/linkedin/campaigns');
      const campaignsData = await campaignsResponse.json();
      setLinkedinCampaigns(campaignsData.campaigns || []);

      // Load templates
      const templatesResponse = await fetch('http://localhost:8001/linkedin/templates');
      const templatesData = await templatesResponse.json();
      setLinkedinTemplates(templatesData);
    } catch (error) {
      console.error('Failed to load LinkedIn data:', error);
    }
  };

  const handleProspectSearch = async () => {
    try {
      const response = await fetch('http://localhost:8001/linkedin/prospects/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prospectSearchCriteria)
      });
      const data = await response.json();

      if (response.ok) {
        setLinkedinProspects(data.prospects || []);
        setShowProspectSearch(false);
        alert(`Found ${data.total_found} prospects matching your criteria!`);
      } else {
        alert('Failed to search prospects: ' + data.detail);
      }
    } catch (error) {
      alert('Failed to search prospects: ' + error.message);
    }
  };

  const handleSendConnection = async (prospect) => {
    try {
      const response = await fetch('http://localhost:8001/linkedin/connection/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedin_id: prospect.linkedin_id,
          message: linkedinTemplates.connection_request?.message || '',
          profile_url: prospect.profile_url
        })
      });
      const result = await response.json();

      if (response.ok) {
        alert('Connection request sent successfully!');
      } else {
        alert('Failed to send connection request: ' + result.detail);
      }
    } catch (error) {
      alert('Failed to send connection request: ' + error.message);
    }
  };

  const handleSendMessage = async (prospect, messageType) => {
    try {
      const template = linkedinTemplates[messageType];
      if (!template) {
        alert('Message template not found');
        return;
      }

      const response = await fetch('http://localhost:8001/linkedin/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedin_id: prospect.linkedin_id,
          message_type: messageType,
          subject: template.subject,
          message: template.message
        })
      });
      const result = await response.json();

      if (response.ok) {
        alert(`${messageType.replace('_', ' ')} message sent successfully!`);
      } else {
        alert('Failed to send message: ' + result.detail);
      }
    } catch (error) {
      alert('Failed to send message: ' + error.message);
    }
  };
}
