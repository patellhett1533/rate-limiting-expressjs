import mongoose from "mongoose";

export interface NodeModel {
  type: string;
  data: {
    text: string;
    action: string;
  };
  position: { x: number; y: number };
}

export interface EdgeModel {
  source: mongoose.Schema.Types.ObjectId;
  target: mongoose.Schema.Types.ObjectId;
}

export interface FlowModel {
  name: string;
  visibility: "Public" | "Private";
  user_id: mongoose.Schema.Types.ObjectId;
}
