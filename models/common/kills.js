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
    ucid: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ucid"
    },
    killAlias: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "killAlias"
    },
    killerUnitType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "killerUnitType"
    },
    weaponName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "weaponName"
    },
    victimPlayerID: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "victimPlayerID"
    },
    victimUnitType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "victimUnitType"
    },
    victimAlias: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "victimAlias"
    },
    victimSide: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "victimSide"
    },
    killerSide: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "killerSide"
    },
    qq: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "qq"
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
    tableName: "kills",
    comment: "",
    indexes: []
  };
  const KillsModel = sequelize.define("kills_model", attributes, options);
  return KillsModel;
};