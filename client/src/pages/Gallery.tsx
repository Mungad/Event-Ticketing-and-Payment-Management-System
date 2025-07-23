import { useState } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import one from "../assets/images/gallery/1.jpg";

const images = [
  { src: one, title: "Exploring 3D Movies", description: "Enjoy the immersive experience of 3D cinema. Perfect for movie nights with friends and family!" },
  { src: "/gallery/2.jpg", title: "Behind the Scenes", description: "Candid moment during a rehearsal. Capturing passion and teamwork." },
  { src: "/gallery/3.jpg", title: "Crowd Cheers", description: "A moment of excitement and joy during the main event." },
  { src: "/gallery/4.jpg", title: "Live Performance", description: "Spotlight on the talent. A night to remember." },
  { src: "/gallery/5.jpg", title: "Stage Setup", description: "The calm before the storm. Behind-the-scenes work in progress." },
  { src: "/gallery/6.jpg", title: "Audience Interaction", description: "Engagement is everything. Moments that matter." },
  { src: "/gallery/7.jpg", title: "Tech Team", description: "Making the magic happen with sound and lights." },
  { src: "/gallery/8.jpg", title: "Red Carpet", description: "Glamour and glitz at its best!" },
  { src: "/gallery/9.jpg", title: "Award Moment", description: "The climax of achievement and recognition." },
  { src: "/gallery/10.jpg", title: "Group Cheers", description: "Unity, joy, and celebration in one frame." },
  { src: "/gallery/11.jpg", title: "After Party", description: "Winding down in style after an incredible event." },
  { src: "/gallery/12.jpg", title: "Memories", description: "A still frame of unforgettable memories." },
];

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-black flex flex-col">
      <TopBar />
      <Navbar />

      <div className="flex-grow px-6 py-10 md:px-16 lg:px-24">
        <h2 className="text-center text-3xl font-bold mb-10">
          A STORY BEHIND A PICTURE
        </h2>

        {/* Gallery Grid */}
        {selectedIndex === null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="cursor-pointer group relative overflow-hidden rounded-md shadow-md"
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-32 sm:h-36 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>
            ))}
          </div>
        ) : (
          // Selected Image View
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <img
              src={images[selectedIndex].src}
              alt="Selected"
              className="w-full h-auto max-h-[60vh] object-contain rounded"
            />
            <h3 className="mt-6 text-2xl font-semibold">
              {images[selectedIndex].title}
            </h3>
            <p className="mt-2 text-gray-700">{images[selectedIndex].description}</p>
            <button
              onClick={() => setSelectedIndex(null)}
              className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
