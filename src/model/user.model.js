import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import autoIncrement from 'mongoose-sequence';
import ApiError from "../utills/apiError.js";

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        index: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    userType: {
        type: String,
        enum: ["Customer", "Admin", "Delivery"],
        required: true
    },
    userPassword: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Add auto-increment plugin for userId
userSchema.plugin(autoIncrement(mongoose), {
    id: 'user_seq', // Unique identifier for this auto-increment sequence
    inc_field: 'userId', // The field to increment
    start_seq: 1000 // Optional: start from 1000 to give a more professional look
});

userSchema.pre("save", async function(next) {
    // Hash password only if it's modified
    if(!this.isModified("userPassword")) return next();
    
    try {
        this.userPassword = await bcrypt.hash(this.userPassword, 10);
        next();
    } catch (err) {
        return next(new ApiError(500, "Error hashing password"));
    }
});

userSchema.methods.isPasswordCorrect = async function(userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.userPassword);
    } catch (err) {
        throw new ApiError(400, "Password comparison failed");
    }
};

export const User = mongoose.model("User", userSchema);