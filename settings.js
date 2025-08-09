const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

global.owner = "5355699866";
global.botname = "Zenitsu-Bot";
global.place = 'America/Managua';
global.prefix = [`.`];

// ✅ Lista de owners autorizados
global.ownerid = [
  "5355699866@s.whatsapp.net", // Carlos
  "261271484104740@lid"        // Otro ID autorizado
];

module.exports = {
  owner: global.owner,
  botname: global.botname,
  place: global.place,
  prefix: global.prefix,
  ownerid: global.ownerid
};