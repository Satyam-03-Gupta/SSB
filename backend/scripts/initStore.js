import mongoose from 'mongoose';
import Store from '../models/Store.js';
import dotenv from 'dotenv';

dotenv.config();

const initStore = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existingStore = await Store.findOne();
    if (!existingStore) {
      const store = new Store({
        isOpen: true,
        allowPrebooking: true,
        message: "Store is temporarily closed due to stock shortage. Please come back tomorrow or make a prebooking."
      });
      await store.save();
      console.log('Store initialized successfully');
    } else {
      console.log('Store already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing store:', error);
    process.exit(1);
  }
};

initStore();