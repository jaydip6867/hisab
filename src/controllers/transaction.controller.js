import Transaction from '../models/Transaction.js'
import Drawing from '../models/Drawing.js'

export async function listTransactions(req, res, next) {
  try {
    const { page = 1, limit = 10, type, from, to, firm, account, month } = req.query
    const query = {}
    if (type) query.type = type
    if (firm) query.firm = firm
    if (account) query.account = account
    // Month filter format: YYYY-MM
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split('-').map(Number)
      const start = new Date(y, m - 1, 1)
      const end = new Date(y, m, 0, 23, 59, 59, 999)
      const tx = await Transaction.findById(req.params.id).populate('createdBy', 'email name')
      query.date = { ...(query.date || {}), $gte: start, $lte: end }
    }
    if (from || to) {
      query.date = query.date || {}
      if (from) query.date.$gte = new Date(from)
      if (to) query.date.$lte = new Date(to)
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Transaction.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'email name'),
      Transaction.countDocuments(query)
    ])

    res.json({ items, page: Number(page), limit: Number(limit), total })
  } catch (err) { next(err) }
}

export async function createTransaction(req, res, next) {
  try {
    const payload = { ...req.body, createdBy: req.session?.user?.id }
    const tx = await Transaction.create(payload)
    res.status(201).json(tx)
  } catch (err) { next(err) }
}

export async function getTransaction(req, res, next) {
  try {
    const { createdBy, ...rest } = req.body || {}
    const tx = await Transaction.findByIdAndUpdate(
      req.params.id,
      rest,
      { new: true, runValidators: true }
    )
    if (!tx) return res.status(404).json({ message: 'Transaction not found' })
    res.json(tx)
  } catch (err) { next(err) }
}

export async function updateTransaction(req, res, next) {
  try {
    const tx = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!tx) return res.status(404).json({ message: 'Transaction not found' })
    res.json(tx)
  } catch (err) { next(err) }
}

export async function deleteTransaction(req, res, next) {
  try {
    const tx = await Transaction.findByIdAndDelete(req.params.id)
    if (!tx) return res.status(404).json({ message: 'Transaction not found' })

    // If this transaction corresponds to a Drawing, delete that Drawing as well
    try {
      const note = tx.note || ''
      if (typeof note === 'string' && note.startsWith('Drawing:')) {
        const id = note.split(':')[1]
        if (id && /^[a-fA-F0-9]{24}$/.test(id)) {
          await Drawing.findByIdAndDelete(id)
        }
      }
    } catch (_e) {
      // Ignore cascade errors; transaction delete already succeeded
    }

    res.json({ message: 'Deleted' })
  } catch (err) { next(err) }
}

export async function summaryStats(req, res, next) {
  try {
    const { from, to } = req.query
    const match = {}
    if (from || to) {
      match.date = {}
      if (from) match.date.$gte = new Date(from)
      if (to) match.date.$lte = new Date(to)
    }

    const pipeline = [
      { $match: match },
      {
        $facet: {
          totals: [
            { $group: { _id: '$type', amount: { $sum: '$amount' } } }
          ],
          monthly: [
            { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' }, type: '$type' }, amount: { $sum: '$amount' } } },
            { $sort: { '_id.y': 1, '_id.m': 1 } }
          ]
        }
      }
    ]

    const [result] = await Transaction.aggregate(pipeline)
    const incomeTotal = result.totals.find(t => t._id === 'income')?.amount || 0
    const expenseTotal = result.totals.find(t => t._id === 'expense')?.amount || 0
    const balance = incomeTotal - expenseTotal

    res.json({ incomeTotal, expenseTotal, balance, monthly: result.monthly })
  } catch (err) { next(err) }
}