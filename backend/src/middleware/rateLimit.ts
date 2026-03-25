const usage = new Map<string, { count: number; date: string }>();

const LIMIT = 10;

export const rateLimitPerUser = (req: any, res: any, next: any) => {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const user = usage.get(userId);

    if (!user || user.date !== today) {
        usage.set(userId, { count: 1, date: today });
        return next();
    }

    if (user.count >= LIMIT) {
        return res.status(429).json({
            error: "Daily limit reached",
        });
    }

    user.count++;
    next();
};
