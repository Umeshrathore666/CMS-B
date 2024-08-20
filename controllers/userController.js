// // Backend/controllers/userController.js

// import User from '../models/User.js'; // Import the User model
// import bcrypt from 'bcryptjs'; // For password hashing
// import jwt from 'jsonwebtoken'; // For generating JWT tokens

// // Register a new user
// export const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create a new user
//         const user = await User.create({ name, email, password: hashedPassword });

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Send the response with the token
//         res.status(201).json({ result: user, token });
//     } catch (error) {
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// };

// // Login user
// export const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the password is correct
//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: 'Invalid Password' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Send the response with the token
//         res.status(200).json({ result: user, token });
//     } catch (error) {
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// };

// // Get user details
// export const getUserDetails = async (req, res) => {
//     try {
//         const user = await User.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// };

// // Update user details
// export const updateUserDetails = async (req, res) => {
//     const { name, email } = req.body;

//     try {
//         const updatedUser = await User.findByIdAndUpdate(req.userId, { name, email }, { new: true });
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// };
