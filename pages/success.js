import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export async function getServerSideProps(context) {
  const { session_id } = context.query;

  if (!session_id) {
    return { props: { error: 'No session ID found.' } };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.customer_details.email;

    if (!email) {
      return { props: { error: 'No email found in session.' } };
    }

    const { error: supabaseError } = await supabase
      .from('fans')
      .upsert({ email: email }, { onConflict: 'email' });
    
    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return { props: { error: 'Failed to save fan.' } };
    }

    return {
      props: {
        email: email,
      },
    };

  } catch (error) {
    console.error('Stripe error:', error);
    return { props: { error: error.message } };
  }
}

export default function SuccessPage({ email, error }) {
  
  const sessionPassword = process.env.NEXT_PUBLIC_SESSION_PASSWORD;

  if (error) {
    return (
      <div>
        <Head><title>Error</title></Head>
        <h1>Something went wrong</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Head>
        <title>Thank You!</title>
      </Head>
      
      <h1>Thank you for your purchase, {email}!</h1>
      <p>You've unlocked the [Album Name] Resonance Session.</p>
      
      <div style={{ background: '#f4f4f4', padding: '2rem', margin: '2rem auto', maxWidth: '500px' }}>
        <p>Go to the /session page and use this password:</p>
        <h2 style={{ background: '#333', color: 'white', padding: '1rem', userSelect: 'all' }}>
          {sessionPassword}
        </h2>
      </div>
    </div>
  );
}