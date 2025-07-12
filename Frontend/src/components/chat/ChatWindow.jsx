import React from 'react'
import MsgBubble from './MsgBubble'
import MsgIP from './MsgIP'

const ChatWindow = ({selectedUser}) => {
    return (
        <div>
            {selectedUser ? (
                <p className='p-4'>Chat with {selectedUser.name}</p>
            ) : (
                <p className='p-4'>Click on a connected user</p>
            )}

            <MsgBubble />
            <MsgIP />
        </div>
    )
}

export default ChatWindow
