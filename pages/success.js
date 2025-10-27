import Head from 'next/head';
import Link from 'next/link'; // Import the Link component
import { supabase } from '../lib/supabaseClient';
import stripePackage from 'stripe';

// Initialize Stripe on the server
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

//
// STEP 1: SERVER-SIDE LOGIC
//
export async function getServerSideProps(context) {
  // Get the session_id from the URL query
  const { session_id } = context.query;

  if (!session_id) {
    // Handle cases where there's no session_id
    return { props: { error: 'No session ID found.' } };
  }

  try {
    // 1. Retrieve the session data from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.customer_details.email;

    if (!email) {
      // Handle cases where email wasn't collected
      return { props: { error: 'No email found in session.' } };
    }

    // 2. Save the Fan to your 'fans' table in Supabase
    // This is the "Goldmine" data capture!
    const { error: supabaseError } = await supabase
      .from('fans')
      .upsert({ email: email }, { onConflict: 'email' });
    
    if (supabaseError) {
      // If Supabase fails, log it but still show success to the user
      console.error('Supabase error:', supabaseError);
      // You might want to set up an alert here for yourself
    }

    // 3. Pass the fan's email to the page to display
    return {
      props: {
        email: email,
      },
    };

  } catch (error) {
    // Handle any errors from Stripe
    console.error('Stripe error:', error.message);
    return { props: { error: error.message } };
  }
}


//
// STEP 2: PAGE COMPONENT
//
export default function SuccessPage({ email, error }) {
  
  // Get the hardcoded password from environment variables
  const sessionPassword = process.env.NEXT_PUBLIC_SESSION_PASSWORD;

  // Handle any error passed from getServerSideProps
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Head><title>Error</title></Head>
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <p>Please contact support.</p>
      </div>
    );
  }

  // The "Thank You" UI
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Head>
        <title>Thank You!</title>
      </Head>
      
      <h1>Thank you for your purchase, {email}!</h1>
      <p>You've unlocked the [Album Name] Resonance Session.</p>
      
      <div style={{ background: '#f4f4f4', padding: '2rem', margin: '2rem auto', maxWidth: '500px', borderRadius: '8px' }}>
        
        {/* Use the Link component for fast client-side navigation */}
        <p style={{ fontSize: '1.2rem' }}>
          <Link href="/session" style={{ fontWeight: 'bold', color: '#0070f3' }}>
            Click here to go to the session page
          </Link>
        </p>
        <p>and use this password:</p>
        
        {/* This displays the password from your .env.local file */}
        <h2 style={{ background: '#333', color: 'white', padding: '1rem', userSelect: 'all', borderRadius: '4px' }}>
          {sessionPassword}
        </h2>
      </div>
    </div>
  );
}