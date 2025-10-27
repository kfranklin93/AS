import React from 'react';

export default function KpiCard({ title, value }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1.5rem', textAlign: 'center' }}>
      <h3 style={{ margin: 0, color: '#555' }}>{title}</h3>
      <p style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>
        {value}
      </p>
    </div>
  );
}