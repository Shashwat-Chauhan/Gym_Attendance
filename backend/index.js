const express = require('express')
const app = express()
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const { User, Attendance } = require('./db')


app.use(cors())
app.use(express.json())

app.post('/api/v1/signup', async(req, res) => {
    const {username , email, password} = req.body;

    try{if(!username || !email || !password){
        res.status(400).json({
            message:"Please provide all fields"
        })
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(400).json({
            message:"Email already exists"
        })
    }

    const newUser = new User({
        username: username,
        email: email,
        password: password
    })
    await newUser.save();

    res.status(201).json({
        message:"User created successfully"
    })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})

app.post('/api/v1/signin', async(req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email})
    if(!user){
        res.status(500).json({
            message:"User not found"
        })
    }
    if (password == user.password){
        res.status(200).json({
            message:"login successfull"
        })
    }
})

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


app.get('/api/v1/attendance_bulk', async(req, res) => {
    try {
        const attendanceCounts = await Attendance.aggregate([
          {
            $group: {
              _id: "$userId",
              totalAttendance: { $count: {} }, // Count the number of attendance records for each user
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


app.post('/api/v1/mark', (req, res) => {
    const {userId ,status} = req.body; // Extract from the JWT by middleware
    const user = User.findOne({userId})
    if(!user){
        res.status(500).json({
            message: "User not Found"
        })
    }
    try{
        const today = new Date()
        const newAttendance = new Attendance({
            userId,
            status
        })

        newAttendance.save()
        res.status(201).json({
            message: "Attendace marked successfully",
            attendance: newAttendance
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message:"Server Error"
        })
    }
})


app.listen(3000)
console.log("Listening on http://localhost:3000")