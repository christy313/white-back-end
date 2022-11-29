const router = require("express").Router();
const KEY = process.env.STRIPE_KEY;

const stripe = require("stripe")(KEY);
const YOUR_DOMAIN = "http://localhost:3000";

// router.post("/payment", (req, res) => {
//   stripe.charges.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "cad",
//     },
//     (stripeErr, stripeRes) => {
//       if (stripeErr) {
//         res.status(500).json(stripeErr);
//       } else {
//         res.status(200).json(stripeRes);
//       }
//     }
//   );
// });

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

      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
