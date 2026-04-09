import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const aboutTeamSchema = new mongoose.Schema(
  {
    title: { type: String, default: "The People", trim: true },
    heading: { type: String, default: "Meet Our Team", trim: true },
    text: { type: String, default: "The talented individuals behind every Shafi Sons piece.", trim: true },
    members: { type: [memberSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("AboutTeam", aboutTeamSchema);
