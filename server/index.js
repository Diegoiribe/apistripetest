import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { PORT } from '../config.js'
import { STRIPE_PRIVATE_KEY } from '../config.js'

const app = express()

const stripe = new Stripe(STRIPE_PRIVATE_KEY)

app.use(cors('http://localhost:3000/checkout'))
app.use(express.json())

app.post('/api/checkout', async (req, res) => {
  try {
    const { id, amount } = req.body
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Elephant in the Room',
      payment_method: id,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' }
    })
    console.log(payment)
    res.send({ message: 'Succesful payment' })
  } catch (error) {
    console.log(error)
    res.json({ message: error.raw.message })
  }
})

app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})
