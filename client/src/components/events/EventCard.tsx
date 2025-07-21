interface Props {
  event: {
    id: string;
    title: string;
    image: string;
    date: string;
    venue: string;
    description: string;
  };
}

export default function EventCard({ event }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{event.title}</h3>
        <p className="text-sm text-gray-600">{event.date} @ {event.venue}</p>
        <p className="mt-2 text-gray-700">{event.description.slice(0, 100)}...</p>
      </div>
    </div>
  );
}
