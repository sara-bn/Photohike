const express = require('express');
const connectDB= require('./config/db')
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser')
const path = require('path');

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


app.use(bodyParser.json())

app.use(cors())
app.use(express.json({ extended: false }));

// connect Database
connectDB();

app.get('/', (req, res) => res.send(`API Running`))

//define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`))