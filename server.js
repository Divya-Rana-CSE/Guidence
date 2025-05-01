// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const cors = require('cors');

// app.use(cors({
//   origin: 'http://127.0.0.1:5500', // change this to the frontend port you're using
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type']
// }));

// // Get all comments
// app.get('/api/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find().sort({ timestamp: -1 }); // latest first
//     res.json(comments);
//   } catch (err) {
//     res.status(500).send('Error fetching comments');
//   }
// });


// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/mbti-comments', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const CommentSchema = new mongoose.Schema({
//   mbti: String,
//   text: String,
//   timestamp: { type: Date, default: Date.now },
// });

// const Comment = mongoose.model('Comment', CommentSchema);

// // Save comment
// app.post('/api/comments', async (req, res) => {
//   const { mbti, text } = req.body;
//   if (!mbti || !text) return res.status(400).send('Missing data');

//   try {
//     const newComment = new Comment({ mbti, text });
//     await newComment.save();
//     res.status(200).send('Comment saved!');
//   } catch (err) {
//     res.status(500).send('Error saving comment');
//   }
// });

// // Start server
// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
