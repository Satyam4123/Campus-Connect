import React, { useState } from 'react'
import Sidebar from '../components/chat/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'

const Chat = () => {
  const [users, setUsers] = useState([
    {id:1, name:'HARI', department: 'CSE', lastMessage: 'Hey there!', unreadCount: 2, profilePic: ''},
    {id:2, name:'DOggesh Bhai', department: 'ECE', lastMessage: 'See you tomorrow', unreadCount: 0, profilePic: ''}
  ])

  const [selectedUser, setSelectedUser] = useState(null)
  const [showConnectionRequests, setShowConnectionRequests] = useState(false)

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
              <button 
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="New Chat"
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
