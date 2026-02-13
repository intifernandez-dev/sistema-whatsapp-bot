const xlsx = require("xlsx");

function cargarClientesExcel(path) {
  const workbook = xlsx.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const clientes = {};
  rows.forEach(row => {
    clientes[row.direccion.toLowerCase()] = row.telefono;
  });

  return clientes;
}

module.exports = { cargarClientesExcel };
