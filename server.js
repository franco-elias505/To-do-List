const express = require('express');
const { conectarDB } = require('./db');
const todosRoutes = require('./routes/todos.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', todosRoutes);

app.get('/', (req, res) => {
    res.json({ message: '✅ Server running' });
});

async function main() {
    await conectarDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

main();