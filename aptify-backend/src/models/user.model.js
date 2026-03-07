import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "username already taken"],
      required: true,
    },

    email: {
      type: String,
      unique: [true, "Account already exists with this email address"],
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },

  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
