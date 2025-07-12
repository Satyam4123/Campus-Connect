import React from 'react'

const Sidebar = ({users, onSelectedUser}) => {
  return (
    <div>
      <h2 className='text-xl font-bold'>Connected Users</h2>
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id} onClick={() => onSelectedUser(user)}>
              {user.name}
            </li>
          );
        })}

      </ul>
    </div>
  )
}

export default Sidebar
