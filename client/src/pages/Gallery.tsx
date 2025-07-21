import { useState } from "react";
import one from "../assets/images/gallery/1.jpg";

const images = [
  one,
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.jpg",
  "/gallery/5.jpg",
  "/gallery/6.jpg",
  "/gallery/7.jpg",
  "/gallery/8.jpg",
  "/gallery/9.jpg",
  "/gallery/10.jpg",
  "/gallery/11.jpg",
  "/gallery/12.jpg",
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-8 md:px-16 lg:px-24">
      <h2 className="text-center text-3xl font-bold mb-10">
        A STORY BEHIND A PICTURES
      </h2>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="cursor-pointer group relative overflow-hidden rounded-md"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img}
              alt={`Gallery ${index}`}
              className="w-full h-32 sm:h-36 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center gap-3 items-center">
  
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 rounded-lg p-4">
            <img
              src={selectedImage}
              alt="Zoomed In"
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
