import Store from '../models/Store.js';

// Get store status
export const getStoreStatus = async (req, res) => {
  try {
    let store = await Store.findOne();
    if (!store) {
      store = new Store();
      await store.save();
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update store status (admin only)
export const updateStoreStatus = async (req, res) => {
  try {
    const { isOpen, closureReason, reopenTime, allowPrebooking, message } = req.body;
    
    let store = await Store.findOne();
    if (!store) {
      store = new Store();
    }
    
    store.isOpen = isOpen;
    store.closureReason = closureReason || "";
    store.reopenTime = reopenTime;
    store.allowPrebooking = allowPrebooking;
    store.message = message || "Store is temporarily closed. Please come back tomorrow or make a prebooking.";
    
    await store.save();
    res.json({ message: 'Store status updated', store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};