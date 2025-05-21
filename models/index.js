'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Cargar solo archivos de modelo válidos
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1 &&
      file.toLowerCase() !== 'sequelize.js' && // ⚠️ Evita cargar archivos innecesarios
      file.toLowerCase() !== 'index.js'         // Evita recargar este mismo archivo
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); // Asegúrate de pasar sequelize y Sequelize.DataTypes
    db[model.name] = model;
  });

// Ejecutar associate en cada modelo si existe
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Agregar sequelize y Sequelize al export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("Modelos cargados:", Object.keys(db));

module.exports = db;
