const UserModel = require("../modles/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        console.log('Starting signup for:', email);
        const existingUser = await UserModel.findOne({email});
        if (existingUser) {
            console.log('User already exists');
            return res.status(409).json({
                message: "User already exists with this email",
                success: false
            });
        }
        
        console.log('Hashing password...');
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('Creating new user...');
        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        console.log('User saved successfully');
        
        return res.status(201).json({
            message: "Signup successful",
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });
        
    } catch (err) {
        console.error('Signup error:', err.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        console.log('Login attempt for:', email);
        
        // Check if JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({
                message: "Internal server error",
                success: false
            });
        }
        
        // Find user by email
        const user = await UserModel.findOne({email});
        
        if (!user) {
            console.log('User not found');
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        
        console.log('User found, comparing passwords...');
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Password invalid');
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        
        console.log('Generating token...');
        
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
        
        console.log('Token generated successfully');
        
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
        console.error('Login error:', err.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {signup, login};