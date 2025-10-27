import React, { useState } from 'react';
import Head from 'next/head';

export default function SessionPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const correctPassword = process.env.NEXT_PUBLIC_SESSION_PASSWORD;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthed(true);
    } else {
      alert('Wrong password. Please try again.');
    }
  };

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment }),
      });

      if (response.ok) {
        setMessage('Thank you for your comment!');
        setName('');
        setComment('');
      } else {
        setMessage('Error: Could not submit comment.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error: Could not submit comment.');
    }
  };

  if (!authed) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Head><title>Unlock Session</title></Head>
        <h2>Enter Password to Access Session</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1.1rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '1.1rem' }}>
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <Head><title>Resonance Session</title></Head>
      <h1>[Album Name] - Resonance Session</h1>

      <section>
        <h2>The Music</h2>
        <audio controls style={{ width: '100%' }}>
          <source src="/path/to/your/album.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </section>

      <section style={{ margin: '3rem 0' }}>
        <h2>Handwritten Lyrics</h2>
        <img src="/path/to/lyrics-1.jpg" alt="Lyrics 1" style={{ width: '100%', marginBottom: '1rem' }} />
        <img src="/path/to/lyrics-2.jpg" alt="Lyrics 2" style={{ width: '100%' }} />
      </section>

      <section style={{ margin: '3rem 0' }}>
        <h2>Studio Vlogs</h2>
        <iframe 
          width="100%" 
          height="500" 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </section>

      <section style={{ margin: '3rem 0', background: '#f9f9f9', padding: '2rem' }}>
        <h2>Leave a Comment (for the Fan Wall)</h2>
        <form onSubmit={handleGuestbookSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Name:</label><br />
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              style={{ width: '300px', padding: '0.5rem' }} 
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Comment:</label><br />
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              required
              style={{ width: '100%', minHeight: '100px', padding: '0.5rem' }} 
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
          {message && <p>{message}</p>}
        </form>
      </section>
    </div>
  );
}