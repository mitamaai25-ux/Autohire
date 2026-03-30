const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/data', (req, res) => {
  const data = {
    message: 'Hello from the backend!',
  };

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
