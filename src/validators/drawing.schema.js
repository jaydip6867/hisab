import Joi from 'joi'

export const createDrawingSchema = Joi.object({
  amount: Joi.number().positive().required(),
  date: Joi.date().iso().required(),
  firm: Joi.string().valid('Jaydip', 'Mishal').required(),
  account: Joi.string().valid('cash', 'bank').required()
})

export const updateDrawingSchema = Joi.object({
  amount: Joi.number().positive(),
  date: Joi.date().iso(),
  firm: Joi.string().valid('Jaydip', 'Mishal'),
  account: Joi.string().valid('cash', 'bank')
})
