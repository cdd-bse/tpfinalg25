const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    path.join(__dirname, "../database.sqlite"),
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Conectado a la base de datos SQLite.");
        checkAndCreateTable();
      }
    }
);

exports.getDashboard = (req, res) => {
  res.render("indexAdmin");
};

exports.getAbmUsuarios = (req, res) => {
  res.render("abmUsuarios");
};

exports.getAbmProductos = (req, res) => {
  res.render("abmProductos");
};

exports.getListarProductos = (req, res) => {
  res.render("listarProductos");
};

exports.getListarUsuarios = (req, res) => {
  const sql = "SELECT * FROM administrador";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error al consultar usuarios:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    console.log(rows);
    res.render("listarUsuariosAdm", { usuarios: rows });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.userId;

  const sql = "DELETE FROM administrador WHERE ad_id = ?";
  db.run(sql, [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar el usuario" });
    }
    console.log(`Usuario eliminado con ID: ${userId}`);
    res.json({ message: "Usuario eliminado correctamente" });
  });
};

exports.getListarVentas = (req, res) => {
  res.render("listarVentas");
};

const generateRandomString = (length) => {
  const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomEmail = () => {
  const domains = ["example.com", "test.com", "demo.com"];
  return `${generateRandomString(5)}@${
      domains[Math.floor(Math.random() * domains.length)]
  }`;
};

const generateRandomPhoneNumber = () => {
  const numbers = "0123456789";
  let phoneNumber = "";
  for (let i = 0; i < 10; i++) {
    phoneNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return phoneNumber;
};

const insertRandomUsers = (numUsers) => {
  for (let i = 0; i < numUsers; i++) {
    const ad_user = generateRandomString(10);
    const ad_contrasena = generateRandomString(10);
    const ad_correo = generateRandomEmail();
    const ad_telefono = generateRandomPhoneNumber();

    const sql = `
      INSERT INTO administrador (ad_user, ad_contrasena, ad_correo, ad_telefono) 
      VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [ad_user, ad_contrasena, ad_correo, ad_telefono],
        function (err) {
          if (err) {
            return console.error("Error al insertar usuario:", err.message);
          }
          console.log(`Usuario agregado con ID: ${this.lastID}`);
        }
    );
  }
};

const checkAndCreateTable = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS administrador (
      ad_id INTEGER PRIMARY KEY AUTOINCREMENT,
      ad_user VARCHAR(255),
      ad_contrasena VARCHAR(255),
      ad_correo VARCHAR(255),
      ad_telefono VARCHAR(20)
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      return console.error("Error al crear la tabla:", err.message);
    }
    console.log("Tabla 'administrador' verificada/creada exitosamente.");
    insertRandomUsers(10);
  });
};
