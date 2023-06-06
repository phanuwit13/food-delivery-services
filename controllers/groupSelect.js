const database = require('../database')
const validate = require('../util/validate')
const _ = require('lodash')

exports.addGroupSelect = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    let data = req.body
    let minSelect = data.min_select
    let mustSelect = data.must_select
    let maxSelect = data.max_select
    let isSelected = data.is_selected
    let fkStoreId = data.fk_store_id
    let addonsIds = data.addonsIds

    if (!fkStoreId) {
      const key = ['fk_store_id']
      const msg = validate.validateKey(data, key)
      const response = {
        success: false,
        msg,
      }
      res.status(502).json(response)
      next()
    }

    let sql = `INSERT INTO group_select
    (min_select, must_select,max_select,is_selected,fk_store_id)
    VALUES($1,$2,$3,$4,$5) RETURNING group_select_id;
    `
    let param = [minSelect, mustSelect, maxSelect, isSelected, fkStoreId]
    const responseGroup = await database.query(sql, param)
    if (responseGroup.rows[0].group_select_id && addonsIds.length) {
      const task = addonsIds.map((item) => {
        let sql = `INSERT INTO group_select_addons
        (fk_group_select, fk_addons)
        VALUES($1,$2) RETURNING group_select_addons_id;
        `
        let param = [responseGroup.rows[0].group_select_id, item]
        return database.query(sql, param)
      })
      const response = await Promise.all(task)
      if (response.every((item) => item)) {
        responseData.success = true
      } else {
        responseData.success = false
        responseData.msg = 'group_select_addons some value error insert'
      }
    } else {
      responseData.success = true
    }
    client.query('COMMIT')
  } catch (error) {
    console.log(error)
    client.query('ROLLBACK')
    responseData.success = false
  } finally {
    client.release()
  }

  res.data = {
    ...responseData,
  }
  next()
}

exports.getGroupSelect = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    const storeId = req.query.store_id
    let sql = `SELECT * from group_select_addons left join group_select on 
    group_select.group_select_id = group_select_addons.fk_group_select left join 
    addons on addons.addons_id = group_select_addons.fk_addons where group_select.fk_store_id = $1`

    let param = [storeId]
    let response = await database.query(sql, param)

    let result = _(response.rows).groupBy((x) => x.group_select_id)
    let addKey = result.map((item) => ({
      group_select_id: item[0].group_select_id,
      min_select: item[0].min_select,
      must_select: item[0].must_select,
      max_select: item[0].max_select,
      is_selected: item[0].is_selected,
      value: item.map((value) => ({
        addons_name: value.addons_name,
        addons_price: value.addons_price,
      })),
    }))
    responseData.success = true
    responseData.data = [...addKey]
  } catch (error) {
    console.log(error)
    responseData.success = false
  } finally {
    client.release()
  }

  res.data = {
    ...responseData,
  }
  next()
}
