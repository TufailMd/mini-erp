import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const findUserByEmail = (email) => User.findOne({ email });

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const verifyPassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export const createAuthToken = (userId) => generateToken(userId);
