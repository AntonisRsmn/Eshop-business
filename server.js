const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use environment variable

// CORS Configuration: Allow only frontend requests
app.use(cors({
    origin: ['http://localhost:5500', 'https://antonisrsmn.github.io/Eshop-business/'], // Replace with your frontend URL
    methods: 'POST',
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: { name: item.name },
                    unit_amount: Math.round(parseFloat(item.price.replace('€', '')) * 100), // Convert to cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: 'http://localhost:4040/index.html',
            cancel_url: 'http://localhost:4040/index.html',
        });

        res.json({ id: session.id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server on port 3000 (fixed log message)
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
