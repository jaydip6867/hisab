import Joi from 'joi'

export const createTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().iso().required(),
  note: Joi.string().min(1).required(),
  firm: Joi.string().valid('CDMI', 'Jaydip', 'Mishal').required(),
  account: Joi.string().valid('cash', 'bank').required()
})

export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense'),
  amount: Joi.number().positive(),
  date: Joi.date().iso(),
  note: Joi.string().min(1),
  firm: Joi.string().valid('CDMI', 'Jaydip', 'Mishal'),
  account: Joi.string().valid('cash', 'bank')
})