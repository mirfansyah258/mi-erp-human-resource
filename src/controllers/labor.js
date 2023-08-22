const fs = require('fs');
const { db } = require("../config")
const { myres } = require("../helpers")
const { myPagination, myErrorHandling, myFileExt, isDataExist } = require("../helpers/common")
const { Labor } = require("../models");
const moment = require('moment');

module.exports = {
  create: async (req, res) => {
    const { id_card_number, firstname, middlename, lastname, birthdate, gender, nationality, marital_status, contact_address, contact_phone, contact_email, emergency_contact_name, emergency_contact_phone, tax_id, status } = req.body
    const files = req.files

    const transaction = await db.transaction()
    try {
      let profile_picture = ''
      if (files && files.profile_picture.size > 0) {
        const ext = myFileExt(files.profile_picture.name)
        profile_picture = `${moment().valueOf()}.${ext}`
      }

      const data = await Labor.create({ id_card_number, firstname, middlename, lastname, birthdate, gender, nationality, marital_status, profile_picture, contact_address, contact_phone, contact_email, emergency_contact_name, emergency_contact_phone, tax_id, status }, { transaction })

      if (files && files.profile_picture.size > 0) {
        const dir = `./src/assets/uploads/${data.id}/profile-picture`
        fs.mkdirSync(dir, { recursive: true })
        const path = `${dir}/${profile_picture}`;
  
        // Move the file to the specified destination
        files.profile_picture.mv(path, async (err) => {
          if (err) {
            await transaction.rollback()
            return myres(res, 400, 'error while moving file', err)
          }
          await transaction.commit()
          return myres(res, 201, 'Labor data created successfully', data)
        });
      } else {
        await transaction.commit()
        return myres(res, 201, 'Labor data created successfully', data)
      }
    } catch (error) {
      await transaction.rollback()
      console.error('error', error);
      return myres(res, 400, 'error at create', myErrorHandling(error))
    }
  },
  getAll: async (req, res) => {
    const { page = 1, perPage = 1, status } = req.query
    const { param, order, limit, offset } = myPagination(req.query, ['id_card_number', 'firstname', 'middlename', 'lastname', 'gender', 'nationality', 'contact_address', 'contact_phone', 'contact_email', 'emergency_contact_name', 'emergency_contact_phone', 'tax_id', 'status'])
    if (!status) return myres(res, 400, 'status is required')
    try {
      // get all record based on filter
      const data = await Labor.findAll({ where: { status, ...param, is_deleted: false }, ...order, limit, offset, raw: true })

      // count all record based on filter
      const totalCount = await Labor.count({ where: { status, ...param, is_deleted: false } })

      // manipulate data
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        e.profile_picture_path = e.profile_picture ? `/uploads/${e.id}/profile-picture/${e.profile_picture}` : ''
      }

      return myres(res, 200, null, { data, totalCount, currentPage: parseInt(page), perPage: parseInt(perPage), totalPages: Math.ceil(totalCount / parseInt(perPage)) })
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getAll', error)
    }
  },
  getById: async (req, res) => {
    const { id } = req.params
    try {
      const data = await Labor.findOne({ where: { id, is_deleted: false }, raw: true })
      if (data) {
        data.profile_picture_path = data.profile_picture ? `/uploads/${data.id}/profile-picture/${data.profile_picture}` : ''
        return myres(res, 200, null, data)
      }
      return myres(res, 404, `Data labor with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getById', error)
    }
  },
  update: async (req, res) => {
    const { id } = req.params
    const files = req.files
    const update_param = req.body
    delete update_param.profile_picture

    let profile_picture = ''
    if (files && files.profile_picture.size > 0) {
      const ext = myFileExt(files.profile_picture.name)
      profile_picture = `${moment().valueOf()}.${ext}`

      const dir = `./src/assets/uploads/${id}/profile-picture`
      fs.mkdirSync(dir, { recursive: true })
      const path = `${dir}/${profile_picture}`;

      // Move the file to the specified destination
      files.profile_picture.mv(path, async (err) => {
        if (err) {
          return myres(res, 400, 'error while moving file', err)
        }
      });
      update_param.profile_picture = profile_picture
    }

    try {
      const isExist = await isDataExist(Labor, id, true)
      if (isExist) {
        const data = await Labor.update(update_param, { where: { id }, returning: true })
        return myres(res, 200, 'Labor data changed successfully', data[1][0])
      }
      return myres(res, 404, `Data labor with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      fs.unlinkSync(path);
      return myres(res, 400, 'error at update', error)
    }
  },
  delete: async (req, res) => {
    const { id } = req.params
    try {
      const isExist = await isDataExist(Labor, id, true)
      if (isExist) {
        const data = await Labor.update({ is_deleted: true }, { where: { id }, returning: true })
        return myres(res, 200, 'Labor data deleted successfully', data[1][0])
      }
      return myres(res, 404, `Data labor with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at delete', error)
    }
  },
}