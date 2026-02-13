


const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const { cargarClientesExcel } = require("./clientes");

const clientes = cargarClientesExcel("./clientes.xlsx");

function getConfig() {
  return JSON.parse(fs.readFileSync("./config.json", "utf8"));
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: false }
});

client.on("qr", () => {
  console.log("📸 Esperando que el dueño escanee el QR en el navegador...");
});


client.on("ready", () => {
  console.log("🤖 Bot de WhatsApp listo");
});

client.on("message", async (message) => {
  const config = getConfig();

  if (!config.activo) return;
  if (!config.repartidor) return;

  if (message.from !== `${config.repartidor}@c.us`) return;

  console.log("📩 Mensaje autorizado:", message.body);

  const texto = message.body.toLowerCase();
  const match = texto.match(/\b(\d{1,2})\b/);
  if (!match) return;

  const minutos = match[1];
  const direccion = texto.replace(match[0], "").trim();

  const numeroCliente = clientes[direccion];
  if (!numeroCliente) {
    message.reply(`❌ No encontré cliente: ${direccion}`);
    return;
  }

const mensajeConfig = JSON.parse(
  fs.readFileSync("./mensaje.json", "utf8")
);

let mensaje = mensajeConfig.texto.replace("{{minutos}}", minutos);

await client.sendMessage(
  `${numeroCliente}@c.us`,
  mensaje
);

  message.reply(`✅ Aviso enviado a ${direccion}`);
});

client.initialize();
