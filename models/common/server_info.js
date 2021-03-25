'use strict';
const dayjs = require('dayjs');
module.exports = (sequelize, DataTypes) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: DataTypes.UNIQUE,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    mission_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "任务文件",
      field: "mission_name"
    },
    mission_filename: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "任务名称",
      field: "mission_filename"
    },
    mission_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "任务描述",
      field: "mission_description"
    },
    result_red: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "result_red",
      get() {
        return dayjs(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    result_blue: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "result_blue"
    },
    mission_current: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "任务详情",
      field: "mission_current"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // 这样,当前日期/时间将用于填充此列(在插入时)
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "createdAt",
      get() {
        return dayjs(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // 这样,当前日期/时间将用于填充此列(在插入时)
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updatedAt",
      get() {
        return dayjs(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    }
  };
  const options = {
    tableName: "server_info",
    comment: "",
    indexes: []
  };
  const ServerInfoModel = sequelize.define("server_info_model", attributes, options);
  return ServerInfoModel;
};