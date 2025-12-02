const UserModel = require("../modles/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        console.log('[SIGNUP] Starting signup process');
        const {name, email, password} = req.body;
        console.log('[SIGNUP] Name:', name, 'Email:', email);
        
        // Check if user already exists
        console.log('[SIGNUP] Checking for existing user...');
        const existingUser = await UserModel.findOne({email});
        if (existingUser) {
            console.log('[SIGNUP] User already exists');
            return res.status(409).json({
                message: "User already exists with this email",
                success: false
            });
        }
        
        console.log('[SIGNUP] Hashing password...');
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('[SIGNUP] Creating new user...');
        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        console.log('[SIGNUP] User saved successfully');
        
        return res.status(201).json({
            message: "Signup successful",
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });
        
    } catch (err) {
        console.error('[SIGNUP ERROR] Full error:', err);
        console.error('[SIGNUP ERROR] Error message:', err.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        console.log('[LOGIN] Starting login process');
        const {email, password} = req.body;
        console.log('[LOGIN] Email:', email);
        
        // Check if JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error('[LOGIN ERROR] JWT_SECRET is not configured!');
            return res.status(500).json({
                message: "Server configuration error - JWT_SECRET missing",
                success: false
            });
        }
        
        // Find user by email
        console.log('[LOGIN] Searching for user in database...');
        const user = await UserModel.findOne({email});
        
        if (!user) {
            console.log('[LOGIN] User not found');
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        
        console.log('[LOGIN] User found, comparing passwords...');
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('[LOGIN] Password invalid');
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        
        console.log('[LOGIN] Password valid, generating token...');
        
        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );
        
        console.log('[LOGIN] Token generated successfully');
        
        return res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
        
    } catch (err) {
        console.error('[LOGIN ERROR] Full error:', err);
        console.error('[LOGIN ERROR] Error message:', err.message);
        console.error('[LOGIN ERROR] Error stack:', err.stack);
        
        // Check for specific error types
        if (err.name === 'MongooseError' || err.name === 'MongoError') {
            return res.status(500).json({
                message: "Database connection error",
                success: false,
                error: err.message
            });
        }
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(500).json({
                message: "Token generation error",
                success: false,
                error: err.message
            });
        }
        
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

module.exports = {signup, login};