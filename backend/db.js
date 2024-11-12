const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://admin:1NHGS8SRzWsZBtDO@blogging.fo1wymr.mongodb.net/")

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:1,
        maxlength:100,
    },
    password: {
        type:String,
        required:true,
        minlength:1
    },
    username: {
        type:String,
        required:true,
        trim:true,
        minlength:1,
        maxlength:100
    }
})


const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    status:{
        type:String,
        enum: ["present", "absent"],
        default:'absent'
    },
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
const Attendance = mongoose.model('Attendance', attendanceSchema)

module.exports = {
    User,
    Attendance
};
