// backend/src/index.js
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.send('GiftWise backend OK'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
