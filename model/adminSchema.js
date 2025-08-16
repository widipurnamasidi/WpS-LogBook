import mongoose from "mongoose";

const adminScema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("adminSchema", adminScema, "admin");
