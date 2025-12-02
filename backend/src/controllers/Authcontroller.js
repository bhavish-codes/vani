const UserModel = require("../modles/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        
        // Check if user already exists
        const existingUser = await UserModel.findOne({email});
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email",
                success: false
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        
        return res.status(201).json({
            message: "Signup successful",
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });
        
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        // Find user by email
        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        
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
        console.error('Login error:', err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {signup, login};