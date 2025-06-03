// Backend Project , sinple component file, but using 
// const Book = require('./models/Book');
const express = require('express');

const dotenv = require('dotenv');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Book = mongoose.model('Book', bookSchema);

dotenv.config();
// express app
const app = express();

const PORT = process.env.PORT || 5000;

// listen for requests
app.listen(PORT , ()=> {
  console.log('listening on port', PORT);
});

// Connect to MongoDB
const db = 'mongodb+srv://AdeelAhmed:AdeelAhmedMDBAtlas@cluster0.9xwcl.mongodb.net/Exam?retryWrites=true&w=majority';

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
});

// get book by id
app.get('/books/:id', (req, res) => {
  const id = req.params.id;
  Book.findById(id)
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

// delete book by id
app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  Book.findByIdAndDelete(id)
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