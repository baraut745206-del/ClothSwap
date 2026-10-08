const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

// Send swap request
router.post('/', protect, async (req, res) => {
  try {
    const { requestedItemId, offeredItemId, message } = req.body;

    const requestedItem = await Item.findById(requestedItemId);
    const offeredItem = await Item.findById(offeredItemId);

    if (!requestedItem || !offeredItem) {
      return res.status(404).json({ message: 'One or both items not found' });
    }

    if (offeredItem.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only offer items you own' });
    }

    const swap = await SwapRequest.create({
      requester: req.user._id,
      receiver: requestedItem.owner,
      offeredItem: offeredItemId,
      requestedItem: requestedItemId,
      message
    });

    res.status(201).json(swap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user's swaps (Sent & Received)
router.get('/my-swaps', protect, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }]
    })
      .populate('requester', 'name email')
      .populate('receiver', 'name email')
      .populate('offeredItem')
      .populate('requestedItem');

    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update swap status (Accept / Reject)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) return res.status(404).json({ message: 'Swap request not found' });

    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only receiver can accept or reject this swap' });
    }

    swap.status = status;
    await swap.save();

    if (status === 'Accepted') {
      await Item.findByIdAndUpdate(swap.offeredItem, { status: 'Swapped' });
      await Item.findByIdAndUpdate(swap.requestedItem, { status: 'Swapped' });
    }

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;