import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import Account from "./models/account.js";
import { sendVerificationMail } from "./sendVerifEmail.js";

const router = express.Router();

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
  // Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
      if (error) {
        console.log("JWT error:", error);
        res.status(401).end();
      }
      try {
        //optionally fetch user details from the database
        const user = await Account.findById(decoded.id).select(
          "_id firstname lastname"
        );
        if (!user) {
          return res.status(401).end();
        }

        req.user = user; //attach user details to req.user
        next();
      } catch (dbError) {
        console.log("Database error:", dbError);
        return res.status(500).send("Internal server error");
      }
    });
  }
}

export function registerUser(req, res) {
  const { firstname, lastname, calpoly_email, password } = req.body;

  if (!firstname || !lastname || !calpoly_email || !password) {
    return res.status(400).send("Please fill out the required fields");
  }

  //check if the email has the correct domain
  const validDomain = "@calpoly.edu";
  if (!calpoly_email.endsWith(validDomain)) {
    return res
      .status(400)
      .send("Invalid email domain. Only @calpoly.edu emails are allowed");
  }

  Account.findOne({ calpoly_email }).then((existingUser) => {
    if (existingUser) {
      return res.status(409).send("Email already in use");
    } else {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
          const newUser = new Account({
            firstname,
            lastname,
            calpoly_email,
            password: hashedPassword
          });
          newUser.save().then(() => {
            //generate a verification token
            const verificationToken = jwt.sign(
              { calpoly_email },
              process.env.TOKEN_SECRET,
              { expiresIn: "1h" }
            );

            //send the verification email
            sendVerificationMail({
              email: calpoly_email,
              name: firstname,
              emailToken: verificationToken
            })
              .then(() => {
                res
                  .status(201)
                  .send("Account created. Verification email sent");
              })
              .catch((error) => {
                console.log("Error sending verification email:", error);
                res
                  .status(500)
                  .send(
                    "Account created but failed to send verification email."
                  );
              });
          });
        })
        .catch((error) => res.status(500).send("Error creating user"));
    }
  });
}

export function loginUser(req, res) {
  const { calpoly_email, password } = req.body;

  if (!calpoly_email || !password) {
    return res.status(400).send("Please fill out the required fields");
  }

  Account.findOne({ calpoly_email }).then((user) => {
    if (!user) {
      return res.status(401).send("User does not exist");
    }

    // Check if the user's email has been verified
    if (!user.isVerified) {
      return res.status(403).send("Email not verified");
    }

    bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        generateAccessToken(calpoly_email).then((token) => {
          res.status(200).send({ token });
        });
      } else {
        res.status(401).send("Incorrect password");
      }
    });
  });
}

//route to verify email token
router.get("/verify-email", (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send("No token provided");
  }

  //verify the token using the secret key
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send("Invalid or expired token");
    }

    //mark the user as verified
    Account.findOneAndUpdate(
      { calpoly_email: decoded.calpoly_email },
      { isVerified: true },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(200).send("Email verified successfully");
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((error) => {
        res.status(500).send("Internal server error");
      });
  });
});

export default router;
