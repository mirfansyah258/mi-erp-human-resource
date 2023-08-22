const { QueryTypes } = require("sequelize");
const { db } = require("../config");
const { myres } = require("../helpers")
const { myErrorHandling, isDataExist, myPaginationQuery } = require("../helpers/common")
const { Department, Company } = require("../models");

module.exports = {
  create: async (req, res) => {
    const { system_id, department_name, parent_department_id, company_id } = req.body
    try {
      const check1 = await isDataExist(Company.company, company_id, true)
      if (check1 < 1) return myres(res, 404, `Company with id ${company_id} is not found`)
      if (parent_department_id) {
        const check2 = await isDataExist(Department, parent_department_id, true)
        if (check2 < 1) return myres(res, 404, `Parent department with id ${parent_department_id} is not found`)
      }
      const data = await Department.create({ system_id: system_id || null, department_name, parent_department_id: parent_department_id || null, company_id })
      return myres(res, 201, 'Department data created successfully', data)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at create', myErrorHandling(error))
    }
  },
  getAll: async (req, res) => {
    const { page = 1, perPage = 1 } = req.query
    const { queryAll, queryCount, param: replacements } = myPaginationQuery(req.query, 'is_deleted = false ', null, ['system_id', 'department_name', 'parent_department', 'company_name'], ['system_id', 'department_name', 'parent_department', 'company_name'])
    try {
      // get all record based on filter
      const data = await db.query(`SELECT * FROM v_department WHERE ${queryAll}`, { replacements, type: QueryTypes.SELECT })

      // count all record based on filter
      const count = await db.query(`SELECT * FROM v_department WHERE ${queryCount}`, { replacements, type: QueryTypes.SELECT })
      const totalCount = count.length

      return myres(res, 200, null, { data, totalCount, currentPage: parseInt(page), perPage: parseInt(perPage), totalPages: Math.ceil(totalCount / parseInt(perPage)) })
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getAll', error)
    }
  },
  getById: async (req, res) => {
    const { id } = req.params
    try {
      const data = await db.query(`SELECT * FROM v_department WHERE id = :id AND is_deleted = false`, { replacements: { id }, type: QueryTypes.SELECT })
      if (data.length) {
        return myres(res, 200, null, data[0])
      }
      return myres(res, 404, `Department with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getById', error)
    }
  },
  update: async (req, res) => {
    const { id } = req.params
    const { system_id, department_name, parent_department_id, company_id } = req.body

    try {
      // check if department id is exist
      const isExist = await isDataExist(Department, id, true)
      if (isExist) {
        // check if company is exist
        const check1 = await isDataExist(Company.company, company_id, true)
        if (check1 < 1) return myres(res, 404, `Company with id ${company_id} is not found`)
        // check if parent department is exist
        if (parent_department_id) {
          const check2 = await isDataExist(Department, parent_department_id, true)
          if (check2 < 1) return myres(res, 404, `Parent department with id ${parent_department_id} is not found`)
        }
        // check if id != parent_department_id
        if (id == parent_department_id) return myres(res, 400, `ID and Parent ID cannot have the same value.`)

        const data = await Department.update({ system_id: system_id || null, department_name, parent_department_id: parent_department_id || null, company_id }, { where: { id }, returning: true })
        return myres(res, 200, 'Department changed successfully', data[1][0])
      }
      return myres(res, 404, `Department with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at update', error)
    }
  },
  delete: async (req, res) => {
    const { id } = req.params
    try {
      const isExist = await isDataExist(Department, id, true)
      if (isExist) {
        const data = await Department.update({ is_deleted: true }, { where: { id }, returning: true })
        return myres(res, 200, 'Department data deleted successfully', data[1][0])
      }
      return myres(res, 404, `Department with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at delete', error)
    }
  },
}