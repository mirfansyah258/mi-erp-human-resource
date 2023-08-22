const { DataTypes } = require('sequelize')
const { db } = require('../config')

module.exports = {
  category: db.define(
    'company_category',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: db.fn('uuid_generate_v4')
      },
      system_id: {
        type: DataTypes.STRING
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: db.fn('now')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: db.fn('now')
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  ),
  company: db.define(
    'company',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: db.fn('uuid_generate_v4')
      },
      system_id: {
        type: DataTypes.STRING
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      category_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      parent_company_id: {
        type: DataTypes.STRING
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: db.fn('now')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: db.fn('now')
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )
}