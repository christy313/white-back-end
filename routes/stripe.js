const router = require("express").Router();
const KEY = process.env.STRIPE_KEY;

const stripe = require("stripe")(KEY);
const BASE_URL = "http://localhost:3000";

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            product_data: { name: "Thank you" },
            unit_amount: req.body.amount,
            currency: "cad",
          },
          quantity: 1,
        },
      ],

      success_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/cancel`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
