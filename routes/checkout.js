const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51NWyK6SC7WXy8eUt5PPBT4xMp8rxYECwTb1IQXCpsltyc9GC9XvtC3vd6gwVnfKkKT2cdcv3LRGfYyKlNguhqfMh00VmZuOhbW');

// const sendEmailWithPDF = require('./email');

router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.movieName,
                            images: [item.imageUrl],
                            description: `Paying for ${item.numTickets} tickets of ${item.movieName}`,
                        },
                        unit_amount: item.totalPayment * 100,
                    },
                    quantity: 1,
                };
            }),
            success_url: `http://localhost:3000/paySuccess`,
            cancel_url: `http://localhost:3000/payFailure`,
        });

        // const paymentIntentId = session.payment_intent;
        itemsForEmail = req.body.items.map(item => ({ ...item }));
        console.log(itemsForEmail);
        // Generate the PDF and send the email with PDF attachment
        // req.body.items.forEach(item => {
        //    sendEmailWithPDF([item], item.email);
        // });

        res.json({ url: session.url, id: session.id, session: JSON.stringify(session) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;