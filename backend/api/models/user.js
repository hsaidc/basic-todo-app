import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name as it is on your official ID!"],
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: [true, "Please provide a valid e-mail address!"],
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: [true, "Your pass does not comply our rules!"],
    max: 1024,
    min: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
