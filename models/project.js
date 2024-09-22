"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user);
    }
  }
  project.init(
    {
      projectName: DataTypes.STRING,
      startDate: DataTypes.STRING,
      finishDate: DataTypes.STRING,
      description: DataTypes.TEXT,
      technologies: DataTypes.ARRAY(DataTypes.STRING),
      image: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};
