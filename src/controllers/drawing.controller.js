import Drawing from '../models/Drawing.js'
import Transaction from '../models/Transaction.js'

export async function listDrawings(req, res, next) {
  try {
    const { page = 1, limit = 10, month, firm, account, from, to } = req.query
    const query = {}
    if (firm) query.firm = firm
    if (account) query.account = account
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split('-').map(Number)
      const start = new Date(y, m - 1, 1)
      const end = new Date(y, m, 0, 23, 59, 59, 999)
      query.date = { ...(query.date || {}), $gte: start, $lte: end }
    }
    if (from || to) {
      query.date = query.date || {}
      if (from) query.date.$gte = new Date(from)
      if (to) query.date.$lte = new Date(to)
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Drawing.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)).populate('createdBy', 'email name'),
      Drawing.countDocuments(query)
    ])

    res.json({ items, page: Number(page), limit: Number(limit), total })
  } catch (err) { next(err) }
}

export async function createDrawing(req, res, next) {
  try {
    const payload = { ...req.body, createdBy: req.session?.user?.id }
    const doc = await Drawing.create(payload)
    // Immediately mirror this drawing into Transactions as an expense entry
    try {
      await Transaction.create({
        type: 'expense',
        amount: payload.amount,
        date: payload.date || new Date(),
        note: `Drawing:${doc._id}`,
        firm: payload.firm,
        account: payload.account,
        createdBy: payload.createdBy
      })
    } catch (e) {
      // Do not fail the drawing creation if mirroring fails; log instead
      console.error('Failed to mirror drawing to transaction:', e?.message)
    }
    res.status(201).json(doc)
  } catch (err) { next(err) }
}

export async function deleteDrawing(req, res, next) {
  try {
    const doc = await Drawing.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    // Also delete the mirrored transaction created for this drawing
    try {
      await Transaction.deleteMany({ note: `Drawing:${doc._id}` })
    } catch (_e) { /* ignore cascade errors */ }
    res.json({ message: 'Deleted' })
  } catch (err) { next(err) }
}

export async function summaryDrawings(req, res, next) {
  try {
    const { month, firm, account, from, to } = req.query
    const match = {}
    if (firm) match.firm = firm
    if (account) match.account = account
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split('-').map(Number)
      const start = new Date(y, m - 1, 1)
      const end = new Date(y, m, 0, 23, 59, 59, 999)
      match.date = { ...(match.date || {}), $gte: start, $lte: end }
    }
    if (from || to) {
      match.date = match.date || {}
      if (from) match.date.$gte = new Date(from)
      if (to) match.date.$lte = new Date(to)
    }

    const pipeline = [ { $match: match }, { $group: { _id: null, total: { $sum: '$amount' } } } ]
    const [result] = await Drawing.aggregate(pipeline)
    res.json({ total: result?.total || 0 })
  } catch (err) { next(err) }
}
