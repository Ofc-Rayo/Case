const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

global.owner = "5355699866";
global.botname = "Zenitsu-Bot";
global.place = 'America/Managua';
global.prefix = [`.`];

// ✅ Lista de owners autorizados (formato mixto)
global.ownerid = 
  "5355699866@s.whatsapp.net";

// 🌐 Lista específica de owners con @lid
global.ownerlid = "261271484104740@lid";

module.exports = {
  owner: global.owner,
  botname: global.botname,
  place: global.place,
  prefix: global.prefix,
  ownerid: global.ownerid,
  ownerlid: global.ownerlid
};