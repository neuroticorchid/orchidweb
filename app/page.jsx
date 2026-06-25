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
  const [selectedNews, setSelectedNews] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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

  const NewsExpandedView = ({ announcement }) => (
    <div className={styles.newsExpandedOverlay}>
      <div className={styles.newsExpandedContainer}>
        <button 
          className={styles.closeBtn}
          onClick={() => setSelectedNews(null)}
        >
          ✕
        </button>
        
        <div className={styles.newsHeader}>
          <h1>{announcement.title}</h1>
          <p className={styles.newsDate}>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | {announcement.source || 'Orchid'}</p>
          {announcement.tags && (
            <div className={styles.tags}>
              {announcement.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        <p className={styles.newsDescription}>{announcement.excerpt}</p>

        <div className={styles.newsContent}>
          {announcement.content && (
            <div className={styles.section}>
              <p dangerouslySetInnerHTML={{ __html: renderRichText(announcement.content) }}></p>
            </div>
          )}

          {announcement.sections?.map((section, idx) => (
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

          {announcement.editorial && (
            <div className={styles.editorial}>
              <h3>Editorial Note</h3>
              <p dangerouslySetInnerHTML={{ __html: renderRichText(announcement.editorial) }}></p>
            </div>
          )}

          {announcement.author && (
            <div className={styles.author}>
              <p><strong>Written by:</strong> {announcement.author}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
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
            <input type="text" placeholder="Search" />
            <button>🔍</button>
          </div>
          <div className={styles.profileIcon}>M</div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {activeTab === 'home' && (
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>Welcome, Visitor!</h2>
            <p className={styles.welcomeText}>Explore Orchid's Hub - your gateway to promises, news, and more!</p>
          </div>
        )}

        {activeTab === 'pins' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Promise Pins</h2>
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
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>News & Announcements</h2>
              <div className={styles.newsGrid}>
                {announcements.map((announcement, idx) => (
                  <div 
                    key={idx} 
                    className={styles.newsCard}
                    onClick={() => setSelectedNews(announcement)}
                  >
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
          </>
        )}

        {activeTab === 'links' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Links</h2>
            <p className={styles.linksDescription}>This channel is all links, yes. All links! This includes the official Twitch and Youtube channels for Orchid, MVP SMP, and many, many more here!</p>
            
            <div className={styles.linksGrid}>
              <div className={styles.linkCard}>
                <div className={styles.linkIcon}>💬</div>
                <h3>Discord Server</h3>
                <p>Join our community</p>
                <a href="https://discord.gg/k9jhbe87Hv" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                  discord.gg/k9jhbe87Hv
                </a>
              </div>

              <div className={styles.linkCard}>
                <div className={styles.linkIcon}>📺</div>
                <h3>YouTube</h3>
                <p>Watch neurotic_orchid streams</p>
                <a href="https://www.youtube.com/@neurotic_orchid" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                  Visit Channel
                </a>
              </div>

              <div className={styles.linkCard}>
                <div className={styles.linkIcon}>🎮</div>
                <h3>Twitch</h3>
                <p>Live streams with neurotic_orchid</p>
                <a href="https://www.twitch.tv/neurotic_orchid" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                  Visit Channel
                </a>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Settings</h2>
            
            <div className={styles.settingsContainer}>
              <div className={styles.settingItem}>
                <div className={styles.settingLabel}>
                  <span>🌙 Dark Mode</span>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingLabel}>
                  <span>♿ Accessibility Features</span>
                </div>
                <p className={styles.settingDescription}>Enhanced text contrast, larger fonts, and screen reader support</p>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingLabel}>
                  <span>🔔 Notifications</span>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingLabel}>
                  <span>🔒 Privacy</span>
                </div>
                <p className={styles.settingDescription}>Manage your data and privacy preferences</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation - Floating */}
      <nav className={styles.bottomNav}>
        <button 
          className={`${styles.navBtn} ${activeTab === 'home' ? styles.active : ''}`}
          onClick={() => setActiveTab('home')}
          title="Home"
        >
          <span className={styles.navIcon}>🏠</span>
          <span className={styles.navLabel}>Home</span>
        </button>
        <button 
          className={`${styles.navBtn} ${activeTab === 'pins' ? styles.active : ''}`}
          onClick={() => setActiveTab('pins')}
          title="Promise Pins"
        >
          <span className={styles.navIcon}>📍</span>
          <span className={styles.navLabel}>Pins</span>
        </button>
        <button 
          className={`${styles.navBtn} ${activeTab === 'news' ? styles.active : ''}`}
          onClick={() => setActiveTab('news')}
          title="News & Blogs"
        >
          <span className={styles.navIcon}>📰</span>
          <span className={styles.navLabel}>News</span>
        </button>
        <button 
          className={`${styles.navBtn} ${activeTab === 'links' ? styles.active : ''}`}
          onClick={() => setActiveTab('links')}
          title="Links"
        >
          <span className={styles.navIcon}>🔗</span>
          <span className={styles.navLabel}>Links</span>
        </button>
        <button 
          className={`${styles.navBtn} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
          title="Settings"
        >
          <span className={styles.navIcon}>⚙️</span>
          <span className={styles.navLabel}>Settings</span>
        </button>
      </nav>

      {/* Blog Expanded View */}
      {selectedBlog && <BlogExpandedView blog={selectedBlog} />}

      {/* News Expanded View */}
      {selectedNews && <NewsExpandedView announcement={selectedNews} />}
    </div>
  );
}
