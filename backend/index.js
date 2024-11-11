const express = require('express')
const moment = require('moment'); // Use moment.js for easy date formatting
const app = express()
const jwt = require('jsonwebtoken');
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const { User, Attendance } = require('./db')
const authMiddleware = require('./authMiddleware');
const { JWT_SECRET } = require('./config');


app.use(cors())
app.use(express.json())

app.post('/api/v1/signup', async(req, res) => {
    const { username, email, password } = req.body;

    try {
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password, // Remember to hash the password in a real application
      });
      await newUser.save();
  
      // Create initial attendance record for the new user
      const initialAttendance = new Attendance({
        userId: newUser._id,
        status: "present", // Mark as present by default
        date: Date.now() // Set the current date as the attendance date
      });
      await initialAttendance.save();
  
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
     
    res.status(201).json({
      message: "User created successfully",
      token
    });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
});



app.post('/api/v1/signin', async(req, res) => {
    const {email, password} = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
    
        // Generate a JWT
        const token = jwt.sign({ userId: user._id },JWT_SECRET, { expiresIn: '1d' });
        
        res.status(200).json({
          message: "User signed in successfully",
          token
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

app.get('/api/v1/users', async(req, res) => {
    try{
        const users = await User.find().select("-password")
        if(users.length === 0){
            res.status(200).json({
                message:"No users currently"
            })
        }
        res.status(200).json(users)
    }catch{
        res.status(500).json({
            message:"error in fetching users"
        })
    }
})


app.get('/api/v1/attendance_bulk', async (req, res) => {
    try {
      const attendanceCounts = await Attendance.aggregate([
        {
          $match: {
            status: "present" // Only include records where the status is "present"
          }
        },
        {
          $group: {
            _id: "$userId",
            totalAttendance: { $count: {} }, // Count the number of "present" attendance records for each user
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
        {
          $project: {
            _id: 0,
            userId: "$userInfo._id",
            name: "$userInfo.name",
            email: "$userInfo.email",
            totalAttendance: 1,
          },
        },
      ]);
  
      res.status(200).json(attendanceCounts);
    } catch (error) {
      console.error("Error fetching total attendance:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  


app.post('/api/v1/mark',authMiddleware , async(req, res) => {

    const { status } = req.body;
    const userId = req.userId; // userId is set by authMiddleware
  
  const today = moment().startOf('day'); // Get the current date (start of the day)

  try {
    // Check if attendance has already been marked today
    const existingAttendance = await Attendance.findOne({
      userId,
      createdAt: { $gte: today.toDate() }, // Check for any attendance records created today
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "You have already marked your attendance for today.",
      });
    }

    // Create a new attendance record if not already marked
    const newAttendance = new Attendance({
      userId,
      status,
    });

    // Save the attendance record
    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error: Unable to mark attendance",
    });
  }
});


app.listen(3000)
console.log("Listening on http://localhost:3000")