

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');  // Import email function

const JWT_SECRET = "shubhamisagoodb$oy";
const CLIENT_URL = "http://localhost:3000"; // Change to your frontend URL

// Signup Route with Email Verification
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');  // Generate verification token

        user = new User({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            verificationToken: verificationToken
        });

        await user.save();

        // Send verification email
        const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
        const message = `<h1>Email Verification</h1>
                         <p>Click the link below to verify your email:</p>
                         <a href="${verifyLink}" target="_blank">${verifyLink}</a>`;

        await sendEmail(user.email, "Email Verification", message);
        success = true;

        res.json({ success, message: "Verification email sent. Please verify your email." });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }
});

// Email Verification Route
router.get('/verify-email/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Login Route (Only allow verified users)
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: "Please verify your email before logging in" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
