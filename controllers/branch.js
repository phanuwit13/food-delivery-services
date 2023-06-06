const database = require('../database')

exports.addBranchType = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    let data = req.body
    let branchTypeName = data.branch_type_name
    let branchTypeImage = data.branch_type_image

    let sql = `INSERT INTO branch_type
    (branch_type_name, branch_type_image)
    VALUES($1,$2);
    `
    let param = [branchTypeName, branchTypeImage]
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

exports.getBranchType = async (req, res, next) => {
  let client = await database.connect()
  let responseData = {}
  try {
    let sql = `SELECT * from branch_type`

    let response = await database.query(sql)
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

// exports.getBranchType = async (req, res, next) => {
//   let client = await database.connect()
//   let responseData = {}
//   try {
//     let sql = `SELECT * from branch left join branch_type on store.fk_branch = branch`

//     let response = await database.query(sql)
//     console.log('response.rows', response.rows)

//     responseData.success = true
//     responseData.data = response.rows
//   } catch (error) {
//     console.log(error)
//     responseData.success = false
//   } finally {
//     client.release()
//   }

//   res.data = {
//     ...responseData,
//   }
//   next()
// }