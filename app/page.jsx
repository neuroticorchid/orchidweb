'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  const [pins, setPins] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    // Load data from public/data
    Promise.all([
      fetch('/data/pins.json').then(res => res.json()).catch(() => []),
      fetch('/data/announcements.json').then(res => res.json()).catch(() => []),
      fetch('/data/blogs.json').then(res => res.json()).catch(() => []),
    ]).then(([pinsData, announcementsData, blogsData]) => {
      setPins(pinsData);
      setAnnouncements(announcementsData);
      setBlogs(blogsData);
    });
  }, []);

  const renderRichText = (text) => {
    if (!text) return '';
    
    let result = text;
    
    // Replace bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Replace blue highlight: blue:'text'
    result = result.replace(/blue:'(.+?)'/g, '<span class="highlight-blue">$1</span>');
    
    // Replace underline: underline:'text'
    result = result.replace(/underline:'(.+?)'/g, '<span class="underline">$1</span>');
    
    return result;
  };

  const BlogExpandedView = ({ blog }) => (
    <div className={styles.blogExpandedOverlay}>
      <div className={styles.blogExpandedContainer}>
        <button 
          className={styles.closeBtn}
          onClick={() => setSelectedBlog(null)}
        >
          ✕
        </button>
        
        <div className={styles.blogHeader}>
          <h1>{blog.title}</h1>
          <p className={styles.blogDate}>{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          {blog.tags && (
            <div className={styles.tags}>
              {blog.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        <p className={styles.blogDescription}>{blog.description}</p>

        <div className={styles.blogBody}>
          {blog.body?.intro && (
            <div className={styles.section}>
              <p dangerouslySetInnerHTML={{ __html: renderRichText(blog.body.intro) }}></p>
            </div>
          )}

          {blog.body?.sections?.map((section, idx) => (
            <div key={idx} className={styles.section}>
              {section.title && <h2>{section.title}</h2>}
              <p dangerouslySetInnerHTML={{ __html: renderRichText(section.content) }}></p>
              {section.quotes?.map((quote, qIdx) => (
                <blockquote key={qIdx} className={styles.quote}>
                  &gt; {quote}
                </blockquote>
              ))}
            </div>
          ))}

          {blog.body?.conclusion && (
            <div className={styles.conclusion}>
              <p dangerouslySetInnerHTML={{ __html: renderRichText(blog.body.conclusion) }}></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Image 
              src="/image.png" 
              alt="Orchid's Hub Logo"
              width={40}
              height={40}
              className={styles.logoImage}
            />
            <h1>Orchid's Hub</h1>
          </div>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Hinted search text" />
            <button>🔍</button>
          </div>
          <div className={styles.profileIcon}>M</div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {activeTab === 'home' && (
          <>
            {/* Latest Promise Pins */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Latest Promise Pins!</h2>
              <div className={styles.pinsGrid}>
                {pins.map((pin, idx) => (
                  <div key={idx} className={styles.pinCard}>
                    <div className={styles.pinBadge}>{pin.status === 'kept' ? '✓' : '✗'} {pin.title} pinned this!</div>
                    <div className={styles.pinContent}>
                      <h3>{pin.title}</h3>
                      <p>{pin.description}</p>
                    </div>
                    <div className={`${styles.pinIcon} ${pin.status === 'kept' ? styles.kept : styles.broken}`}></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Latest News (Announcements) */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Latest News</h2>
              <div className={styles.newsGrid}>
                {announcements.map((announcement, idx) => (
                  <div key={idx} className={styles.newsCard}>
                    {announcement.tags && (
                      <div className={styles.cardTags}>
                        {announcement.tags.map(tag => (
                          <span key={tag} className={styles.cardTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <h3>{announcement.title}</h3>
                    <p className={styles.newsDate}>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | {announcement.source || 'Orchid'}</p>
                    <p>{announcement.excerpt}</p>
                    <button className={styles.readMore}>→</button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'pins' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>All Promise Pins</h2>
            <div className={styles.pinsGrid}>
              {pins.map((pin, idx) => (
                <div key={idx} className={styles.pinCard}>
                  <div className={styles.pinBadge}>{pin.status === 'kept' ? '✓' : '✗'} {pin.title} pinned this!</div>
                  <div className={styles.pinContent}>
                    <h3>{pin.title}</h3>
                    <p>{pin.description}</p>
                  </div>
                  <div className={`${styles.pinIcon} ${pin.status === 'kept' ? styles.kept : styles.broken}`}></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'news' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>News & Announcements</h2>
            <div className={styles.newsGrid}>
              {announcements.map((announcement, idx) => (
                <div key={idx} className={styles.newsCard}>
                  {announcement.tags && (
                    <div className={styles.cardTags}>
                      {announcement.tags.map(tag => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                  <h3>{announcement.title}</h3>
                  <p className={styles.newsDate}>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | {announcement.source || 'Orchid'}</p>
                  <p>{announcement.excerpt}</p>
                  <button className={styles.readMore}>→</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'blog' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Blog Posts</h2>
            <div className={styles.blogsGrid}>
              {blogs.map((blog, idx) => (
                <div 
                  key={idx} 
                  className={styles.blogCard}
                  onClick={() => setSelectedBlog(blog)}
                >
                  <h3>{blog.title}</h3>
                  <p className={styles.blogSmallDesc}>{blog.smallDescription}</p>
                  <p className={styles.blogDate}>{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <button className={styles.readMore}>→</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button 
          className={`${styles.navBtn} ${activeTab === 'home' ? styles.active : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span className={styles.navIcon}>🏠</span>
          <span>Home</span>
        </button>
        <button 
          className={`${styles.navBtn} ${activeTab === 'pins' ? styles.active : ''}`}
          onClick={() => setActiveTab('pins')}
        >
          <span className={styles.navIcon}>📍</span>
          <span>Promise Pins</span>
        </button>
        <button 
          className={`${styles.navBtn} ${activeTab === 'news' ? styles.active : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <span className={styles.navIcon}>📰</span>
          <span>News</span>
        </button>
        <button 
          className={`${styles.navBtn} ${activeTab === 'blog' ? styles.active : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          <span className={styles.navIcon}>✏️</span>
          <span>Links</span>
        </button>
        <button 
          className={styles.navBtn}
          onClick={() => setActiveTab('settings')}
        >
          <span className={styles.navIcon}>⚙️</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* Blog Expanded View */}
      {selectedBlog && <BlogExpandedView blog={selectedBlog} />}
    </div>
  );
}
