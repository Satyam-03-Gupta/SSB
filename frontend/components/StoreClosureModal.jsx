import React, { useState } from 'react';
import './StoreClosureModal.css';

const StoreClosureModal = ({ isOpen, onClose, storeData, onPrebookClick }) => {
  if (!isOpen) return null;

  return (
    <div className="store-closure-overlay">
      <div className="store-closure-modal">
        <div className="store-closure-header">
          <h2>🏪 Store Temporarily Closed</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="store-closure-content">
          <div className="closure-icon">
            <span>🔒</span>
          </div>
          
          <p className="closure-message">
            {storeData?.message || "We're currently out of stock. Please come back tomorrow!"}
          </p>
          
          {storeData?.reopenTime && (
            <p className="reopen-time">
              Expected to reopen: {new Date(storeData.reopenTime).toLocaleDateString()}
            </p>
          )}
          
          <div className="closure-actions">
            <button className="comeback-btn" onClick={onClose}>
              Come Back Tomorrow
            </button>
            
            {storeData?.allowPrebooking && (
              <button className="prebook-btn" onClick={onPrebookClick}>
                📅 Make a Prebooking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreClosureModal;