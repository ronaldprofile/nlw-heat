import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3Messages";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticate } from "./middleware/ensureAuthenticate";

const router = Router();

router.get("/github", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

router.get("/sign/callback", (req, res) => {
  const { code } = req.query;

  res.json(code);
});

router.get("/profile", ensureAuthenticate, new ProfileUserController().handle);

router.post("/authenticate", new AuthenticateUserController().handle);
router.get("/recent/messages", new GetLast3MessagesController().handle);

router.post(
  "/messages",
  ensureAuthenticate,
  new CreateMessageController().handle
);

export { router };
