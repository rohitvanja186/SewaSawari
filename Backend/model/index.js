// model/index.js

const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.owners = require("./ownerModel.js")(sequelize, DataTypes);
db.users = require("./userModel.js")(sequelize, DataTypes);
db.otps = require("./otpModel.js")(sequelize, DataTypes);

// Relationship
db.users.hasMany(db.owners)
db.owners.belongsTo(db.users)

//otp and user relationship
db.users.hasMany(db.otps)
db.otps.belongsTo(db.users)

// Sync and seed admin
db.sequelize.sync({ force: false }).then(async () => {
  console.log("yes re-sync done");

  const seedAdmin = require("../seedAdmin");
  await seedAdmin();
});

module.exports = db;
