'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ─── Interactive dot-wave canvas (mouse lifts + ripples dots) ────────────────
const SPACING = 28, DOT_R = 1.6, WAVE_R = 160, WAVE_D = 18, WAVE_SPD = 0.06, DECAY = 4.5;

function DotWave() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const ripples = useRef([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let cols = 0, rows = 0;
    const resize = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / SPACING) + 1;
      rows = Math.ceil(canvas.height / SPACING) + 1;
    };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      ripples.current.push({ x: mx, y: my, t: 0 });
      if (ripples.current.length > 8) ripples.current.shift();
      mouse.current = { x: mx, y: my };
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ripples.current = ripples.current.map(r => ({ ...r, t: r.t + WAVE_SPD })).filter(r => r.t < Math.PI * 2.5);
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const bx = col * SPACING, by = row * SPACING;
          let dz = 0, alpha = 0.18;
          const dist0 = Math.hypot(bx - mouse.current.x, by - mouse.current.y);
          if (dist0 < WAVE_R) { const f = 1 - dist0 / WAVE_R; dz += f * WAVE_D; alpha = 0.18 + f * 0.7; }
          for (const r of ripples.current) {
            const dist = Math.hypot(bx - r.x, by - r.y), diff = Math.abs(dist - r.t * 80);
            if (diff < 60) { const env = (1 - diff / 60) * Math.exp(-r.t / DECAY); dz += Math.sin(r.t * 6 - dist * 0.06) * WAVE_D * env; alpha = Math.max(alpha, 0.18 + env * 0.6); }
          }
          const P = 300, scale = P / (P - dz), r = DOT_R * scale;
          const vx = canvas.width * 0.5, vy = canvas.height * 0.5;
          const px = bx + (bx - vx) * (scale - 1) * 0.08, py = by + (by - vy) * (scale - 1) * 0.08;
          ctx.beginPath(); ctx.arc(px, py, Math.max(0.5, r), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,0,0,${Math.min(1, alpha)})`; ctx.fill();
        }
      }
      raf.current = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />;
}

const EASE = [0.16, 1, 0.3, 1];

export default function Footer() {
  const videoRef = useRef(null);
  useEffect(() => { videoRef.current?.play().catch(() => {}); }, []);

  return (
    <footer style={{
      position: 'relative', minHeight: '100vh', background: '#fff',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>

      {/* Dot-wave canvas */}
      <DotWave />

      {/* Background video */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          style={{ width: '100%', height: '100%' }}
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <video ref={videoRef} autoPlay muted playsInline loop
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </motion.div>
      </div>

      {/* White gradient fade-up */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
        background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.85) 50%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '24px',
          padding: 'clamp(40px,8vh,100px) clamp(24px,4vw,80px) clamp(32px,5vh,62px)',
        }}
      >
        {/* Left: lockup + heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            <img src="/assets/footer-lockup.png" alt="upGrad School of Technology × IAIB"
              style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            style={{
              fontFamily: 'var(--font-body), Inter, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(2.4rem, 5.5vw, 5.2rem)',
              lineHeight: 1, letterSpacing: '-0.03em',
              color: '#000', margin: 0, whiteSpace: 'nowrap',
            }}
          >
            IGNITE AI BUILDATHON
          </motion.p>
        </div>

        {/* Right: Privacy / Terms */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '6px' }}
        >
          {['Privacy Policy', 'Terms & Conditions'].map((label, i) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {i > 0 && <span style={{ width: '1px', height: '16px', background: 'rgba(0,0,0,0.25)' }} />}
              <a href="#" style={{
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontSize: '13px', color: '#202020', textDecoration: 'none', opacity: 0.6,
                transition: 'opacity .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
              >{label}</a>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </footer>
  );
}
