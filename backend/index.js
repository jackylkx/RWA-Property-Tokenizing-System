const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: '../.env' });
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

//mongodb+srv://sa:*****@cluster0.rj3fd.mongodb.net/Property?retryWrites=true&w=majority&appName=Cluster0
//mongodb://127.0.0.1:27017/Property
// Connect to MongoDB
console.log('REACT_APP_MONGO_URI' + process.env.REACT_APP_MONGO_URI);

mongoose.connect(process.env.REACT_APP_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors()); // This will allow requests from any origin

// Optionally, you can configure it for specific origins
app.use(cors({
  origin: '*', // Allow only this origin
  methods: '*',
}));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/properties', require('./routes/propertiesRoutes'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});