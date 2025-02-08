# Distributed Notification and Alert System

## Objective

The goal of this project is to build a backend system that can manage and deliver notifications
based on user preferences and rules. The system supports immediate notifications, scheduled alerts,
personalized delivery times, and query-driven notification logic.

## Project Structure

This system is designed to include multiple components that handle different tasks:

1. **Notification Ingestion and Validation Service**
2. **Notification Processing and Scheduling Engine**
3. **User Preferences and Rules Storage**
4. **Query Requirements and Logic**
5. **Notification Delivery Service**
6. **Containerization and Deployment**
7. **Bonus: Analytics and Monitoring Dashboard API**

### Key Technologies

- **Node.js / Go**: Backend service for handling notification logic.
- **Kafka**: Message broker for asynchronous processing of notifications.
- **MongoDB**: Database for storing user preferences, notification details, and logs.
- **Elasticsearch**: Used for efficient searching and filtering of notifications.
- **Docker**: Containerization for deploying services in isolated environments.
- **Docker Compose**: For orchestrating and managing multiple services.

## Task Breakdown

### 1. **Notification Ingestion and Validation Service**

- **Endpoint**: `/notify` API endpoint implemented in Node.js.
- **Functionality**: Receives notification requests with details like message, time, and other
  relevant fields.
- **Kafka Integration**: After validation, the notification request is published to a Kafka topic
  (`notifications`) for further processing.

### 2. **Notification Processing and Scheduling Engine**

- **Real-Time Notifications**: Notifications with no scheduled `send_time` are processed
  immediately.
- **Scheduled Notifications**: Notifications with a `send_time` are stored in MongoDB, and a
  scheduler periodically checks for pending notifications to move them to the delivery queue.

### 3. **User Preferences and Rules Storage**

- **MongoDB**:
  - Stores user preferences like preferred notification channels, quiet hours, and notification
    limits.
  - Stores notification details like message, type, priority, `send_time`, and user ID.
- **Elasticsearch**:
  - Stores notification content for fast querying based on various fields such as message type,
    priority, and time.

### 4. **Query Requirements**

- **Throttling Notifications**: Restrict notifications based on user-defined limits. If the limit is
  exceeded, discard or defer the notification.
- **Quiet Hours Filtering**: Prevent notifications during user-defined quiet hours. If a
  notification falls within quiet hours, it is rescheduled.
- **Deduplication of Similar Alerts**: Prevent sending identical notifications (e.g., error
  messages) if they’ve been sent recently.
- **Scheduled Notification Aggregation**: Aggregate low-priority notifications due within the same
  hour into a single summary message.
- **Urgent Alerts in Real Time**: Prioritize and immediately process urgent alerts, bypassing
  scheduling.

### 5. **Notification Delivery Service**

- **Channels**:
  - Email: Mock email service for simulating email notifications.
  - SMS: Mock SMS service for delivering SMS notifications.
  - Push Notifications: Simulated push notifications for mobile or web apps.
- **Retry Mechanism**: Implemented for handling failed delivery attempts.
- **Logging**: Delivery statuses are recorded in MongoDB for tracking purposes.

### 6. **Containerization and Deployment**

- **Docker Setup**: All services (Node.js, MongoDB, Kafka, Elasticsearch) are Dockerized to run in
  isolated containers.
- **Docker Compose**: A `docker-compose.yml` file is provided to enable easy deployment of all
  services with predefined configurations.

### 7. **Bonus: Analytics and Monitoring Dashboard API**

- **Endpoint**: `/analytics` provides the following insights:
  - **Delivery Stats**: Includes total notifications sent, failed, and retried.
  - **User Engagement**: Average delivery time and response rate.

## How to Run the Project

### Prerequisites

- Docker and Docker Compose installed.

### Steps to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/your-repository/notification-system.git
   cd notification-system
   ```
