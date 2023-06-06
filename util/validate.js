exports.validateKey = (data, validateKey) => {
  const msg = validateKey
    .reduce((acc, cur) => {
      if (!data[cur]) {
        return [...acc, `${cur} is undefined`]
      }
      return [...acc]
    }, [])
    .join(', and ')

  return msg
}
