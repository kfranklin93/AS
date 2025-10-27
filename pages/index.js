import React from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
// 1. Import the CSS Module
import styles from '../styles/Home.module.css';

export async function getServerSideProps() {
  // ... (your existing getServerSideProps function) ...
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
  }

  return {
    props: {
      comments: comments || [],
    },
  };
}

export default function HomePage({ comments }) {

  const handleCheckout = async () => {
    // ... (your existing handleCheckout function) ...
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });
      
      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error: Could not connect to payment. Please try again.');
    }
  };

  // 2. Use the 'styles' object with 'className'
  return (
    <div className={styles.container}>
      <Head>
        <title>New Album - Resonance Session</title>
      </Head>

      {/* 1. Hero & Sales Pitch */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          [Hero Image/Video Here]
        </div>
        
        <h1>The New Album: A Resonance Session</h1>
        <p className={styles.salesPitch}>
          Get the new album [Album Name] as a 'Resonance Session'. 
          For $10, you get the music plus handwritten lyrics, 
          studio vlogs, and exclusive photos.
        </p>

        {/* 2. Key Function (StripeBuyButton) */}
        <button 
          onClick={handleCheckout} 
          className={styles.buyButton}
        >
          Buy Now ($10)
        </button>
      </section>

      {/* 3. Fan Wall */}
      <section className={styles.fanWall}>
        <h2>Fan Wall</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <p>"{comment.comment}"</p>
              <strong className={styles.commentAuthor}>- {comment.name}</strong>
            </div>
          ))
        ) : (
          <p>Be the first to leave a comment!</p>
        )}
      </section>
    </div>
  );
}