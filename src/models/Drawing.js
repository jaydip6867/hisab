import mongoose from 'mongoose'

const DrawingSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    firm: { type: String, enum: ['Jaydip', 'Mishal'], required: true },
    account: { type: String, enum: ['cash', 'bank'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

DrawingSchema.index({ date: 1 })
DrawingSchema.index({ firm: 1 })
DrawingSchema.index({ account: 1 })

export default mongoose.model('Drawing', DrawingSchema)
