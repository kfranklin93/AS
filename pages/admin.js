import React, { useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import KpiCard from '../components/KpiCard';
import FanTable from '../components/FanTable';

export async function getServerSideProps() {
  const { data: fans, error: fansError } = await supabase
    .from('fans')
    .select('email, created_at')
    .order('created_at', { ascending: false });

  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('name, comment')
    .order('created_at', { ascending: false });

  const totalRevenue = "$5,000"; 

  return {
    props: {
      fans: fans || [],
      comments: comments || [],
      totalRevenue: totalRevenue,
    },
  };
}


export default function AdminPage({ fans, comments, totalRevenue }) {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthed(true);
    } else {
      alert('Wrong password.');
    }
  };

  if (!authed) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Head><title>Admin Login</title></Head>
        <h2>Admin Dashboard Login</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1.1rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '1.1rem' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Head><title>Admin Dashboard</title></Head>
      <h1>Your "Goldmine" Dashboard</h1>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
        <KpiCard title="Total Revenue" value={totalRevenue} />
        <KpiCard title="Total Patrons" value={fans.length} />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Patron List ("Goldmine")</h2>
        <FanTable fans={fans} />
      </section>

      <section>
        <h2>Fan Wall Testimonials</h2>
        {comments.map((comment, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <p>"{comment.comment}"</p>
            <strong style={{ display: 'block', textAlign: 'right' }}>- {comment.name}</strong>
          </div>
        ))}
      </section>
    </div>
  );
}