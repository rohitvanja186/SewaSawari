const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Owner = sequelize.define('owner', {
    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),  // Precision of 10 digits with 6 decimal places
      allowNull: true,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6),  // Precision of 10 digits with 6 decimal places
      allowNull: true,
      validate: {
        min: -180,
        max: 180
      }
    },
    operating_hours: {
      type: DataTypes.JSON,
      allowNull: true, // Optional
    },
    email_confirm: {
      type: DataTypes.BOOLEAN,
    },
  });

  return Owner;
};