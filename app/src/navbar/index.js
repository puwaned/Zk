import React, { Component } from "react";
import LeftMenu from "./leftMenu";
import RightMenu from "./rightMenu";

class Navbar extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );
  render() {
    return (
      <nav className="menuBar">
        <div className="logo">
          <a href="/">Zk-voting</a>
        </div>
        <div className="menuCon">
          <div className="leftMenu">
            <LeftMenu />
          </div>
          <div className="rightMenu">
            <RightMenu />
          </div>
        </div>
      </nav>
    );
  }
}
export default Navbar;
