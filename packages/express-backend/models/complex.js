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

export default mongoose.model("Complex", ComplexSchema);;
