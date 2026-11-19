const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    goal: {
      type: String,
      enum: ['lose-fat', 'gain-stamina', 'gain-weight'],
      required: true
    },
    experience: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    dob: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      required: true
    },
    currentWeight: {
      type: Number,
      required: true
    },
    targetWeight: {
      type: Number,
      required: true
    },
    bmi: {
      type: Number
    }
  },
  { timestamps: true }
);


userSchema.pre('save', function () {
  if (this.height && this.currentWeight) {
    const heightInMeters = this.height / 100;
    this.bmi = Number((this.currentWeight / (heightInMeters * heightInMeters)).toFixed(1));
  }
});

userSchema.post('save', function (doc) {
  try {
    console.log(`User ${doc.email} has been saved to the database.`);
  } catch (error) {
    console.error('Error in post-save hook: db connection failed', error);
  }
});

module.exports = mongoose.model('User', userSchema);