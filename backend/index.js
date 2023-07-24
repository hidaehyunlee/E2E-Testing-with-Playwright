// Backend (Node.js)

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

let users = [];

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    const user = users.find((u) => u.email === email);
    if (user == null) {
      return done(null, false, { message: "User not found" });
    }
    if (password !== user.password) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // 혹은 실제 클라이언트 URL
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.post("/register", (req, res) => {
  if (users.find((u) => u.email === req.body.email)) {
    return res.status(400).send({ message: "Email already exists" });
  }

  if (!req.body.password || req.body.password.length < 8) {
    return res
      .status(400)
      .send({ message: "Password should be at least 8 characters long" });
  }

  const user = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  users.push(user);
  res.status(200).send({ user: user });
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  if (!req.user) {
    return res.status(400).send({ message: "Login failed" });
  }

  res.send({ user: req.user });
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ user: req.user });
  } else {
    res.status(403).send({ message: "User not authenticated" });
  }
});

app.post("/update", (req, res) => {
  console.log(req.isAuthenticated);
  if (req.isAuthenticated()) {
    const user = users.find((u) => u.id === req.user.id);
    user.name = req.body.name;
    res.send({ user: user });
  } else {
    res.status(403).send({ message: "User not authenticated" });
  }
});

app.get("/logout", (req, res) => {
  req.logOut();
  res.status(200).send({ message: "Logged out" });
});

app.listen(5555, () => console.log("Server is running on port 5555."));
