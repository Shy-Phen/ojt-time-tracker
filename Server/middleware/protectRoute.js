import { getAuth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const protectRoute = async (req, res, next) => {
  try {
    const auth = getAuth();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session?.user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    console.log("hfrhferghfiouerh");

    req.userId = session.user.id;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
