import { producer } from "../config/kafka";

export class KafkaService {
  async publish(topic: string, message: any) {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
