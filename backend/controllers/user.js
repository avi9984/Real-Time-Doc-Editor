const { User } = require('../models/user');
const brcypt = require('bcrypt');
const { createToken } = require('../services/tokenServices');
const { validEmail, validPwd } = require('../utils/validator')


const register = async (req, res) => {
    try {
        const { username, role, email, password } = req.body;
        if (!(username && email && password)) {
            return res.status(400).json({ status: false, message: "Please enter all fields." });
        }
        if (!validEmail(email)) {
            return res.status(400).json({ status: false, message: 'Invalid email' });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(400).json({ status: false, message: "email already exists." })
        }
        if (!validPwd(password)) {
            return res.status(400).json({
                status: false,
                message: '"Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters'
            });
        }
        const passwordHash = await brcypt.hash(password, 10);
        await User.create({
            username,
            role,
            email: email.toLowerCase(),
            password: passwordHash
        });
        return res.status(201).json({ status: true, message: "User registered successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) return res.status(400).json({ status: false, message: 'Invalid credentials' });

        const isMatch = await brcypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ status: false, message: 'Invalid credentials' });

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
            email: user.email
        };
        const verification = await createToken(req, res, payload);

        // Object to create in UserToken
        const obj = {
            id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            token: verification.token,
        };

        if (verification.isVerified) {
            return res.status(200).json({
                status: true,
                message: 'Login successful',
                data: {
                    id: obj.id,
                    username: obj.username,
                    role: obj.role,
                    email: obj.email,
                    active: 1,
                    token: verification.token,
                },
            });
        } else {
            return res.status(401).json({ status: false, message: 'Unauthorized user!' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}


module.exports = { register, login }