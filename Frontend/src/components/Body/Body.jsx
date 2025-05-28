import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Calendar, ChevronLeft, ChevronRight, Eye, FileText, Folder, Home, MessageCircle, Plus, Search, Trash, User, X, Edit3, UserPen } from "lucide-react";
import "./Body.css";
import axios from 'axios'
import Profile from "../ProfilePage";

export default function SmartCampusConnect() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    announcements: [],
    users: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncementId, setEditAnnouncementId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [events, setEvents] = useState({});
  const [user, setUser] = useState(null);
  
  // New states for announcement modal
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/announcements', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnnouncements(response.data)
      } catch (error) {
        console.error("Error fetching announcements", error)
      }
    }
    if (activeSection === 'home') {
      fetchAnnouncements()
    }
  }, [activeSection])

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        handleSearch();
      } else {
        setIsSearching(false);
        setSearchResults({
          announcements: [],
          users: []
        });
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults({
        announcements: response.data.announcements || [],
        users: response.data.users || []
      });
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({
      announcements: [],
      users: []
    });
    setIsSearching(false);
  };

  // New function to handle announcement creation
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/announcements/add', {
        title: newAnnouncement.title,
        content: newAnnouncement.content
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Add the new announcement to the list
      setAnnouncements(prev => [response.data.newAnnouncement, ...prev]);
      
      // Reset form and close modal
      setNewAnnouncement({ title: '', content: '' });
      setShowAnnouncementModal(false);
      
      alert('Announcement created successfully!');
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert('Error creating announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addResource = (type) => {
    const newResource = {
      id: Date.now(),
      name: type === "folder" ? "New Folder" : "New File",
      type,
      addedBy: user.name || "Current User",
      dateAdded: new Date(),
    };
    setResources([...resources, newResource]);
  };

  const deleteResource = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const viewResource = (resource) => {
    alert(`Viewing ${resource.type}: ${resource.name}`);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    clearSearch();
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (unreadNotifications > 0) {
      setUnreadNotifications(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
  };

  const deleteAnnouncement = async (id) => {
    // This would need a delete endpoint on your backend
    setAnnouncements(announcements.filter((announcement) => announcement._id !== id));
  };

  const editAnnouncement = (id, newContent) => {
    setAnnouncements(
      announcements.map((announcement) =>
        announcement._id === id ? { ...announcement, content: newContent } : announcement
      )
    );
  };

  const toggleEditAnnouncement = (id) => {
    setEditAnnouncementId(editAnnouncementId === id ? null : id);
  };

  const addEvent = (date) => {
    const eventContent = prompt("Enter event details:");
    if (eventContent) {
      setEvents({
        ...events,
        [date.toDateString()]: eventContent,
      });
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const eventExists = events[currentDay.toDateString()];
      days.push(
        <div
          key={i}
          className={`calendar-day ${eventExists ? "event-day" : ""}`}
          onClick={() => addEvent(currentDay)}
        >
          <span className="day-number">{i}</span>
          {eventExists && (
            <Eye
              className="view-event-icon"
              onClick={(e) => {
                e.stopPropagation();
                alert(events[currentDay.toDateString()]);
              }}
            />
          )}
          <Plus
            className="add-event-icon"
            onClick={(e) => {
              e.stopPropagation();
              addEvent(currentDay);
            }}
          />
        </div>
      );
    }
    return days;
  };

  const displayedAnnouncements = searchQuery.trim() !== '' && searchResults.announcements.length > 0
    ? searchResults.announcements
    : announcements;

  return (
    <div className="smart-campus-connect">
      <nav className="navbar">
        <h1 className="app-title">SMART CAMPUS CONNECT</h1>
        <div className="nav-actions">
          <div className="search-container flex justify-center items-center">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search announcements, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <X
                className="clear-search-icon"
                onClick={clearSearch}
                style={{ cursor: 'pointer', position: 'absolute', right: '10px' }}
              />
            )}
          </div>
          <button
            className="notification-button"
            onClick={handleNotificationClick}
          >
            <Bell />
            {unreadNotifications > 0 && <span className="notification-indicator" />}
          </button>
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <X
                  className="close-icon"
                  onClick={() => setShowNotifications(false)}
                />
              </div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                >
                  {notification.content}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userId')
              navigate('/login');
            }}
            className="mr-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-200 text-black rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create New Announcement</h2>
              <button
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setNewAnnouncement({ title: '', content: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateAnnouncement}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  rows="4"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter announcement content"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAnnouncementModal(false);
                    setNewAnnouncement({ title: '', content: '' });
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="main-content">
        <aside className="sidebar">
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("home")}
          >
            <Home className="sidebar-icon" />
            <span>Home</span>
          </button>
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("calendar")}
          >
            <Calendar className="sidebar-icon" />
            <span>Calendar</span>
          </button>
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("resources")}
          >
            <FileText className="sidebar-icon" />
            <span>Resources</span>
          </button>
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("messages")}
          >
            <MessageCircle className="sidebar-icon" />
            <span>Messages</span>
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/profile")}
          >
            <UserPen className="sidebar-icon" />
            <span>Profile</span>
          </button>
        </aside>
        
        <main className="content-area">
          {activeSection === "home" && (
            <section className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {searchQuery.trim() !== '' ? 'Search Results' : 'Announcements'}
                </h2>
                {user && (
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="mr-2" size={18} />
                    New Announcement
                  </button>
                )}
              </div>
              
              {/* Search results section */}
              {searchQuery.trim() !== '' && (
                <div className="mb-6">
                  {isSearching ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Searching...</p>
                    </div>
                  ) : (
                    <>
                      {searchResults.announcements.length === 0 && searchResults.users.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No results found for "{searchQuery}"</p>
                        </div>
                      ) : (
                        <>
                          {searchResults.users.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold text-gray-700 mb-3">Users</h3>
                              <div className="space-y-2">
                                {searchResults.users.map(user => (
                                  <div key={user._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                                    <User className="mr-3 text-gray-500" size={20} />
                                    <div>
                                      <p className="font-medium">{user.name}</p>
                                      {user.department && <p className="text-sm text-gray-500">{user.department}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {/* Display announcements */}
              {displayedAnnouncements.length === 0 && !isSearching ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery.trim() !== ''
                    ? "No announcements found matching your search."
                    : "No announcements yet. Check back later!"}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedAnnouncements.map((announcement) => (
                    <div key={announcement._id} className="bg-slate-900 border-solid border-2 border-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-red-700">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Posted by {announcement.author} • {new Date(announcement.date).toLocaleDateString()}
                          </p>
                        </div>
                        {user && user.name === announcement.author && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleEditAnnouncement(announcement._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => deleteAnnouncement(announcement._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-gray-700">
                        {editAnnouncementId === announcement._id ? (
                          <textarea
                            value={announcement.content}
                            onChange={(e) => editAnnouncement(announcement._id, e.target.value)}
                            className="w-full p-2 border rounded"
                            onBlur={() => setEditAnnouncementId(null)}
                          />
                        ) : (
                          <p className="text-white">{announcement.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          
          {activeSection === "calendar" && (
            <section className="calendar-section">
              <div className="calendar-header">
                <button
                  className="calendar-nav-button"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1
                      )
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <h2>
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <button
                  className="calendar-nav-button"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1
                      )
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>
              <div className="calendar-grid">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
                {renderCalendar()}
              </div>
            </section>
          )}
          
          {activeSection === "resources" && (
            <section className="resources-section">
              <h2>Resources</h2>
              <div className="resources-actions">
                <button
                  className="action-button"
                  onClick={() => addResource("file")}
                >
                  <Plus className="button-icon" />
                  Add File
                </button>
                <button
                  className="action-button"
                  onClick={() => addResource("folder")}
                >
                  <Folder className="button-icon" />
                  Add Folder
                </button>
              </div>
              <div className="resources-list">
                {resources.map((resource) => (
                  <div key={resource.id} className="resource-item">
                    <div className="resource-info">
                      {resource.type === "folder" ? (
                        <Folder className="resource-icon" />
                      ) : (
                        <FileText className="resource-icon" />
                      )}
                      <div>
                        <p className="resource-name">{resource.name}</p>
                        <p className="resource-uploader">
                          <User className="resource-uploader-icon" />
                          Added by {resource.addedBy}
                        </p>
                      </div>
                    </div>
                    <div className="resource-actions">
                      <button
                        className="icon-button"
                        onClick={() => viewResource(resource)}
                      >
                        <Eye className="action-icon" />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => deleteResource(resource.id)}
                      >
                        <Trash className="action-icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {activeSection === "messages" && (
            <section className="messages-section">
              <h2>Messages</h2>
              <p>To be implemented: Messaging System</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}