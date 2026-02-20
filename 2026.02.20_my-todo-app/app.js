const express = require('express');
const app = express();
const PORT = 3000;

// settings for middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// create data
let todos = [
    { id: 1, title: 'express study', done: false },
    { id: 2, title: 'EJS study', done: false },
    { id: 3, title: 'Postman practice', done: false }
];

let nextId = 4;

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (todo) {
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Cannot find todo!' });
    }
});

app.post('/todos', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(404).json({ error: 'Input title!' });
    }

    const newTodo = {
        id: nextId++,
        title: title,
        done: false
    };

    todos.push(newTodo);
    res.status(201).json(todos);
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, done } = req.body;
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ error: 'Cannot find todo' });
    }

    if (title) todo.title = title;
    if (done != undefined) todo.done = done;

    res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Cannot find todo' });
    }

    const deleteTodo = todos.splice(index, 1)[0];
    res.json({ message: 'deleted.', todo: deleteTodo });
});

app.set('view engine', 'ejs');
app.set('views', './views');

// 할 일 목록을 HTML로 보여주기
app.get('/', (req, res) => {
    res.render('todos', { todos: todos });
});

// 체크박스 토글 처리
app.post('/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (todo) {
        todo.done = !todo.done;
    }

    res.redirect('/');
});

// 삭제 처리
app.get('/todos/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index !== -1) {
        todos.splice(index, 1);
    }

    res.redirect('/');
});

// 수정 페이지
app.get('/todos/:id/edit', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.redirect('/');
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>할 일 수정</title>
            <style>
                body { font-family: Arial; max-width: 400px; margin: 50px auto; }
                input { width: 100%; padding: 10px; margin: 10px 0; }
                button { padding: 10px 20px; background: #0066cc; color: white; border: none; }
            </style>
        </head>
        <body>
            <h1>할 일 수정</h1>
            <form action="/todos/${todo.id}/update" method="POST">
                <input type="text" name="title" value="${todo.title}" required>
                <button type="submit">수정</button>
                <a href="/" style="margin-left: 10px;">취소</a>
            </form>
        </body>
        </html>
    `);
});

// 수정 처리
app.post('/todos/:id/update', (req, res) => {
    const id = parseInt(req.params.id);
    const { title } = req.body;
    const todo = todos.find(t => t.id === id);

    if (todo && title) {
        todo.title = title;
    }

    res.redirect('/');
});
