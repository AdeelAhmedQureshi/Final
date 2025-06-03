// Backend Project
const Book = require('./models/Book');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
// express app
const app = express();

const PORT = process.env.PORT || 5000;

// listen for requests
app.listen(PORT , ()=> {
  console.log('listening on port', PORT);
});

// Connect to MongoDB
const db = process.env.MONGO_URI; // MongoDB URI from .env file
if (!db) {
  console.error("MONGO_DB URI not found in environment variables.");
  process.exit(1); // Exit the process with failure
}
mongoose.connect(db)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => { 
    console.log('Error connecting to DB:', err)});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); 

// routes
// create a new book
app.post('/books', (req,res)=>{
    const book = new Book(req.body);
    const result = book.save();
    res.send(result)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

// get book by id
app.get('/books/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err)
    })
});
// get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err)
    })
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});