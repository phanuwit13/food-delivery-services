const database = require('../database')
const validate = require('../util/validate')

exports.addAddons = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    let data = req.body
    let addonsName = data.addons_name
    let addonsPrice = data.addons_price
    let fkStoreId = data.fk_store_id
    
    if (!addonsName) {
      const key = ['addonsName']
      const msg = validate.validateKey(data, key)
      const response = {
        success: false,
        msg,
      }
      res.status(502).json(response)
      next()
    }

    let sql = `INSERT INTO addons
    (addons_name, addons_price,fk_store_id)
    VALUES($1,$2,$3);
    `
    let param = [addonsName, addonsPrice,fkStoreId]
    await database.query(sql, param)

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

exports.getAddAddonsByStore = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    const storeId = req.query.store_id
    let sql = `SELECT * from addons where fk_store_id = $1`
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