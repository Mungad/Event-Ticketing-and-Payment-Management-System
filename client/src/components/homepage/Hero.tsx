import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-orange-600 to-red-600 text-white flex flex-col justify-center items-center text-center px-4">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Make Your Dream Come True</h2>
      <p className="text-lg mb-8">Meet your favorite artists, sport teams and parties</p>

      <form
        onSubmit={handleSearch}
        className="bg-white rounded-full flex items-center px-4 py-3 w-full max-w-xl"
      >
        <input
          type="text"
          placeholder="Search Artist, Team, or Venue"
          className="flex-grow outline-none text-black px-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <Search className="text-orange-600 w-5 h-5" />
        </button>
      </form>

      <div className="text-sm mt-4">
        📍 Westlands{' '}
        <Link to="/location" className="underline text-white hover:text-gray-200">
          Change Location
        </Link>
      </div>
    </div>
  );
};

export default Hero;
