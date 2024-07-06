const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");

class UserControllers {
  async create(request, response) {
    const { name, email, password } = request.body;
    const database = await sqliteConnection();

    const checkUser = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    if (checkUser) {
      throw new AppError("User already exists", 400);
    }

    const passwordHash = await hash(password, 8);
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    return response.json();

    // response.status(201).json({ name, email, password });//status code is optional, but is a good practice to use it.
    //console.log(request.params.id);
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("User not found");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email already in use");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Old password is required");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `UPDATE users SET name = ?, email = ?, updated_at = DATETIME('now'), password = ? WHERE id = (?)`,
      [user.name, user.email, user.password, user_id]
    );

    return response.json();
  }
}

module.exports = UserControllers;
