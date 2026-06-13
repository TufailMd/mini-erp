const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const User = require("./models/User.js");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route");
const auditRoutes = require(
  "./routes/audit.route.js"
);

app.use("/audit-logs", auditRoutes);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get("/test", async (req, res) => {
  const users = await User.find();
  res.json(users);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));