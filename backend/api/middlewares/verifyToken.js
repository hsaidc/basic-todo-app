import jwt from "jsonwebtoken";
import User from "../models/user.js";

const verifyToken = async (req, res, next) => {
  try {
    // Get authorization token from headers
    const userToken = await req.headers.authorization.split(" ")[1].replaceAll('"', "");
    // Verify and decode
    const decodedToken = jwt.verify(userToken, process.env.RANDOM_SEED);
    // Find user information by id buried in token
    const user = await User.findById({ _id: decodedToken.id });

    // Save user details for future use
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ status: false, data: "Invalid token!" });
  }
};

export default verifyToken;
