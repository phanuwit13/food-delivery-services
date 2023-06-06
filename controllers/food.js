const database = require('../database')
const validate = require('../util/validate')
const _ = require('lodash')

exports.getFoodByStore = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    const storeId = req.query.store_id
    let sql = `SELECT * from store where store.store_id = $1`

    let param = [storeId]
    let response = await database.query(sql, param)

    let foodListSql = `SELECT * from food left join food_type on food.fk_food_type = food_type.food_type_id  where food.fk_store_id = $1`

    let paramFood = [storeId]
    let responseFood = await database.query(foodListSql, paramFood)

    const storeData = {
      store_name: response.rows[0].store_name,
      store_id: response.rows[0].store_id,
      store_image: response.rows[0].store_image,
      food: responseFood.rows,
    }

    responseData.success = true
    responseData.data = storeData
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

exports.addFoodType = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    let data = req.body
    let foodTypeName = data.food_type_name
    let foodTypeImage = data.food_type_image
    let fkStoreId = data.fk_store_id

    if (!foodTypeName || !foodTypeImage || !fkStoreId) {
      const key = ['food_type_name', 'food_type_image', 'fk_store_id']
      const msg = validate.validateKey(data, key)
      const response = {
        success: false,
        msg,
      }
      res.status(502).json(response)
      next()
    }

    let sql = `INSERT INTO food_type
    (food_type_name, food_type_image,fk_store_id)
    VALUES($1,$2,$3);
    `
    let param = [foodTypeName, foodTypeImage, fkStoreId]
    await database.query(sql, param)

    responseData.success = true
    client.query('COMMIT')
  } catch (error) {
    console.log(error)
    client.query('ROLLBACK')
    responseData.success = false
  } finally {
    client.release
  }

  res.data = {
    ...responseData,
  }
  next()
}

exports.getFoodTypeByStore = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    const storeId = req.query.store_id
    let sql = `SELECT * from food_type where fk_store_id = $1`
    let param = [storeId]
    let response = await database.query(sql, param)
    console.log('response.rows', response.rows)

    responseData.success = true
    responseData.data = response.rows
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

exports.addFood = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    let data = req.body
    let foodName = data.food_name
    let foodImage = data.food_image
    let price = data.price
    let isAddon = data.is_addon
    let fkStoreId = data.fk_store_id
    let fkFoodType = data.fk_food_type
    let groupSelect = data.groupSelect

    if (!foodName || !foodImage || !price || !fkFoodType || !fkStoreId) {
      const key = [
        'food_name',
        'food_image',
        'price',
        'fk_store_id',
        'fk_food_type',
      ]
      const msg = validate.validateKey(data, key)
      const response = {
        success: false,
        msg,
      }
      res.status(502).json(response)
      next()
    }

    let sql = `INSERT INTO food
    (food_name, food_image,price,is_addon,fk_food_type,fk_store_id)
    VALUES($1,$2,$3,$4,$5,$6) RETURNING food_id;
    `
    let param = [foodName, foodImage, price, isAddon, fkFoodType, fkStoreId]
    const responseFood = await database.query(sql, param)
    if (responseFood.rows[0].food_id && groupSelect.length) {
      const task = groupSelect.map((item) => {
        let sql = `INSERT INTO food_group_select
        (fk_food_id,fk_group_select_id)
        VALUES($1,$2) RETURNING food_group_select_id;
        `
        let param = [responseFood.rows[0].food_id, item]
        return database.query(sql, param)
      })
      const response = await Promise.all(task)
      if (response.every((item) => item)) {
        responseData.success = true
      } else {
        responseData.success = false
        responseData.msg = 'food_group_select some value error insert'
      }
    } else {
      responseData.success = true
    }

    responseData.success = true
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

exports.getFoodAddons = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    const foodId = req.query.food_id
    const sql = `SELECT * from food where food.food_id = $1`

    const param = [foodId]
    const responseFood = await database.query(sql, param)

    const sqlListGroup = `SELECT * from food_group_select where food_group_select.fk_food_id = $1`

    const paramListGroup = [foodId]
    const responseListGroup = await database.query(sqlListGroup, paramListGroup)

    const task = responseListGroup.rows.map((item) => {
      const sql2 = `SELECT * from group_select_addons left join group_select on 
      group_select.group_select_id = group_select_addons.fk_group_select left join 
      addons on addons.addons_id = group_select_addons.fk_addons where group_select_addons.fk_group_select = $1`
      const param = [item.food_group_select_id]
      return database.query(sql2, param)
    })
    const responseAddons = await Promise.all(task)
    const response = {
      ...(responseFood.rows[0]),
      addons: responseAddons.map((item) => item.rows),
    }
    responseData.success = true
    responseData.data = response
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
