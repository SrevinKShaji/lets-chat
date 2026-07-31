import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized: " + e.message });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      socket.user = decodeValue;
      return next();
    }
    return next(new Error("Authentication error: Invalid token"));
  } catch (e) {
    return next(new Error("Authentication error: " + e.message));
  }
};

