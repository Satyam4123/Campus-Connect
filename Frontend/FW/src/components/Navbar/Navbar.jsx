import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = ({setShowLogin}) => {
    const [menu,setMenu]=useState("home")
  return (
    <div className="Navbar">
        <img src={assets.logo} alt="" className="SIlogo" />
        <ul className="navbar-menu">
            <li OnClick={()=>setMenu("home")} className={menu=="home"?"active":""}>Home</li>
            <li OnClick={()=>setMenu("About Us")} className={menu=="About Us"?"active":""}>About Us</li>
            <li OnClick={()=>setMenu("Contact Us")} className={menu=="Contact Us"?"active":""}>Contact Us</li>
        </ul>
        <div className="navbar-right">
               <img src={assets.search_icon} alt="" className="mfg" />
               <button onClick={()=>setShowLogin(true)}>Sign In</button>
        </div>
    </div>
  )
}

export default Navbar
