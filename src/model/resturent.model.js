import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Schema } from "mongoose";
const restaurantSchema = Schema({
    name: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    menus:[
        {
            required:false,
            type:Schema.Types.ObjectId,
            ref:"Menu"
        }
    ]

}, {
    timestamps: true
});

// Password hashing middleware
restaurantSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare password
restaurantSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


export const Restaurant = mongoose.model('Restaurant', restaurantSchema);