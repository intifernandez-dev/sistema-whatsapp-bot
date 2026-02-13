const { machineIdSync } = require("node-machine-id");
const fs = require("fs");

// NOTA: Este es un sistema de licencias simplificado para propósitos demostrativos.
// En producción, este SECRET estaría en variables de entorno y usaría criptografía más robusta.
const SECRET = process.env.LICENSE_SECRET || "DEMO-SECRET-2025"; 

function generarFirma(id) {
  return Buffer.from(id + SECRET).toString("base64").slice(0, 10);
}

function verificarLicencia() {
  // En modo demo, siempre retorna true si no hay variables de entorno configuradas
  if (!process.env.LICENSE_SECRET) {
    console.log("⚠️  Modo DEMO - Sistema de licencias deshabilitado");
    return true;
  }

  const id = machineIdSync();
  if (!fs.existsSync("./license.json")) return false;

  const { license } = JSON.parse(fs.readFileSync("./license.json", "utf8"));
  const firmaEsperada = generarFirma(id);

  return license === `LIC-${id}-${firmaEsperada}`;
}

module.exports = { verificarLicencia };
