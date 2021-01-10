const express = require('express')
const PORT = process.env.PORT || 3000
const path = require('path')

const Stripe = require('stripe')
const stripe = Stripe(
  'sk_test_51I7XskGD6wn1FE2sJEJZq1EWuA7IFwmGZmMzSK8dmF7bllTGg5jg3XVLspJ7xG8O2ikvTguK7WD7uv0ebAkhq5TD00wPVmk8iz',
)

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = 'whsec_E1b93Qx82RKDkQqrIPSpC3kFLTc60QkM'
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/create-checkout-session', async (req, res) => {
  const data = req.body.details
  const size = data.size
  const quantity = data.quantity
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    payment_method_types: ['card'],
    line_items: [
      {
        description: size,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 8000,
        },
        quantity: quantity,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  })
  res.json({ id: session.id })
})

const fulfillOrder = (data) => {
  // TODO: fill me in
  console.log('orderDATA ', data)
  // console.log('Fulfilling order', session)
}

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature']
  const event = req.body
  let newData = {}
  // Handle the checkout.session.completed event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      newData.session = session
      break
    case 'customer.created':
      const customer = event.data.object
      newData.customer = customer
      break
    case 'payment_intent.created':
      const payment = event.data.object
      console.log('PAYMENT: ', payment)
      newData.payment = payment
      fulfillOrder(newData)
      break
    default:
  }
  res.status(200)
})

app.get('/success', (req, res) => {
  res.render('success')
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
