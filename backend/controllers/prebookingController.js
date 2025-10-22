import Prebooking from '../models/Prebooking.js';

// Create prebooking
export const createPrebooking = async (req, res) => {
  try {
    const { orderId, userEmail, phoneNumber, deliveryAddress, items, subtotal, deliveryFee, gst, totalAmount, preferredDate } = req.body;
    
    const prebooking = new Prebooking({
      orderId,
      userEmail,
      phoneNumber,
      deliveryAddress,
      items,
      subtotal,
      deliveryFee,
      gst,
      totalAmount,
      preferredDate
    });

    await prebooking.save();
    res.status(201).json({ message: 'Prebooking created successfully', prebooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating prebooking', error: error.message });
  }
};

// Get user prebookings
export const getUserPrebookings = async (req, res) => {
  try {
    const { email } = req.params;
    const prebookings = await Prebooking.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(prebookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prebookings', error: error.message });
  }
};

// Get all prebookings (admin)
export const getAllPrebookings = async (req, res) => {
  try {
    const prebookings = await Prebooking.find().sort({ createdAt: -1 });
    res.json(prebookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prebookings', error: error.message });
  }
};

// Update prebooking status
export const updatePrebookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const prebooking = await Prebooking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!prebooking) {
      return res.status(404).json({ message: 'Prebooking not found' });
    }
    
    res.json({ message: 'Prebooking status updated', prebooking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating prebooking', error: error.message });
  }
};