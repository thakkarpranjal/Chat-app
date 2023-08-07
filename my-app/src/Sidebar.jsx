import React from 'react'
import './style.scss';
import Navbar from './Navbar';
import Search from './Search';
import Chat from './Chat';
import Chats from './Chats';
function Sidebar() {
  return (
    <div className='sidebar'>
        <Navbar />
        <Search />
        <Chats />
    </div>
  )
}

export default Sidebar