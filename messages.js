const Router = require("express").Router;
const router = new Router();

const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth1");
const ExpressError = require("../expressError");

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    let username = req.user.username;
    let msg = await Message.get(req.params.id);

    if (
      msg.to_user.username !== username &&
      msg.from_user.username !== username
    ) {
      throw new ExpressError("Cannot read this message", 401);
    }

    return res.json({ message: msg });
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let msg = await Message.create({
      from_username: req.user.username,
      to_username: req.body.to_username,
      body: req.body.body,
    });

    return res.json({ message: msg });
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
  try {
    let username = req.user.username;
    let msg = await Message.get(req.params.id);

    if (msg.to_user.username !== username) {
      throw new ExpressError("Cannot set this message to read", 401);
    }
    let message = await Message.markRead(req.params.id);

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
