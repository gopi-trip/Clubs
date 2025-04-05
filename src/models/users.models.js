import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new Schema(
    {
        fullName: {
          type: String,
          required: [true, "Full name is required"],
          trim: true,
          index: true
        },
        email: {
          type: String,
          required: [true, "Email is required"],
          unique: true,
          lowercase: true,
          trim: true,
          match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please provide a valid email"
          ]
        },
        phoneNumber: {
          type: String,
          required: [true, "Phone number is required"],
          trim: true,
          match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"]
        },
        enrollmentNumber: {
          type: String,
          required: [true, "Enrollment number is required"],
          unique: true,
          trim: true
        },
        courseType: {
          type: String,
          required: [true, "Course type is required"],
          enum: ["B.Tech", "M.Tech", "Ph.D", "MCA", "MSc"]
        },
        semester: {
          type: Number,
          required: [true, "Semester is required"],
          min: 1,
          max: 10
        },
        year: {
          type: Number,
          required: [true, "Year is required"],
          min: 1,
          max: 5
        },
        idCard: {
          type: String,
          required: [true, "ID card image is required"]
        },
        clubs: [{
          type: String,
          enum: ["QUBIT", "Cygnus", "Pixel", "Inertia", "Reverb Collective", "Sports"]
        }],
        password: {
          type: String,
          required: [true, "Password is required"],
          minlength: [8, "Password must be at least 8 characters long"],
          select: false  // Password won't be included in query results by default
        },
        refreshToken: {
          type: String
        }
      },
      {
        timestamps: true
      }
)

// Pre-save middleware to hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
  
  // Method to check if password is correct
  userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  // Method to generate access token
  userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        enrollmentNumber: this.enrollmentNumber
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );
  };
  
  // Method to generate refresh token
  userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      {
        _id: this._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    );
  };


export const User = mongoose.model("User",userSchema)