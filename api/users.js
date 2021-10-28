const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  getUserByUserName,
  getUser,
  getPublicRoutinesByUser,
  getUserById,
} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUserName(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    } else if (password.length < 8) {
      next({
        name: "PasswordTooShort",
        message: "Password must be at least 8 characters",
      });
    } else {
      const user = await createUser({ username, password });

      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            username: username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );
        res.send({ message: "you're signed up!", token, user });
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username: username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        user = await getUserById(id);
        res.send(user);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;

  try {
    const routines = await getPublicRoutinesByUser({ username });
    res.send(routines);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;
