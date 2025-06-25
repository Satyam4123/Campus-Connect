import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

const Events = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    time: "",
    location: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventMap = {};
      res.data.events.forEach(event => {
        const key = new Date(event.date).toDateString();
        if (!eventMap[key]) eventMap[key] = [];
        eventMap[key].push(event);
      });
      setEvents(eventMap);
      setAllEvents(res.data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleDateClick = (date) => {
    const dateKey = date.toDateString();
    if (events[dateKey]) {
      setSelectedEvent(events[dateKey][0]);
    } else {
      setSelectedDate(date);
      setShowCreateModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/events/new",
        {
          ...formData,
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setFormData({ eventName: "", description: "", time: "", location: "" });
      setShowCreateModal(false);
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event.");
    }
  };

  const renderCalendar = () => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];

    const startDay = start.getDay();
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} />);

    for (let i = 1; i <= end.getDate(); i++) {
      const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const hasEvent = events[thisDate.toDateString()];
      days.push(
        <div
          key={i}
          onClick={() => handleDateClick(thisDate)}
          className={`relative aspect-square flex items-center justify-center rounded border cursor-pointer transition-all hover:bg-gray-50 ${hasEvent ? "bg-blue-50 border-blue-200" : "border-gray-200"
            }`}
        >
          <span className="text-sm">{i}</span>
          {hasEvent && (
            <Eye
              className="absolute top-1 right-1 w-4 h-4 text-blue-500 hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(hasEvent[0]);
              }}
            />
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
      {/* Calendar Section */}
      <div>
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
          <button
            className="p-1 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
              )
            }
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-gray-800 font-semibold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric"
            })}
          </h2>
          <button
            className="p-1 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
              )
            }
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      {/* Event List Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm max-h-[600px] overflow-y-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Upcoming Events</h2>
        {allEvents.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <ul className="space-y-4 text">
            {allEvents.map((event) => (
              <li
                key={event._id}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <h6 className="font-semibold text-gray-800">{event.eventName}</h6>
                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                {event.time && <p className="text-sm text-gray-500">⏰ {event.time}</p>}
                {event.location && <p className="text-sm text-gray-500">📍 {event.location}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-2">{selectedEvent.eventName}</h2>
            {selectedEvent.description && (
              <p className="text-gray-700 mb-2">{selectedEvent.description}</p>
            )}
            {selectedEvent.date && (
              <p className="text-sm text-gray-500 mb-1">
                Date: {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
            )}
            {selectedEvent.time && (
              <p className="text-sm text-gray-500 mb-1">Time: {selectedEvent.time}</p>
            )}
            {selectedEvent.location && (
              <p className="text-sm text-gray-500">Location: {selectedEvent.location}</p>
            )}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-4">Create Event</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Event Name"
                className="w-full mb-3 p-2 border border-gray-300 rounded"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full mb-3 p-2 border border-gray-300 rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Time"
                className="w-full mb-3 p-2 border border-gray-300 rounded"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
