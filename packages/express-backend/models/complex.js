import mongoose from "mongoose";

const ComplexSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { collection: "complexes" }
);

const Complex = mongoose.model("Complex", ComplexSchema);

export default Complex;
