// models/userModel.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Renter", "Vehicle Owner", "Admin"),
      allowNull: false,
    },
  });

  return User;
};
