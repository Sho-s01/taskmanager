import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

let clear = () =>{
    console.log('log outt')
    localStorage.clear();
}

const Header = (props) => {
    return (
        <div className="header">
            <div className="headerElement">
                <h2 style={{ color: "white" }}>Task Tracker</h2>
                <div className="moveCenter">
                    {/* className="btn btn-linkn" */}
                    {localStorage.getItem('token') ?
                        <Link to="/login" style={{ color: "white" }}
                         onClick={()=>clear()
                    }>Log out</Link>
                        : ""}
                </div>
        </div>
        </div >
    )
}
export default Header;