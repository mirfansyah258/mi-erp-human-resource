const { QueryTypes } = require("sequelize");
const { db } = require("../config");
const { myres } = require("../helpers")
const { myPagination, myErrorHandling, isDataExist, myPaginationQuery } = require("../helpers/common")
const { Company } = require("../models");

module.exports = {
  // Category Company
  createCategory: async (req, res) => {
    const { system_id, category_name } = req.body
    try {
      const data = await Company.category.create({ system_id, category_name })
      return myres(res, 201, 'Category Company data created successfully', data)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at createCategory', myErrorHandling(error))
    }
  },
  getAllCategory: async (req, res) => {
    const { page = 1, perPage = 1 } = req.query
    const { param, order, limit, offset } = myPagination(req.query, ['system_id', 'category_name'])
    try {
      // get all record based on filter
      const data = await Company.category.findAll({ where: { ...param, is_deleted: false }, ...order, limit, offset, raw: true })

      // count all record based on filter
      const totalCount = await Company.category.count({ where: { ...param, is_deleted: false } })

      return myres(res, 200, null, { data, totalCount, currentPage: parseInt(page), perPage: parseInt(perPage), totalPages: Math.ceil(totalCount / parseInt(perPage)) })
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getAllCategory', error)
    }
  },
  getCategoryById: async (req, res) => {
    const { id } = req.params
    try {
      const data = await Company.category.findOne({ where: { id, is_deleted: false }, raw: true })
      if (data) {
        return myres(res, 200, null, data)
      }
      return myres(res, 404, `Data category company with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getCategoryById', error)
    }
  },
  updateCategory: async (req, res) => {
    const { id } = req.params
    const { system_id, category_name } = req.body

    try {
      const isExist = await isDataExist(Company.category, id, true)
      if (isExist) {
        const data = await Company.category.update({ system_id, category_name }, { where: { id }, returning: true })
        return myres(res, 200, 'Category Company data changed successfully', data[1][0])
      }
      return myres(res, 404, `Data category company with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at updateCategory', error)
    }
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params
    try {
      const isExist = await isDataExist(Company.category, id, true)
      if (isExist) {
        const data = await Company.category.update({ is_deleted: true }, { where: { id }, returning: true })
        return myres(res, 200, 'Category Company data deleted successfully', data[1][0])
      }
      return myres(res, 404, `Data category company with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at deleteCategory', error)
    }
  },

  // Company
  createCompany: async (req, res) => {
    const { system_id, company_name, category_id, parent_company_id } = req.body
    try {
      const check1 = await isDataExist(Company.category, category_id, true)
      if (check1 < 1) return myres(res, 404, `Data category company with id ${category_id} is not found`)
      if (parent_company_id) {
        const check2 = await isDataExist(Company.company, parent_company_id, true)
        if (check2 < 1) return myres(res, 404, `Data parent company with id ${parent_company_id} is not found`)
      }
      const data = await Company.company.create({ system_id, company_name, category_id, parent_company_id: parent_company_id || null })
      return myres(res, 201, 'Company data created successfully', data)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at createCompany', myErrorHandling(error))
    }
  },
  getAllCompany: async (req, res) => {
    const { page = 1, perPage = 1 } = req.query
    const { queryAll, queryCount, param: replacements } = myPaginationQuery(req.query, 'is_deleted = false ', null, ['system_id', 'company_name', 'parent_company', 'category_name'], ['system_id', 'company_name', 'parent_company', 'category_name'])
    try {
      // get all record based on filter
      const data = await db.query(`SELECT * FROM v_company WHERE ${queryAll}`, { replacements, type: QueryTypes.SELECT })

      // count all record based on filter
      const count = await db.query(`SELECT * FROM v_company WHERE ${queryCount}`, { replacements, type: QueryTypes.SELECT })
      const totalCount = count.length

      return myres(res, 200, null, { data, totalCount, currentPage: parseInt(page), perPage: parseInt(perPage), totalPages: Math.ceil(totalCount / parseInt(perPage)) })
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getAllCompany', error)
    }
  },
  getCompanyById: async (req, res) => {
    const { id } = req.params
    try {
      const data = await db.query(`SELECT * FROM v_company WHERE id = :id AND is_deleted = false`, { replacements: { id }, type: QueryTypes.SELECT })
      if (data.length) {
        return myres(res, 200, null, data[0])
      }
      return myres(res, 404, `Data company with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getCompanyById', error)
    }
  },
  updateCompany: async (req, res) => {
    const { id } = req.params
    const { system_id, company_name, category_id, parent_company_id } = req.body

    try {
      // check if company id is exist
      const isExist = await isDataExist(Company.company, id, true)
      if (isExist) {
        // check if category company is exist
        const check1 = await isDataExist(Company.category, category_id, true)
        if (check1 < 1) return myres(res, 404, `Data category company with id ${category_id} is not found`)
        // check if parent company is exist
        if (parent_company_id) {
          const check2 = await isDataExist(Company.company, parent_company_id, true)
          if (check2 < 1) return myres(res, 404, `Data parent company with id ${parent_company_id} is not found`)
        }
        // check if id != parent_company_id
        if (id == parent_company_id) return myres(res, 400, `ID and Parent ID cannot have the same value.`)

        const data = await Company.company.update({ system_id, company_name, category_id, parent_company_id: parent_company_id || null }, { where: { id }, returning: true })
        return myres(res, 200, 'Company data changed successfully', data[1][0])
      }
      return myres(res, 404, `Data company with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at updateCompany', error)
    }
  },
  deleteCompany: async (req, res) => {
    const { id } = req.params
    try {
      const isExist = await isDataExist(Company.company, id, true)
      if (isExist) {
        const data = await Company.company.update({ is_deleted: true }, { where: { id }, returning: true })
        return myres(res, 200, 'Company data deleted successfully', data[1][0])
      }
      return myres(res, 404, `Data company with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at deleteCompany', error)
    }
  },
}