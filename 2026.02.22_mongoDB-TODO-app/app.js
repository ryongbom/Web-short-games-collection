const express = require('express');
const Todo = require('./models/Todo');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/todoapp')
    .then(() => {
        console.log('successfully connected to mongoDB!');

        app.listen(3000, () => {
            console.log('Server is running: http://localhost:3000');
        });
    })
    .catch(err => {
        console.log('Error conneting to MongoDB', err);
    });

// app.get('/', (req, res) => {
//     res.send('TODO app is preparing...');
// });

app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.render('index', { todos });
    } catch (err) {
        res.status(500).send('Server Error!');
    }
});

app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo({
            title: req.body.title
        });
        await newTodo.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send('save Error!');
    }
});

app.post('/todos/:id/toggle', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.done = !todo.done;
        await todo.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error');
    }
});

app.get('/todos/:id/delete', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error delete!');
    }
});