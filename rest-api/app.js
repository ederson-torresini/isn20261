const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
