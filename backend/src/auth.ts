import express, { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

router.post("/signup", (async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" })

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser)
      return res.status(400).json({ error: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash: hashedPassword },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User created successfully"})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})as RequestHandler)


router.post("/login", (async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" })
  
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(401).json({ error: "Invalid credentials" })
  
      const ok = await bcrypt.compare(password, user.passwordHash)
      if (!ok) return res.status(401).json({ error: "Invalid credentials" })
  
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
      );

      console.log("token: " + token)

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({ message: "Login successful", token})
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Server error", err })
    }
})as RequestHandler)

  
router.get("/me", (async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: "there is no token present" });

    const secret = process.env.JWT_SECRET as string | undefined
    if (!secret) return res.status(500).json({ user: null, error: "Missing JWT secret" })
    const decoded = jwt.verify(token, secret) as { id: string }
    res.json({ user: decoded });
})as RequestHandler)

export default router