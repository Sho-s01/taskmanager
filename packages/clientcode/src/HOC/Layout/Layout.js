import React from 'react';
import '../../components/Headers/Header';
import Header from '../../components/Headers/Header';

const Layout = (props) => {
    return (
           <div>
               <Header/>
               <div style={{width:"-webkit-fill-available"}}>{props.children}</div>
           </div>
    )
}
export default Layout;