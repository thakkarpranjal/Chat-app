import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from './firebase'
import { AuthContext } from './AuthContext'

function Navbar() {
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='navbar'>
        <span className='logo'>Chat App</span>
        <div className='user'>
            <img src={currentUser.photoURL} alt='' />
            <span>{currentUser.displayName}</span>
            <button onClick={() => signOut(auth)}>Log Out</button>
        </div>
    </div>
  )
}

export default Navbar