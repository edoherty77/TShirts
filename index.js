const PORT = process.env.PORT || 3000
const path = require('path')
require('dotenv').config({ path: './.env' })
const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const Stripe = require('stripe')
const stripe = Stripe(
  'sk_test_51I7XskGD6wn1FE2sJEJZq1EWuA7IFwmGZmMzSK8dmF7bllTGg5jg3XVLspJ7xG8O2ikvTguK7WD7uv0ebAkhq5TD00wPVmk8iz',
)

app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// const { resolve } = require('path')

app.get('/', (req, res) => {
  res.render('index')
  // res.send('hey')
})

app.get('/fuck', (req, res) => {
  res.send('dudddddde')
})

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    // customer_email: 'edoherty77@gmail.com',
    submit_type: 'donate',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  })

  res.json({ id: session.id })
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
