import express from "express"
import templateRoute from './api/template'
import chatRoute from './api/chat'
import authRoute from './auth'
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://browz.vercel.app"
];

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use('/api/template', templateRoute)
app.use('/api/chat', chatRoute)
app.use('/auth', authRoute)

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });