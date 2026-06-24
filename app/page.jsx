// ORCHID WEBSITE - Next.js App
// File: app/page.js

'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

// Promise Pin Component
function PromisePin({ title, status, description }) {
  const [isBroken, setIsBroken] = useState(status === 'broken');

  return (
    <div className={`${styles.pinContainer} ${isBroken ? styles.pinBroken : styles.pinIntact}`}>
      <div className={styles.pinVisual}>
        <svg width="80" height="100" viewBox="0 0 80 100" className={styles.pinSVG}>
          {/* Pin Head */}
          <circle cx="40" cy="20" r="15" className={styles.pinHead} />
          
          {/* Pin Shaft */}
          {!isBroken ? (
            <line x1="40" y1="35" x2="40" y2="80" className={styles.pinShaft} strokeWidth="3" />
          ) : (
            <>
              {/* Broken shaft - two pieces */}
              <line x1="40" y1="35" x2="35" y2="55" className={styles.pinShaftBroken} strokeWidth="3" />
              <line x1="40" y1="70" x2="45" y2="85" className={styles.pinShaftBroken} strokeWidth="3" />
              {/* Crack effect */}
              <circle cx="40" cy="62" r="8" className={styles.crackZone} fill="none" strokeWidth="1" />
            </>
          )}

          {/* Status Indicator */}
          {!isBroken ? (
            <circle cx="40" cy="20" r="20" className={styles.statusGood} fill="none" strokeWidth="2" />
          ) : (
            <>
              <line x1="32" y1="12" x2="48" y2="28" className={styles.statusBad} strokeWidth="2" />
              <line x1="48" y1="12" x2="32" y2="28" className={styles.statusBad} strokeWidth="2" />
            </>
          )}
        </svg>
      </div>

      <div className={styles.pinContent}>
        <h3 className={styles.pinTitle}>{title}</h3>
        <p className={styles.pinStatus}>{isBroken ? 'Promise Broken' : 'Promise Kept'}</p>
        <p className={styles.pinDescription}>{description}</p>
      </div>

      {/* Admin button to toggle status */}
      <button 
        className={styles.toggleButton}
        onClick={() => setIsBroken(!isBroken)}
        title="Toggle pin status (admin only)"
      >
        {isBroken ? '✓ Restore' : '✗ Break'}
      </button>
    </div>
  );
}

// Blog/Announcement Card Component
function ContentCard({ type, title, date, excerpt, content }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`${styles.card} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <span className={styles.badge}>{type === 'announcement' ? '📢' : '📝'} {type}</span>
        <time className={styles.date}>{date}</time>
      </div>
      
      <h3 className={styles.cardTitle}>{title}</h3>
      
      <p className={styles.cardExcerpt}>
        {expanded ? content : excerpt}
      </p>

      {content.length > excerpt.length && (
        <button 
          className={styles.readMore}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </article>
  );
}

// Main Page
export default function Home() {
  const [data, setData] = useState({
    pins: [],
    announcements: [],
    blogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from JSON files (served from /public)
    Promise.all([
      fetch('/data/pins.json').then(r => r.json()).catch(() => []),
      fetch('/data/announcements.json').then(r => r.json()).catch(() => []),
      fetch('/data/blogs.json').then(r => r.json()).catch(() => [])
    ]).then(([pins, announcements, blogs]) => {
      setData({ pins, announcements, blogs });
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>🌸 Orchid</h1>
          <p className={styles.subtitle}>Coming to theorchidwebsite.vercel.app in July</p>
          <p className={styles.tagline}>Where promises matter and trust is visible</p>
        </div>
      </header>

      {/* Promise Pins Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Promises</h2>
        <div className={styles.pinsGrid}>
          {loading ? (
            <p>Loading promises...</p>
          ) : data.pins.length > 0 ? (
            data.pins.map((pin, idx) => (
              <PromisePin
                key={idx}
                title={pin.title}
                status={pin.status}
                description={pin.description}
              />
            ))
          ) : (
            <p>No promises yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Announcements Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Announcements</h2>
        <div className={styles.contentGrid}>
          {loading ? (
            <p>Loading announcements...</p>
          ) : data.announcements.length > 0 ? (
            data.announcements.map((item, idx) => (
              <ContentCard
                key={idx}
                type="announcement"
                title={item.title}
                date={item.date}
                excerpt={item.excerpt}
                content={item.content}
              />
            ))
          ) : (
            <p>No announcements yet.</p>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Blog</h2>
        <div className={styles.contentGrid}>
          {loading ? (
            <p>Loading blog posts...</p>
          ) : data.blogs.length > 0 ? (
            data.blogs.map((item, idx) => (
              <ContentCard
                key={idx}
                type="blog"
                title={item.title}
                date={item.date}
                excerpt={item.excerpt}
                content={item.content}
              />
            ))
          ) : (
            <p>No blog posts yet.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Orchid © 2024 • Managed with integrity</p>
      </footer>
    </div>
  );
}
