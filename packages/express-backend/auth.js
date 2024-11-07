import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Account from "./models/account.js";

function generateAccessToken(calpoly_email) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { calpoly_email: calpoly_email },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        next();
      } else {
        console.log("JWT error:", error);
        res.status(401).end();
      }
    });
  }
}

export function registerUser(req, res) {
  const { calpoly_email, password } = req.body;

  if (!calpoly_email || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  }

  Account.findOne({ calpoly_email }).then((existingUser) => {
    if (existingUser) {
      return res.status(409).send("Email already in use");
    } else {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((password) => {
          const newUser = new Account({ calpoly_email, password });
          newUser.save().then(() => {
            generateAccessToken(calpoly_email).then((token) => {
              res.status(201).send({ token });
            });
          });
        })
        .catch((error) => res.status(500).send("Error creating user"));
    }
  });
}

export function loginUser(req, res) {
  const { calpoly_email, password } = req.body;

  Account.findOne({ calpoly_email }).then((user) => {
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        generateAccessToken(calpoly_email).then((token) => {
          res.status(200).send({ token });
        });
      } else {
        res.status(401).send("Unauthorized");
      }
    });
  });
}
