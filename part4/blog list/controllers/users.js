const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users.map((u) => u.toJSON()));
});

userRouter.post("/", async (request, response) => {
  const body = request.body;
  if (body.password === undefined) {
    response.status(400).json({ error: "Password is missing" });
  } else if (body.password.length < 3) {
    response
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  } else {
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRound);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });
    const savedUser = await user.save();
    response.json(savedUser);
  }
});
module.exports = userRouter;
