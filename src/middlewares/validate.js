export const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true })
  if (error) {
    error.status = 400
    error.details = error.details?.map(d => ({ message: d.message, path: d.path }))
    return next(error)
  }
  req.body = value
  next()
}
