const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
 
const connectDB = require('./config/db');
 
dotenv.config();
 
connectDB();
 
const app = express();
 
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/diaries', require('./routes/diaryRoutes'));
 
// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Any route that doesn't match the API, send the index.html
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
    );
}

const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});