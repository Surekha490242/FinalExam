const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If email is already registered, send a 400 status with a message
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // If email is not registered, proceed to create a new user
        const user = new User({ name, email });
        await user.save();

        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
