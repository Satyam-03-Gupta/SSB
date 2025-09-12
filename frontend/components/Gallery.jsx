import { useState } from "react";
import "../src/App.css";
const galleryImages = [
  "/assets/Gallery/g1.jpg",
  "/assets/Gallery/g2.jpg",
  "/assets/Gallery/g3.jpg",
  "/assets/Gallery/g4.jpg",
  "/assets/Gallery/g5.jpg",
  "/assets/Gallery/g6.jpg",
  "/assets/Gallery/g7.jpg",
  "/assets/Gallery/g8.jpg",
  "/assets/Gallery/g9.jpg",
  "/assets/Gallery/g10.jpg",
  "/assets/Gallery/g11.jpg",
  "/assets/Gallery/g12.jpg",
  "/assets/Gallery/g13.jpg",
  "/assets/Gallery/g14.jpg",
  "/assets/Gallery/g15.jpg",
  "/assets/Gallery/g16.jpg",
  "/assets/Gallery/g17.jpg",
  "/assets/Gallery/g18.jpg",
  "/assets/Gallery/g19.jpg",
  "/assets/Gallery/g20.jpg"
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Photo Gallery</h1>
      <div className="gallery-grid">
        {galleryImages.map((img, index) => (
          <div key={index} className="gallery-item" onClick={() => setSelectedImage(img)}>
            <img src={img} alt={`Gallery ${index}`} className="gallery-img" />
            <div className="overlay">
              <span>View</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <span className="close">&times;</span>
          <img src={selectedImage} alt="Preview" className="lightbox-img" />
        </div>
      )}
    </div>
  );
}
