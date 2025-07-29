import Topbar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1] text-black">
      {/* Topbar & Navbar */}
      <Topbar />
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-20 py-10">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">
            About Us
          </h1>
          <p className="text-lg leading-relaxed text-gray-800">
            Welcome to our Event Ticketing and Venue Booking System! <br />
            We are passionate about connecting people with unforgettable experiences through seamless event discovery, easy ticketing, and reliable venue booking.
          </p>

          <div className="mt-10 space-y-6 text-left">
            <div>
              <h2 className="text-2xl font-semibold text-orange-500 mb-2">🎟 Easy Ticket Booking</h2>
              <p>
                Book tickets for your favorite events in just a few clicks. From concerts and conferences to plays and parties, we’ve got you covered.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-orange-500 mb-2">📍 Venue Management</h2>
              <p>
                Event organizers can list, manage, and promote their venues easily. Get insights, control bookings, and ensure smooth operations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-orange-500 mb-2">💬 Customer Support</h2>
              <p>
                Our support team is ready to assist with ticketing issues, payment queries, and venue concerns to give you the best experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
