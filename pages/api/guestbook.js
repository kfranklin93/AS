const { supabase } = require('../../lib/supabaseClient');
export default async function handler(req, res) {
  
  // POST: Add a new comment
  if (req.method === 'POST') {
    const { name, comment } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ error: 'Name and comment are required.' });
    }

    // Insert the new comment into the 'comments' table
    const { data, error } = await supabase
      .from('comments')
      .insert({ name, comment })
      .select(); // .select() returns the newly created row

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  // GET: Fetch all comments
  if (req.method === 'GET') {
    // Select all columns from the 'comments' table
    // Order by creation time, newest first
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  // Handle other methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}