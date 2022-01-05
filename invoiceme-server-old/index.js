import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import invoiceRoutes from './routes/invoices.js'
import clientRoutes from './routes/clients.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import enterpriseRoutes from './routes/enterprises.js'

const app = express()
dotenv.config()

app.use((express.json({ limit: "30mb", extended: true})))
app.use((express.urlencoded({ limit: "30mb", extended: true})))
app.use((cors()))

app.use('/api/invoices', invoiceRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/enterprises', enterpriseRoutes)

app.get('/', (req, res) => {res.send('SERVER IS RUNNING')})

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 5000

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message))
