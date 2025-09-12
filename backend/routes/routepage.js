const authMiddleware = require("../middleware/auth");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});
