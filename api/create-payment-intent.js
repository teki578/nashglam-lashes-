import Stripe from 'stripe';

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  try {
    const { amount } = req.body;
    
    if (!amount || typeof amount !== 'number') {
      return sendJson(res, 400, { error: 'Invalid or missing amount' });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      console.error('Missing STRIPE_SECRET_KEY');
      return sendJson(res, 500, { error: 'Server misconfiguration: missing Stripe key.' });
    }

    const stripe = new Stripe(stripeSecret);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'cad',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    sendJson(res, 200, { clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    sendJson(res, 500, { error: error.message });
  }
}
