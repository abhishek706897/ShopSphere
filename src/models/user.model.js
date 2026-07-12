const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "India",
        },
    },
    { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
      default: "",
    },

    address: addressSchema,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);