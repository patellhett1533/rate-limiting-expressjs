import { producer } from "../config/kafka";
import { SendNotification } from "../interfaces/notification.interface";
import { KafkaService } from "./kafka.service";
import Notification from "../models/notification.model";

const kafkaService = new KafkaService();

const sendNotification = async ({ message, priority, send_time }: SendNotification) => {
  await producer.connect();
  await producer.send({
    topic: "notifications",
    messages: [{ value: JSON.stringify({ message, priority, send_time }) }],
  });
  await Notification.create({ message, type: "test", priority, send_time, user_id: "123" });
  await producer.disconnect();
};

export default { sendNotification };
