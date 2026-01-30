import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    note: { type: String, trim: true, required: true }, // Particular
    firm: { type: String, enum: ['CDMI', 'Jaydip', 'Mishal'], required: true },
    account: { type: String, enum: ['cash', 'bank'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // new
  },
  { timestamps: true }
)

TransactionSchema.index({ date: 1 })
TransactionSchema.index({ type: 1 })
// Optional speed-up: TransactionSchema.index({ createdBy: 1 })

export default mongoose.model('Transaction', TransactionSchema)