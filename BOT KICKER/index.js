const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ For browser visit (e.g., health check)
app.get("/", (req, res) => {
  res.send("✅ Friend checker backend is running");
});

// ✅ Roblox POST call
app.post("/check-friends", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).send("Missing userId");

  try {
    const response = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`);
    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      return res.status(500).send("Invalid Roblox API response");
    }

    const friendCount = data.data.length;
    console.log(`✅ User ${userId} has ${friendCount} friends`);
    res.json({ friends: friendCount });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).send("Error contacting Roblox");
  }
});

// ✅ Must bind to correct port for Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
