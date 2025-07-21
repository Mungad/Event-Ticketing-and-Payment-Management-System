import { Link } from 'react-router';
import Music from '../../assets/images/events/music.jpg';
import Sports from '../../assets/images/events/sports.jpg'
import Parties from '../../assets/images/events/parties.jpg';
import Communities from '../../assets/images/events/communities.jpg';
import Theaters from '../../assets/images/events/theaters.jpg';
import Concerts from '../../assets/images/events/concerts.jpg';

const categories = [
  { title: 'Music', image: Music },
  { title: 'Sports', image: Sports },
  { title: 'Parties', image: Parties },
  { title: 'Communities', image: Communities },
  { title: 'Theaters', image: Theaters },
  { title: 'Concerts', image: Concerts },
];

export default function CategoryPage() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h2 className="text-2xl text-gray-800 font-bold mb-6 border-l-4 border-orange-500 pl-3">
        Events by Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            to={`/category/${cat.title.toLowerCase()}`}
            className="relative group overflow-hidden rounded-md shadow-md h-48"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover brightness-50 group-hover:brightness-100 transition duration-300 ease-in-out"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
              {cat.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
