const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

global.owner = "595972157130";
global.botname = "Simple-Bot";
global.place = 'America/Managua';
global.prefix = ['.'];

// IDs tal como los definiste
global.ownerid  = ["595972157130@s.whatsapp.net"];
global.ownerlid = ["261271484104740@lid"];

// 🚀 Genera un array unificado que incluya todas las formas
global.allOwners = Array.from(new Set([
  // los definidos originalmente
  ...global.ownerid,
  ...global.ownerlid,
  // más sus normalizaciones cruzadas
  ...global.ownerid.map(id => id.replace(/@s\.whatsapp\.net$/, '@lid')),
  ...global.ownerlid.map(id => id.replace(/@lid$/, '@s.whatsapp.net')),
]));

module.exports = {
  owner: global.owner,
  botname: global.botname,
  place: global.place,
  prefix: global.prefix,
  ownerid: global.ownerid,
  ownerlid: global.ownerlid,
  allOwners: global.allOwners
};