import React, { useState } from 'react';
import Head from 'next/head';

export default function SessionPage() {
  // State for the password gate
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  // State for the guestbook form
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  // Get the correct password from your .env.local file
  const correctPassword = process.env.NEXT_PUBLIC_SESSION_PASSWORD;

  //
  // 1. Auth Gate Logic
  //
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthed(true);
    } else {
      alert('Wrong password. Please try again.');
      setPassword(''); // Clear the input
    }
  };

  //
  // 2. Guestbook Form Logic
  //
  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      // POST the form data to our future guestbook API
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment }),
      });

      if (response.ok) {
        setMessage('Thank you! Your comment is now on the Fan Wall.');
        // Clear the form
        setName('');
        setComment('');
      } else {
        // Handle server errors
        const data = await response.json();
        setMessage(`Error: ${data.error || 'Could not submit comment.'}`);
      }
    } catch (error) {
      // Handle network errors
      console.error(error);
      setMessage('Error: Could not connect to server.');
    }
  };

  //
  // 3. Auth Gate UI
  //
  // If not authenticated, return the password form
  if (!authed) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', padding: '1rem' }}>
        <Head><title>Unlock Session</title></Head>
        <h2>Enter Password to Access Session</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{ padding: '0.5rem', fontSize: '1.1rem', marginRight: '8px' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '1.1rem' }}>
            Submit
          </button>
        </form>
      </div>
    );
  }

  //
  // 4. Premium Content UI (If authed)
  //
  // If authenticated, return the "Liner Notes"
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <Head><title>Resonance Session</title></Head>
      <h1>[Album Name] - Resonance Session</h1>

      {/* 1. Audio Player */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>The Music</h2>
        {/* Replace with your audio file URL (you can host it on Supabase Storage!) */}
        <audio controls style={{ width: '100%' }}>
          <source src="/path/to/your/album.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </section>

      {/* 2. Lyrics Gallery */}
      <section style={{ margin: '3rem 0' }}>
        <h2>Handwritten Lyrics</h2>
        {/* Replace with your image URLs (host on Supabase Storage or Vercel /public) */}
        <img src="/path/to/lyrics-1.jpg" alt="Lyrics 1" style={{ width: '100%', marginBottom: '1rem', borderRadius: '8px' }} />
        <img src="/path/to/lyrics-2.jpg" alt="Lyrics 2" style={{ width: '100%', borderRadius: '8px' }} />
      </section>

      {/* 3. Studio Vlogs */}
      <section style={{ margin: '3rem 0' }}>
        <h2>Studio Vlogs</h2>
        {/* Replace with your video embed code from YouTube/Vimeo */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* 4. Guestbook Form */}
      <section style={{ margin: '3rem 0', background: '#f9f9f9', padding: '2rem', borderRadius: '8px' }}>
        <h2>Leave a Comment (for the Fan Wall)</h2>
        <form onSubmit={handleGuestbookSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '4px' }}>Name:</label>
            <input 
              id="name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              style={{ width: '300px', maxWidth: '100%', padding: '0.5rem' }} 
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="comment" style={{ display: 'block', marginBottom: '4px' }}>Comment:</label>
            <textarea 
              id="comment"
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              required
              style={{ width: '100%', minHeight: '100px', padding: '0.5rem' }} 
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
          {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </form>
      </section>
    </div>
  );
}