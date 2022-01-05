import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path';

import invoiceRoutes from './routes/invoices'
import clientRoutes from './routes/clients'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import enterpriseRoutes from './routes/enterprises'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
}

const app = express()

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
