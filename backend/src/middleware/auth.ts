import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        req.user = decoded;
        next();

    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
