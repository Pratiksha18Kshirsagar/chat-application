const express = require('express');
const router = express.Router();
const { addMessage, getMessages } = require('../controllers/chatController');

const authentication = require('../middleware/auth');

router.post('/message', authentication, addMessage);
router.get('/messages', authentication, getMessages);

module.exports = router;    