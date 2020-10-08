import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './Header.css';


const Header = (props) => {
    return (
        <div className="header">
            <div className="headerElement">
                <h2 style={{ color: "white" }}>Task Tracker</h2>
                <div className="moveCenter">{
                    localStorage.getItem('token') ?
                        <Link to="/login" style={{ color: "white" }}
                            onClick={(event) => {
                                event.stopPropagation();
                                localStorage.clear()
                            }}>
                                Log out</Link> : ""}
                </div>
                {/* <div className='signup'>
                   {  localStorage.getItem('token') ? <label className='cursor' onClick={() => {
                       this
                       localStorage.clear()
                    }
                    }>Log Out</label>:""}
                </div> */}
            </div>
        </div >
    )

}
export default Header;