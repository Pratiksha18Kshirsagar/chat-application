const chatModel = require('../models/chat');

const addMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;
        console.log('User ID from auth middleware:', userId);
        const newMessage = await chatModel.create({ message, userId });

        res.status(201).json({ message: 'Message added successfully', data: newMessage });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await chatModel.findAll({});
        res.status(200).json({ data: messages });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addMessage,
    getMessages
};
