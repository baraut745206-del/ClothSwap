const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

// Get all items (with search & category filter)
router.get('/', async (req, res) => {
  try {
    const { keyword, category, size } = req.query;
    let query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (size) {
      query.size = size;
    }

    const items = await Item.find(query).populate('owner', 'name email location avatar');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single item details
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email location avatar phone');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new clothing item (Protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, size, brand, condition, estimatedValue, images, location } = req.body;

    const item = new Item({
      title,
      description,
      category,
      size,
      brand,
      condition,
      estimatedValue,
      images,
      location,
      owner: req.user._id
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete own item (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;