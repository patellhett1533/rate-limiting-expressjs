import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  message: string;
  type: string;
  priority: number;
  sendTime: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    message: { type: String, required: true },
    type: { type: String, required: true },
    priority: { type: String, required: true, enum: ["low", "medium", "high"] },
    send_time: { type: Date, required: true },
    user_id: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
