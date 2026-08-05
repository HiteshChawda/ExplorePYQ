import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase:true
        },
        fullName:{
            type: String,
            required: true,
            index: true
        },
        
        password: {
            type: String,
            required: [true ,"Password is required"]
        },
        refreshToken:{
            type: String,   
        }

    },
    {timestamps: true}
)

userSchema.pre("save", async function(){
    if(!this.isModified("password")) 
        return;
        //  no next() because newer version of mongoose use promises,i.e// In async Mongoose middleware, don't use next(); returning/resolving the Promise automatically continues execution.

    this.password = await bcrypt.hash(this.password, 10)
    // next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
    
}



userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,

        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES 
        }
    )
}



userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,

        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES 
        }
    )
}

export const User = mongoose.model("User", userSchema)