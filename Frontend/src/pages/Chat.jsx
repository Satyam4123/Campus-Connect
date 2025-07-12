import React from 'react'
import Sidebar from '../components/chat/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'
import { useState } from 'react'  


const Chat = () => {

  const [users, setUsers] = useState([
    {id:1, name:'A'},
    {id:1, name:'B'}
  ])

  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-black p-4">
        <Sidebar users={users} onSelectedUser={setSelectedUser} />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow selectedUser={selectedUser}/>
      </div>
    </div>
  )
}

export default Chat
