import { getAuth } from "@clerk/express";
import { sql } from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId || req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Not authorized, authentication required",
      });
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    req.user = {
      id: userId,
    };

    next();
  } catch (error) {
    console.error("Authentication middleware failed:", error);

    return res.status(500).json({
      error: "Authentication failed",
    });
  }
};
