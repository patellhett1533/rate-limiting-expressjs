import { MongoClient } from "mongodb";
import { consumer } from "../config/kafka";

const mongoClient = new MongoClient("mongodb://localhost:27017");
const dbName = "notifications_db";

const processNotifications = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "notifications", fromBeginning: true });

  await mongoClient.connect();
  const db = mongoClient.db(dbName);
  const collection = db.collection("scheduled_notifications");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message?.value?.toString() as string);

      if (notification.priority === "high" || !notification.send_time) {
        // Process immediately
        console.log("Sending immediate notification:", notification.message);
      } else {
        // Schedule for later
        await collection.insertOne(notification);
        console.log("Scheduled notification:", notification.message);
      }
    },
  });
};

processNotifications().catch(console.error);
