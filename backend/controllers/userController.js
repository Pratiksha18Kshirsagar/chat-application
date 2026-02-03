const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
        const newUser = await UserModel.create({
            Name: name,
            Email: email,
            Phone: phone,
            Password: hashedPassword
        });
        
        // console.log(newUser.dataValues)
        res.status(201).json({ message: "User created successfully", user: newUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await UserModel.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, email: user.Email }, 'secretKey', { expiresIn: '1h' });
        
        res.status(200).json({ message: "Login successful", user , token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during login" });
    }
};

module.exports = {
    addUser,
    login
};
