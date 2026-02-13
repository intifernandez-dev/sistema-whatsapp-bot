const express = require("express");
const path = require("path");
const fs = require("fs");
const { machineIdSync } = require("node-machine-id");
const { verificarLicencia } = require("./licencia");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "images")));


// ==========================
// 📂 CONFIG
// ==========================

function getConfig() {
  return JSON.parse(fs.readFileSync("./config.json", "utf8"));
}

function saveConfig(config) {
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
}

// ==========================
// 🔐 ACTIVACIÓN
// ==========================

app.get("/activar", (req, res) => {
  const pcId = machineIdSync();

  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <link rel="icon" type="image/png" href="/favicon.png?v=2">
  <meta charset="UTF-8">
  <title>Activar sistema</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-5">

      <div class="card shadow">
        <div class="card-body">
          <h4 class="text-center mb-3">🔐 Activación del sistema</h4>

          <p><strong>ID de esta PC:</strong></p>
          <div class="alert alert-secondary text-break">
            ${pcId}
          </div>

          <form method="POST" action="/activar">
            <input 
              class="form-control mb-3"
              name="license"
              placeholder="Pegá acá la licencia"
              required
            />
            <button class="btn btn-success w-100">
              Activar sistema
            </button>
          </form>

        </div>
      </div>

    </div>
  </div>
</div>

</body>
</html>
  `);
});

app.post("/activar", (req, res) => {
  const license = req.body.license;

  fs.writeFileSync(
    "./license.json",
    JSON.stringify({ license }, null, 2)
  );

  if (verificarLicencia()) {
    res.redirect("/");
  } else {
    fs.unlinkSync("./license.json");
    res.send("<h3>❌ Licencia inválida</h3>");
  }
});

// ==========================
// 🛑 BLOQUEO SIN LICENCIA
// ==========================

app.use((req, res, next) => {
  if (!verificarLicencia() && req.path !== "/activar") {
    return res.redirect("/activar");
  }
  next();
});

// ==========================
// 🌐 PANEL PRINCIPAL
// ==========================

app.get("/", (req, res) => {
  const config = getConfig();

  const estadoTexto = config.activo ? "ACTIVO" : "APAGADO";
  const estadoClase = config.activo ? "text-success" : "text-danger";
  const botonClase = config.activo ? "btn-danger" : "btn-success";
  const botonTexto = config.activo ? "Apagar sistema" : "Encender sistema";

  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <link rel="icon" type="image/png" href="/favicon.png?v=2">
  <meta charset="UTF-8">
  <title>Panel WhatsApp Bot</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-5">

      <div class="card shadow">
        <div class="card-body">

          <h3 class="text-center mb-3">📲 WhatsApp Bot</h3>

          <p class="text-center fs-5 fw-bold ${estadoClase}">
            ${config.activo ? "🟢" : "🔴"} ${estadoTexto}
          </p>

          <form method="POST" action="/toggle" class="d-grid mb-3">
            <button class="btn ${botonClase}">
              ${botonTexto}
            </button>
          </form>

          <hr/>

          <p><strong>👤 Repartidor autorizado:</strong></p>
          <p class="text-muted">
            ${config.repartidor || "Ninguno"}
          </p>

          <form method="POST" action="/repartidor" class="mb-2">
            <input class="form-control mb-2" name="repartidor" placeholder="54911" required />
            <button class="btn btn-primary w-100">Autorizar repartidor</button>
          </form>

          <form method="POST" action="/eliminar" class="d-grid">
            <button class="btn btn-outline-danger">Eliminar repartidor</button>
          </form>

        </div>
      </div>

    </div>
  </div>
</div>

</body>
</html>
  `);
});

// ==========================
// 🔘 ACCIONES
// ==========================

app.post("/toggle", (req, res) => {
  const config = getConfig();
  config.activo = !config.activo;
  saveConfig(config);
  res.redirect("/");
});

app.post("/repartidor", (req, res) => {
  const config = getConfig();
  config.repartidor = req.body.repartidor;
  saveConfig(config);
  res.redirect("/");
});

app.post("/eliminar", (req, res) => {
  const config = getConfig();
  config.repartidor = "";
  saveConfig(config);
  res.redirect("/");
});

// ==========================
// 🚀 START
// ==========================

app.listen(3000, () => {
  console.log("🌐 Panel en http://localhost:3000");
});
