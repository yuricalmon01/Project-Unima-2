const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const [users] = await pool.execute(
    "SELECT * FROM users WHERE username = ? AND active = TRUE",
    [username]
  );

  if (users.length === 0) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const user = users[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, userType: user.user_type_id },
    process.env.JWT_SECRET || "unima_secret_key",
    { expiresIn: "8h" }
  );

  res.json({ token, user: { id: user.id, username: user.username } });
};
