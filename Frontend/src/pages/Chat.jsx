import React, { useState } from 'react'
import Sidebar from '../components/chat/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'
import axios from 'axios'

const Chat = () => {
  const [users, setUsers] = useState([
    {id:1, name:'HARI', department: 'CSE', lastMessage: 'Hey there!', unreadCount: 2, profilePic: ''},
    {id:2, name:'DOggesh Bhai', department: 'ECE', lastMessage: 'See you tomorrow', unreadCount: 0, profilePic: ''}
  ])

  const [selectedUser, setSelectedUser] = useState(null)
  const [showConnectionRequests, setShowConnectionRequests] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAddConnectionRequest = async () => {
    setShowUserSearch(!showUserSearch)
    
    if (!showUserSearch) {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/search/users/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.data.users) {
          setAllUsers(response.data.users)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        alert('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
  }

  const sendConnectionRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/message/request/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.message) {
        alert('Connection request sent successfully!')
        setAllUsers(prev => prev.filter(user => user._id !== userId))
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      alert('Failed to send connection request')
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowConnectionRequests(!showConnectionRequests)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Connection Requests"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </button>
              <button onClick={handleAddConnectionRequest}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Add connection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Connection Requests Panel */}
        {showConnectionRequests && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Connection Requests</h3>
            <div className="text-sm text-gray-500">No pending requests</div>
          </div>
        )}

        {/* User Search Panel */}
        {showUserSearch && (
          <div className="p-4 bg-green-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Find Users</h3>
            
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading users...</p>
                </div>
              ) : allUsers.length > 0 ? (
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.department} • Year {user.year}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => sendConnectionRequest(user._id)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  Click the button above to load users
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar users={users} onSelectedUser={setSelectedUser} selectedUser={selectedUser} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  )
}

export default Chat
