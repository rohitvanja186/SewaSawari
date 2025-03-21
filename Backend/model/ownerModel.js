  const { DataTypes } = require('sequelize');

  module.exports = (sequelize) => {
    const Owner = sequelize.define('owner', {
      business_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
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
