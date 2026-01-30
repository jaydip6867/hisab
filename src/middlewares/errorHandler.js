export function notFoundHandler(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.status = 404
  next(error)
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.status || 500
  res.status(statusCode).json({
    message: err.message || 'Server Error',
    details: err.details || undefined
  })
}
