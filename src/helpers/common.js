const { Op } = require("sequelize")

module.exports = {
  myPagination: (q, sqInc) => {
    const { searchQuery, sort, page, perPage } = q

    var param = {}
    var order = { order: [['created_at', 'desc']] }
    var limit = 10
    var offset = 0
    // search query condition
    if (searchQuery) {
      param = {
        [Op.or]: sqInc.map(x => {
        return { [x]: { [Op.iLike]: `%${searchQuery}%` } }
      })
      }
    }
    // sort condition
    if (sort) {
      var split = sort.split(",")

      if (split.length > 1) {
        if (split[0] && split[1]) {
          if (['ASC', 'DESC'].includes(split[1].toUpperCase())) {
            order.order = [[split[0], split[1]]]
          }
        }
      } else {
        if (split[0]) {
          order.order = [[split[0]]]
        }
      }
    }
    // perPage condition
    if (perPage) {
      if (isNaN(parseInt(perPage))) {
        limit = 10
      } else {
        limit = perPage
      }
    }
    // pagination condition
    if (page) {
      if (isNaN(parseInt(page))) {
        offset = 0
      } else {
        offset = (parseInt(page) - 1) * perPage
      }
    }

    return {
      param,
      order,
      limit,
      offset
    }
  },
  myPaginationQuery: (q, query, order, sqInc, soInc) => {
    const { searchQuery, sort, page, perPage } = q

    query = query || '1=1 '
    order = order || 'ORDER BY created_at DESC'
    var param = {}
    var pagination = ''
    var offset = 0
    var limit = 10
    // search query condition
    if (searchQuery) {
      let sqInc2 = sqInc.map(i => `${i} ILIKE :searchQuery`)
      var qCond = sqInc2.join(' OR ')
      query += `AND (${qCond})`
      param.searchQuery = `%${searchQuery}%`
    }
    // sort condition
    if (sort) {
      var split = sort.split(',')

      if (soInc.includes(split[0])) {
        if (split.length > 1) {
          if (split[0] && split[1]) {
            if (['ASC', 'DESC'].includes(split[1].toUpperCase())) {
              order = `ORDER BY ${split[0]} ${split[1]}`
            }
          }
        } else {
          if (split[0]) {
            order = `ORDER BY ${split[0]}`
          }
        }
      }
    }
    // perPage condition
    if (perPage) {
      if (isNaN(parseInt(perPage))) {
        limit = 10
      } else {
        limit = perPage
      }
      pagination += `LIMIT ${limit}`
    }
    // pagination condition
    if (page) {
      if (isNaN(parseInt(page))) {
        offset = 0
      } else {
        offset = (parseInt(page) - 1) * perPage
      }
      pagination += ` OFFSET ${offset}`
    }

    return {
      queryAll: `${query} ${order} ${pagination}`,
      queryCount: query,
      limit,
      param
    }
  },
  myErrorHandling: (error) => {
    if ('name' in error) {
      const { name, errors, parent, original, fields, sql } = error
      if (name == 'SequelizeValidationError') {
        if (Array.isArray(errors)) {
          return errors.map(e => {
            let message = e.message.split('.')
            return message[1]
          })
        }
      } else if (['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError'].includes(name)) {
        return original.detail
      }
    }
    return error
  },
  isDataExist: async (model, id, is_deleted) => {
    if (is_deleted) {
      return await model.count({ where: { id, is_deleted: false } })
    } else {
      return await model.count({ where: { id } })
    }
  },
  myFileExt: (filename) => /(?:\.([^.]+))?$/.exec(filename)[1],
}