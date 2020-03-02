import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";
class LeftMenu extends Component {
  state = {
    current: "home"
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    return (
      <Menu
        mode="horizontal"
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
      >
        <Menu.Item key="home">
          <Link to="/">
            <Icon type="home" />
            Home
          </Link>
        </Menu.Item>
        <Menu.Item key="dev">
          <Link to="/dev">
            <Icon type="tool" />
            For Developer
          </Link>
        </Menu.Item>
      </Menu>
    );
  }
}
export default LeftMenu;
