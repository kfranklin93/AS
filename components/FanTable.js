import React from 'react';

export default function FanTable({ fans }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f4f4f4' }}>
          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Signed Up</th>
        </tr>
      </thead>
      <tbody>
        {fans.map((fan) => (
          <tr key={fan.email}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{fan.email}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {new Date(fan.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}