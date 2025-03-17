const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

const path = require("path");

connectToMongo();
const app = express()
const port = 5000

app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));


app.use(cors())
app.use(express.json())

app.use('/api/auth',require(('./routes/auth')))
app.use('/api/notes',require(('./routes/notes')))




app.listen(port, () => {
  console.log(`Noteify backend listening on port http://localhost:${port}`)
})

