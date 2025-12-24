import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    console.log("userId:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
