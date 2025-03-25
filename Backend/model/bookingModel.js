const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define(
    'booking',
    {
      pickup_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      pickup_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      return_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      return_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      number_of_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid'),
        defaultValue: 'unpaid',
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true, 
      underscored: true,
    }
  );

  return Booking;
};
