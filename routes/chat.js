const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.post("/send", async (req, res) => {
  try {
    const message = new Message({
      sender: req.body.sender,
      recipient: req.body.recipient,
      message: req.body.message,
      timestamp: new Date(),
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:senderId/:recipientId", async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
