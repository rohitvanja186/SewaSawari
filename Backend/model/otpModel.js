module.exports = (sequelize, DataTypes) => {
    const Otp = sequelize.define("otp", {
      hashedOtp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    });
  
    return Otp;
  };
  