# nodejs-expressjs-websocket-jwt-chat-realtime-task-management
The demo how to implement realtime update with websocket in nodejs and expressjs
To set up and run the project, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/minhsong/nodejs-expressjs-websocket-jwt-chat-realtime-task-management.git
    ```

# ReactJS with TailwindCSS


To set up the front-end ReactJS app, follow these steps:

  Update the `.env` file with your own configuration values:

  ```
  REACT_APP_API_URL=http://localhost:4000
  ```

  Navigate to the `front-end` directory:
        ```
        cd front-end
        ```

  Install the dependencies:
        ```
        npm install
        ```

  Start the development server:
        ```
        npm start
        ```

  Open your browser and visit `http://localhost:3000` to see the React app in action.


# Node.js Express Backend Project with Firebase and Websocket

This project is a Node.js Express backend application integrated with Firebase for user authentication and real-time database functionalities.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed on your machine.
- Firebase project set up with Firestore.
- Firebase Admin SDK service account key downloaded.

Here is the formatted content for your README.md file:

## Setup Instructions

### 2. Install Dependencies
Install the project dependencies by running:
```
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of the project directory by copying from the provided `.env.example` file:
```
cp .env.example .env
```
Update the `.env` file with your own configuration values:
```env
PORT=4000
DATABASE_URL=https://<project id>.firebaseio.com
TOKEN_EXPIRE_TIME=15d
JWT_SECRET=your_jwt_secret

#SMTP EMAIL CONFIG
EMAIL_FROM_ADDRESS==your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_SMTP_USER=your-email@example.com
EMAIL_SMTP_DOMAIN=smtp.example.com
EMAIL_SMTP_PORT=587

```

### 4. Add Firebase Configuration
Download your Firebase Admin SDK service account key and save it in the root of the project directory as `serviceAccountKey.json`.

### 5. Update Initial Admin User
Open `seed.js` and update the initial admin user details:
```
const email = 'admin@example.com'; // Replace with your admin email
const password = 'adminpassword'; // Replace with your admin password
```

### 6. Seed the Initial Admin User
Run the following command to seed the initial admin user:
```
node seed.js
```

### 7. Start the Server
Start the Express server by running:
```
npm start
```
The server should now be running on [http://localhost:4000](http://localhost:4000).






