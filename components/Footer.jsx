'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const NAV_LINKS = [
  { label: 'Home',              target: 'home' },
  { label: 'Why IAIB?',         target: 'why-iaib' },
  { label: 'How does it work?', target: 'how-it-works' },
  { label: 'Mentors',           target: 'mentors' },
  { label: 'Jury',              target: 'jury' },
  { label: 'FAQ',               target: 'faq' },
];

const TAGS = ['48-Hour Hackathon', 'AI & ML', 'Bengaluru 2026'];

export default function Footer() {
  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.lenis ? window.lenis.scrollTo(el) : el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* ── Background: dot-wave grid ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.8, ease: EASE }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/assets/hero-dotwave.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
      </motion.div>

      {/* ── Robotic hand centred ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.15 }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/assets/hero-hand.png"
          alt=""
          style={{
            width: 'clamp(300px, 48vw, 700px)',
            height: 'auto',
            objectFit: 'contain',
            transform: 'translate(10%, 8%)',
          }}
        />
      </motion.div>

      {/* ── White gradient fade-up ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Top nav row ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: 'clamp(28px,3vh,48px) clamp(20px,4vw,80px) 0',
        }}
      >
        {/* Nav links */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.target}
              href={`#${link.target}`}
              onClick={(e) => scrollTo(e, link.target)}
              style={{
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#202020',
                textDecoration: 'none',
                opacity: 0.65,
                transition: 'opacity 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#e8000d'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.65'; e.currentTarget.style.color = '#202020'; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['Instagram', 'LinkedIn'].map((s) => (
            <a
              key={s}
              href="#"
              style={{
                background: '#f1f1f1',
                border: '1px solid #ddd',
                color: '#444',
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                padding: '5px 14px',
                borderRadius: '999px',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
              onMouseLeave={e => e.currentTarget.style.background = '#f1f1f1'}
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* ── Bottom content (slides up on enter) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '28px',
          padding: '0 clamp(20px,4vw,80px) clamp(36px,5vh,72px)',
        }}
      >
        {/* Left block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Subtitle: dot + text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{
              width: '8px', height: '8px',
              background: '#000', borderRadius: '50%', flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-display), Inter, sans-serif',
              fontSize: '13px',
              color: 'rgba(0,0,0,0.55)',
              fontWeight: 400,
            }}>
              India's Largest AI Talent Buildathon · 2026
            </span>
          </motion.div>

          {/* Heading — two lines */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
            style={{
              fontFamily: 'var(--font-body), Inter, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#000',
              margin: 0,
            }}
          >
            IGNITE <span style={{ color: '#e8000d' }}>AI</span><br />
            BUILDATHON.
          </motion.h2>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
          >
            <a
              href="#why-iaib"
              onClick={(e) => scrollTo(e, 'why-iaib')}
              style={{
                display: 'inline-flex', alignItems: 'center',
                height: '40px', padding: '0 22px',
                background: '#000', color: '#fff',
                borderRadius: '999px', fontSize: '13px',
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontWeight: 500, textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              See Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollTo(e, 'how-it-works')}
              style={{
                display: 'inline-flex', alignItems: 'center',
                height: '40px', padding: '0 22px',
                background: 'transparent', color: '#000',
                border: '1px solid rgba(0,0,0,0.35)',
                borderRadius: '999px', fontSize: '13px',
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontWeight: 500, textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.75)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.35)'}
            >
              How It Works
            </a>
          </motion.div>

          {/* Privacy / Terms */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {['Privacy Policy', 'Terms & Conditions'].map((label, i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {i > 0 && <span style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.2)' }} />}
                <a href="#" style={{
                  fontFamily: 'var(--font-display), Inter, sans-serif',
                  fontSize: '12px', color: '#202020',
                  textDecoration: 'none', opacity: 0.5,
                  transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                >{label}</a>
              </span>
            ))}
          </div>
        </div>

        {/* Right block: tag pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end', paddingBottom: '4px' }}>
          {TAGS.map((tag) => (
            <span
              key={tag}
              style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '11px',
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontWeight: 400,
                color: '#000',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </footer>
  );
}
