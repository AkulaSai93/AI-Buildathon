'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ─── Dot-wave canvas (ported from DotWave.tsx in reference) ──────────────────
const SPACING   = 28;
const DOT_R     = 1.6;
const WAVE_R    = 160;
const WAVE_D    = 18;
const WAVE_SPD  = 0.06;
const DECAY     = 4.5;

function DotWave() {
  const canvasRef = useRef(null);
  const mouse   = useRef({ x: -9999, y: -9999 });
  const ripples = useRef([]);
  const raf     = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let cols = 0, rows = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width  / SPACING) + 1;
      rows = Math.ceil(canvas.height / SPACING) + 1;
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      ripples.current.push({ x: mx, y: my, t: 0 });
      if (ripples.current.length > 8) ripples.current.shift();
      mouse.current = { x: mx, y: my };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripples.current = ripples.current
        .map(r => ({ ...r, t: r.t + WAVE_SPD }))
        .filter(r => r.t < Math.PI * 2.5);

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const bx = col * SPACING;
          const by = row * SPACING;
          let dz = 0, alpha = 0.18;

          // Proximity lift from cursor
          const dx0  = bx - mouse.current.x;
          const dy0  = by - mouse.current.y;
          const dist0 = Math.hypot(dx0, dy0);
          if (dist0 < WAVE_R) {
            const f = 1 - dist0 / WAVE_R;
            dz    += f * WAVE_D;
            alpha  = 0.18 + f * 0.7;
          }

          // Ripple waves from cursor trail
          for (const r of ripples.current) {
            const dx   = bx - r.x;
            const dy   = by - r.y;
            const dist = Math.hypot(dx, dy);
            const wf   = r.t * 80;
            const diff = Math.abs(dist - wf);
            if (diff < 60) {
              const env = (1 - diff / 60) * Math.exp(-r.t / DECAY);
              dz    += Math.sin(r.t * 6 - dist * 0.06) * WAVE_D * env;
              alpha  = Math.max(alpha, 0.18 + env * 0.6);
            }
          }

          // Perspective projection
          const P     = 300;
          const scale = P / (P - dz);
          const r     = DOT_R * scale;
          const vx    = canvas.width  * 0.5;
          const vy    = canvas.height * 0.5;
          const px    = bx + (bx - vx) * (scale - 1) * 0.08;
          const py    = by + (by - vy) * (scale - 1) * 0.08;

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, r), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,0,0,${Math.min(1, alpha)})`;
          ctx.fill();
        }
      }
      raf.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize',    resize);
    window.addEventListener('mousemove', onMove);
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  );
}

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',              target: 'home' },
  { label: 'Why IAIB?',         target: 'why-iaib' },
  { label: 'How does it work?', target: 'how-it-works' },
  { label: 'Mentors',           target: 'mentors' },
  { label: 'Jury',              target: 'jury' },
  { label: 'FAQ',               target: 'faq' },
];

const EASE = [0.16, 1, 0.3, 1];

// ─── GridIcon ─────────────────────────────────────────────────────────────────
function GridIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="3.5" cy="3.5" r="1.5" fill="#fff" />
      <circle cx="8.5" cy="3.5" r="1.5" fill="#fff" />
      <circle cx="3.5" cy="8.5" r="1.5" fill="#fff" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#fff" />
    </svg>
  );
}

export default function Footer() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.lenis ? window.lenis.scrollTo(el) : el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{ position: 'relative', minHeight: '100vh', display: 'flex',
      flexDirection: 'column', justifyContent: 'space-between',
      background: '#fff', overflow: 'hidden' }}>

      {/* ── Interactive dot-wave canvas ── */}
      <DotWave />

      {/* ── Background video ── */}
      <div className="footer-video-wrapper">
        <motion.div
          className="footer-video-inner"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <video
            ref={videoRef}
            autoPlay muted playsInline loop
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          />
        </motion.div>
      </div>

      {/* ── Navbar strip (nav links + socials) ── */}
      <div className="footer-nav">
        <div className="footer-nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.target}
              href={`#${link.target}`}
              onClick={(e) => scrollTo(e, link.target)}
              className="footer-nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: register pill */}
        <button className="footer-adaptive-btn">
          <span className="footer-adaptive-circle"><GridIcon /></span>
          <span className="footer-adaptive-label">Register Now</span>
        </button>
      </div>

      {/* ── Bottom content ── */}
      <motion.div
        className="footer-gradient"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, delay: 0.5, ease: EASE }}
      >
        <div className="footer-left">

          <motion.div
            className="footer-subtitle"
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          >
            <span className="footer-dot" />
            <span className="footer-subtitle-text">India's Largest AI Talent Buildathon · 2026</span>
          </motion.div>

          <motion.h2
            className="footer-heading"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          >
            IGNITE <span style={{ color: '#e8000d' }}>AI</span><br />
            BUILDATHON.
          </motion.h2>

          <motion.div
            className="footer-buttons"
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          >
            <a href="#why-iaib" onClick={(e) => scrollTo(e, 'why-iaib')} className="btn-primary">See Features</a>
            <a href="#how-it-works" onClick={(e) => scrollTo(e, 'how-it-works')} className="btn-secondary">How It Works</a>
          </motion.div>

          <div className="footer-legal">
            <a href="#" className="footer-legal-link">Privacy Policy</a>
            <span className="footer-legal-sep" />
            <a href="#" className="footer-legal-link">Terms &amp; Conditions</a>
          </div>
        </div>

        <div className="footer-right">
          {['48-Hour Hackathon', 'AI & ML', 'Bengaluru 2026'].map((tag) => (
            <span key={tag} className="footer-tag">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* ── Scoped styles ── */}
      <style>{`
        .footer-video-wrapper {
          position: absolute; inset: 0; z-index: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .footer-video-inner { width: 80%; height: 80%; position: relative; }

        .footer-nav {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px;
          padding: clamp(22px,3vh,40px) clamp(16px,3vw,32px) 0;
        }
        .footer-nav-links { display: flex; gap: 16px; flex-wrap: wrap; }
        .footer-nav-link {
          font-family: var(--font-display), Inter, sans-serif;
          font-size: 13px; font-weight: 400;
          color: #202020; text-decoration: none;
          opacity: 0.6; transition: opacity .2s, color .2s;
        }
        .footer-nav-link:hover { opacity: 1; color: #e8000d; }

        .footer-adaptive-btn {
          display: flex; align-items: center; gap: 6px;
          background: #F4F4F6; border: none; border-radius: 999px;
          padding: 4px 4px; cursor: pointer;
          font-family: var(--font-display), Inter, sans-serif;
        }
        .footer-adaptive-circle {
          width: 28px; height: 28px; background: #000; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .footer-adaptive-label {
          display: none; font-size: 11px; font-weight: 500;
          color: #000; padding-right: 8px;
        }

        .footer-gradient {
          position: relative; z-index: 30; margin-top: auto;
          padding: 80px 16px 28px;
          background: linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
          display: flex; flex-direction: column; gap: 20px;
        }
        .footer-left  { display: flex; flex-direction: column; gap: 14px; }
        .footer-subtitle { display: flex; align-items: center; gap: 7px; }
        .footer-dot   { width: 8px; height: 8px; border-radius: 50%; background: #000; flex-shrink: 0; }
        .footer-subtitle-text {
          font-family: var(--font-display), Inter, sans-serif;
          font-size: 13px; font-weight: 400; color: rgba(0,0,0,0.55);
        }
        .footer-heading {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: clamp(2rem, 8vw, 4.5rem);
          font-weight: 300; letter-spacing: -0.03em; line-height: 1; color: #000; margin: 0;
        }
        .footer-buttons { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .btn-primary {
          background: #000; color: #fff; border: none; border-radius: 999px;
          padding: 9px 18px; font-size: 13px; font-weight: 500;
          font-family: var(--font-display), Inter, sans-serif;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center;
          transition: opacity .2s;
        }
        .btn-primary:hover { opacity: 0.8; }
        .btn-secondary {
          background: transparent; color: #000;
          border: 1px solid rgba(0,0,0,0.35); border-radius: 999px;
          padding: 9px 18px; font-size: 13px; font-weight: 400;
          font-family: var(--font-display), Inter, sans-serif;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center;
          transition: background .2s;
        }
        .btn-secondary:hover { background: rgba(0,0,0,0.05); }
        .footer-legal { display: flex; align-items: center; gap: 10px; }
        .footer-legal-link {
          font-family: var(--font-display), Inter, sans-serif;
          font-size: 12px; color: #202020; text-decoration: none;
          opacity: 0.45; transition: opacity .2s;
        }
        .footer-legal-link:hover { opacity: 1; }
        .footer-legal-sep { width: 1px; height: 14px; background: rgba(0,0,0,0.2); }

        .footer-right  { display: flex; align-items: flex-end; gap: 6px; flex-wrap: wrap; }
        .footer-tag {
          background: #fff; border: 1px solid rgba(0,0,0,0.12);
          border-radius: 999px; padding: 5px 12px;
          font-size: 11px; font-weight: 500;
          font-family: var(--font-display), Inter, sans-serif; color: #000;
        }

        @media (min-width: 768px) {
          .footer-video-inner   { width: 100%; height: 100%; }
          .footer-adaptive-label{ display: block; }
          .footer-adaptive-btn  { padding: 4px; }
          .footer-adaptive-circle{ width: 32px; height: 32px; }
          .footer-gradient {
            flex-direction: row; align-items: flex-end;
            justify-content: space-between;
            padding: 100px 32px 36px;
          }
          .footer-heading { font-size: clamp(2.5rem, 5.5vw, 4.5rem); }
        }
      `}</style>
    </footer>
  );
}
