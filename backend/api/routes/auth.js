import express from "express";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

// Auxiliary Packages
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Authentication Middleware
import verifyToken from "../middlewares/verifyToken.js";

// Models
import User from "../models/user.js";
import Token from "../models/token.js";

// Create router
const router = express.Router();

// Auxiliary Functions
/**
 * Asynchronously creates and configures a Nodemailer transport object.
 *
 * This function sets up a Nodemailer transport using SMTP server details specified in environment variables.
 * It's designed to facilitate the sending of emails from within the application, leveraging the security and
 * flexibility provided by externalizing configuration details to the environment.
 *
 * Environment Variables Required:
 * - SMTP_HOST: The hostname of the SMTP server.
 * - SMTP_PORT: The port on which the SMTP server is running.
 * - SMTP_USER: The username for SMTP server authentication.
 * - SMTP_USER_PASS: The password for SMTP server authentication.
 *
 * Note: Ensure that the required environment variables are set before invoking this function.
 *
 * @returns {Promise<nodemailer.Transporter>} A promise that resolves to a configured Nodemailer transport object.
 * @async
 */
const createNodemailerTransport = async () => {
  // Configurations should be transferred to .env file in the future!
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_USER_PASS,
    },
  });

  return transporter;
};

/**
 * Sends a password reset email to a user.
 *
 * This function asynchronously sends an email to the user with a link to reset their password. The link
 * contains a token that is valid for 30 minutes. It uses a pre-configured Nodemailer transport object for
 * sending the email. The function constructs the email body with the reset link, sets the email parameters
 * including the sender and receiver's email addresses, subject, and the HTML body. It logs the email parameters
 * and the response received from the Nodemailer's `sendMail` method. If the email is successfully sent, it
 * returns an object with a status of true and the response data. In case of failure, it returns an object with
 * a status of false and an error message.
 *
 * Environment Variables Used:
 * - BASE_URL: The base URL of the application, used to construct the password reset link.
 * - FROM_EMAIL_NAME: The name of the sender, appearing in the "From" field of the email.
 * - FROM_EMAIL: The email address of the sender.
 *
 * @param {Object} params - The parameters for sending the email.
 * @param {string} params.token - The password reset token to be included in the reset link.
 * @param {string} params.email - The recipient's email address.
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success status and response data or error message.
 * @async
 */
const sendEmail = async (params) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = await createNodemailerTransport();

    // Create email body
    let body = `Click the following link to reset your password. It will expire in 30 minutes! <br> \
    <a href='${process.env.BASE_URL}/reset-password?token=${params.token}'>${process.env.BASE_URL}/reset-password?token=${params.token}</a> <br><br> \
    Kind regards, <br>
    NGSolutions.`;

    // Create email params
    const emailParams = {
      from: `"${process.env.FROM_EMAIL_NAME}" <${process.env.FROM_EMAIL}>`, // sender address
      to: params.email, // list of receivers
      subject: "Request to reset your password!", // Subject line
      html: body, // html body
    };

    // send mail with defined transport object
    const res = await transporter.sendMail(emailParams);

    return { status: true, data: res };
  } catch (err) {
    return { status: false, data: "Failed to send e-mail. Please try again later!" };
  }
};

// Routes
/**
 * Handles the user registration process.
 *
 * This endpoint (`/register`) receives user registration data (password, name, email) via a POST request,
 * validates the input to ensure no required field is missing, checks if a user with the provided email
 * already exists, hashes the password using bcrypt, creates a new user record in the database, and finally,
 * generates a JWT token for the newly registered user. The function responds with the user ID and token
 * if registration is successful, or an error message if any step fails.
 *
 * @param {Object} req - The request object containing user data in `req.body`.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @async
 */
router.post("/register", async (req, res) => {
  try {
    let { password, name, email } = req.body;

    // Check if there is any missing value
    if (!password | !name | !email) throw new Error("Either pass, name or email is missing!");

    // Check if user already exists
    let user = await User.findOne({ email: email });
    if (user) throw new Error("User already exists!");

    // Hash password before saving it to the database after salting in 10 rounds
    let hashedPass = await bcrypt.hash(password, 10);

    // Create User object to save in the database
    let newUser = new User({
      name: name,
      email: email,
      password: hashedPass,
    });

    try {
      await newUser.save();
    } catch (err) {
      throw new Error("Failed to save user in the database!");
    }

    // Create an authentication token to log user in after registration
    let token;
    try {
      token = jwt.sign({ id: newUser._id }, process.env.RANDOM_SEED, { expiresIn: "12h" });
    } catch (signError) {
      // Handle token signing errors specifically
      throw new Error("Failed to generate authentication token.");
    }

    res.status(201).send({
      status: true,
      data: { message: "User created successfully!", userID: newUser._id, token: token },
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      data: err.message,
    });
  }
});

/**
 * Handles the user login process.
 *
 * This endpoint (`/login`) receives user login data (email and password) via a POST request. It first attempts
 * to find the user in the database using the provided email. If the user does not exist, or if the provided
 * password does not match the one stored in the database (using bcrypt for comparison), an error is thrown.
 * Upon successful authentication, it generates a JWT token with a 12-hour expiration, using the user's ID and
 * a secret key from environment variables. The function responds with the user ID and token if login is successful,
 * or an error message if authentication fails.
 *
 * @param {Object} req - The request object containing user login data in `req.body`.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @async
 */
router.post("/login", async (req, res) => {
  try {
    // Find user in the database using email, If user does not exist, throw an error
    const user = await User.findOne({ email: req.body.email });
    // Do not provide detailed error messages to the client if it does not exists
    if (!user) throw new Error("Either e-mail or password is wrong");

    // Compare saved password and provided password
    const passwordCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passwordCheck) throw new Error("Either e-mail or password is wrong!");

    // Create authentication token
    let token;
    try {
      token = jwt.sign({ id: user._id }, process.env.RANDOM_SEED, { expiresIn: "12h" });
    } catch (signError) {
      // Handle token signing errors specifically
      throw new Error("Failed to generate authentication token.");
    }

    res.status(200).send({ status: true, data: { userID: user._id, token: token } });
  } catch (err) {
    res.status(400).send({ status: false, data: err.message });
  }
});

/**
 * Verifies the user's authentication token.
 *
 * This endpoint (`/verify-token`) is protected by the `verifyToken` middleware, which validates
 * the JWT token provided in the request headers. If the token is valid, the middleware adds the
 * authenticated user's information to `req.user`. This route handler then responds with a 200 status
 * code and the user's ID. If any error occurs during token verification or within the route handler,
 * it responds with a 500 status code and an error message indicating an internal server error.
 *
 * @param {Object} req - The request object, expected to have a valid JWT token and user information added by `verifyToken` middleware.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @async
 */
router.get("/verify-token", verifyToken, async (req, res) => {
  try {
    return res.status(200).json({ status: true, userID: req.user._id });
  } catch (err) {
    res.status(500).send({ status: false, data: "Internal server error!" });
  }
});

/**
 * Initiates the password reset process for a user.
 *
 * This endpoint (`/initiate-password-reset`) receives a POST request containing the user's email address.
 * It performs several checks to ensure the request is valid: it verifies that the user exists, prevents
 * abuse by checking if a password reset token was already created within the last 10 minutes, and then
 * generates a new JWT token that expires in 30 minutes for the password reset process. This token is saved
 * in the database to manage password reset requests. Finally, it attempts to send a password reset link to
 * the user's email. If any step fails, an appropriate error message is returned.
 *
 * @param {Object} req - The request object, containing the user's email in `req.body.email`.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @async
 */
router.post("/initiate-password-reset", async (req, res) => {
  try {
    // Check if user exists. If user does not exist, throw an error
    let user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found!");

    // Check if user created a password reset token in 10 minutes to prevent any misuse
    let dateFilter = new Date(new Date().getTime() - 10 * 60 * 1000); // 10 minutes ago
    let previouslyCreatedTokens = await Token.find({ userId: user._id, createdAt: { $gte: dateFilter } });
    if (previouslyCreatedTokens.length > 0)
      throw new Error("Please wait and try again later! You can only request once in 10 minutes!");

    // Create a jwt token that expires in 30 minuts
    let token;
    try {
      token = jwt.sign({ id: user._id, email: user.email }, process.env.RANDOM_SEED, { expiresIn: 60 * 30 });
    } catch (signError) {
      // Handle token signing errors specifically
      throw new Error("Failed to generate authentication token.");
    }
    // Save token in the database to prevent multiple password reset requests
    let newToken = new Token({ token: token, status: "active", userId: user._id });
    try {
      await newToken.save();
    } catch (err) {
      throw new Error("Failed to save token in the database! Try again.");
    }

    // Send password reset link to user
    let sendEmailResponse = await sendEmail({ email: user.email, token: token });
    if (sendEmailResponse.status === false) throw new Error("Failed to send email!");

    res.status(200).send({ status: true, data: "Password reset initiated!" });
  } catch (err) {
    res.status(400).send({ status: false, data: err.message });
  }
});

/**
 * Handles the password reset process.
 *
 * This endpoint (`/reset-password`) receives a PUT request with a password reset token in the query string
 * and the new password in the request body. It performs several steps to securely reset the user's password:
 * - Validates the presence of the token and the new password in the request.
 * - Checks if the token exists in the database and ensures it has not been used before.
 * - Verifies the token using JWT to ensure it's valid and not expired.
 * - Confirms that the token's payload (user ID and email) matches an existing user.
 * - Hashes the new password using bcrypt for secure storage.
 * - Updates the user's password in the database and marks the token as used to prevent reuse.
 *
 * If any step fails, an error is returned. On success, it sends a 201 status code with a success message.
 *
 * @param {Object} req - The request object, containing the token in `req.query.token` and the new password in `req.body.password`.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @async
 */
router.put("/reset-password", async (req, res) => {
  try {
    let token = req.query.token; // Get token from query
    let password = req.body.password; // Get password from request body
    if (!token || !password) throw new Error("Something is missing!");

    // Check if token exists in the database and make sure it is not used before!
    let tokenInDb = await Token.findOne({ token: token });
    if (!tokenInDb) throw new Error("Token is invalid!");
    if (tokenInDb.status === "used") throw new Error("This link has already been used.");

    // Throws an error if token could not be verified or expired
    let decodedToken;
    try {
      // Throws an error if token could not be verified or expired
      decodedToken = jwt.verify(req.query.token, process.env.RANDOM_SEED);
    } catch (jwtError) {
      // Handle JWT verification errors specifically
      throw new Error("Token verification failed!");
    }
    // Parse decoded token
    let _id = decodedToken.id;
    let email = decodedToken.email;

    // Make sure that information in token is correct and there is a user with that information
    let user = await User.findOne({ _id: _id, email: email });
    if (!user) throw new Error("Malformed token! Please try again or get a new token to reset your password!");

    // Hash the password before saving it to the database
    const hashedPass = await bcrypt.hash(password, 5);

    // Update user password and mark token as used to prevent reuse
    try {
      await User.findOneAndUpdate({ _id: _id, email: email }, { password: hashedPass });
      await Token.findByIdAndUpdate(tokenInDb._id, { status: "used" });
    } catch (err) {
      throw new Error("Failed to update password! Please try again later!");
    }

    res.status(201).send({
      status: true,
      message: "Password is reset successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: false,
      data: err.message,
    });
  }
});

export default router;
