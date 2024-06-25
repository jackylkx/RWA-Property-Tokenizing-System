const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/properties', require('./routes/propertiesRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});