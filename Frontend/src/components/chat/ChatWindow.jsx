import React, { useState } from 'react'
import MsgBubble from './MsgBubble'
import MsgIP from './MsgIP'

const ChatWindow = ({selectedUser}) => {
    const [message, setMessage] = useState('')
    
    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (message.trim()) {
            // TODO: Send message logic
            // Message sent
            setMessage('')
        }
    }

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Campus Connect Chat</h3>
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        {selectedUser.profilePic ? (
                            <img 
                                src={selectedUser.profilePic} 
                                alt={selectedUser.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {getInitials(selectedUser.name)}
                            </div>
                        )}
                        
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h2>
                            <p className="text-sm text-gray-500">{selectedUser.department} • Online</p>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <MsgBubble selectedUser={selectedUser} />
            </div>

            {/* Message Input */}
            <div className="px-4 py-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={`Message ${selectedUser.name}...`}
                                className="w-full px-4 py-3 pr-12 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatWindow
