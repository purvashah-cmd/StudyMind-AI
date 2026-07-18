const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const docRoutes = require('./routes/doc.routes');
const generateRoutes = require('./routes/generate.routes');
const chatRoutes = require('./routes/chat.routes');

app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('StudyMind AI API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
