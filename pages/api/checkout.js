import stripePackage from 'stripe';

// Initialize Stripe with your secret key from .env.local
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method === 'POST') {
    try {
      // Create a new Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        
        // --- Configuration based on your plan ---
        
        // 1. Force email collection
        customer_creation: 'always', 
        
        // 2. Define what the user is buying
        line_items: [
          {
            price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: 'payment',
        
        // 3. Set the redirect URLs
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
      });

      // 4. Redirect the user to the Stripe-hosted checkout page
      // We send back the URL for the client-side to redirect to
      res.status(200).json({ url: session.url });

    } catch (err) {
      console.error('Stripe error:', err.message);
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}