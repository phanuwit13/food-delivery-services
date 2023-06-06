const database = require('../database')
const validate = require('../util/validate')
const _ = require('lodash')

exports.addStore = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    let data = req.body
    let storeName = data.store_name
    let storeImage = data.store_image
    let storeRating = data.store_rating
    let isPromotion = data.is_promotion
    let fkBranch = data.fk_branch
    let fkBranchType = data.fk_branch_type

    if (!storeName || !storeImage || !isPromotion) {
      const key = ['store_name', 'store_image', 'is_promotion']
      const msg = validate.validateKey(data, key)
      const response = {
        success: false,
        msg,
      }
      res.status(502).json(response)
      next()
    }

    if (!fkBranch && !fkBranchType) {
      const key = ['fk_branch_type']
      const msg = validate.validateKey(data, key)
      const response = {
        success: false,
        msg,
      }
      res.status(502).json(response)
      next()
    }

    if (!fkBranch) {
      let sql = `INSERT INTO branch
      (branch_name, fk_branch_type)
      VALUES($1,$2) RETURNING branch_id;
      `
      let param = [storeName, fkBranchType]
      const responseBranch = await database.query(sql, param)
      console.log('response', responseBranch.rows[0].branch_id)

      if (responseBranch.rows[0].branch_id) {
        console.log('fkBranch', fkBranch)
        let sql = `INSERT INTO store
        (store_name, store_image,store_rating,is_promotion,fk_branch)
        VALUES($1,$2,$3,$4,$5) RETURNING store_id;
        `
        let param = [
          storeName,
          storeImage,
          storeRating,
          isPromotion,
          responseBranch.rows[0].branch_id,
        ]
        const responseStore = await database.query(sql, param)
        console.log('responseStore', responseStore.rows[0].store_id)
      }
    } else {
      let sql = `INSERT INTO store
        (store_name, store_image,store_rating,is_promotion,fk_branch)
        VALUES($1,$2,$3,$4,$5) RETURNING store_id;
        `
      let param = [storeName, storeImage, storeRating, isPromotion, fkBranch]
      const responseStore = await database.query(sql, param)
      console.log('responseStore', responseStore.rows[0].store_id)
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

exports.getStoreList = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}

  try {
    let sql = `SELECT * from store left join branch on store.fk_branch = branch.branch_id 
    left join branch_type on branch.fk_branch_type = branch_type.branch_type_id`

    if (req.query.branch_type_id) {
      sql += ` where branch_type.branch_type_id = ${req.query.branch_type_id}`
    }

    let response = await database.query(sql)
    const task = response.rows.map((item) => {
      let sql = `select * from food where fk_store_id = $1 LIMIT 2;
      `
      let param = [item.store_id]
      return database.query(sql, param)
    })
    const responseFood = await Promise.all(task)
    const foodList = responseFood.map((item) => item.rows)
    const addDistance = response.rows.map((item, index) => ({
      ...item,
      distance: (Math.random() * 10).toFixed(2),
      shipping: (Math.random() * 100).toFixed(2),
      minute: (Math.random() * 61).toFixed(0),
      food: foodList[index],
    }))
    const result = _(addDistance).groupBy((x) => x.branch_type_id)
    responseData.success = true
    responseData.data = [...result]
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
