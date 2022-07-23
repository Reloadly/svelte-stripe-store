require('dotenv').config();
const express = require("express");
const app = express();
const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const accessToken = process.env.RELOADLY_TOKEN


const url = "https://giftcards.reloadly.com/products/120";

const headers = {
  Accept: "application/com.reloadly.giftcards-v1+json",
  Authorization: accessToken,
};

let giftCardsData;
let giftCardsAmount;

app.get("/giftcards", (req, res) => {
  axios
    .get(url, { headers: headers })
    .then((response) => {
      giftCardsData = response.data;
      giftCardsAmount = giftCardsData.fixedRecipientDenominations[0] * 100
      res.send({
        success: true,
        data: giftCardsData,
      });
    })
    .catch((error) => {
      res.send({
        success: false,
        data: error,
      });
    });
});

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: giftCardsData.recipientCurrencyCode,
          product_data: {
            name: giftCardsData.productName,
          },
          unit_amount: giftCardsAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://www.reloadly.com/",
    cancel_url: "https://twitter.com/fullstackmafia",
  });
  res.redirect(303, session.url);
});

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
app.listen(5000, () => {
  console.log("Server is up at port 5000");
});
