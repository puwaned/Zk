import React, { Component } from "react";
import { Menu, Icon } from "antd";
const { SubMenu } = Menu;
class RightMenu extends Component {
  render() {
    return (
      <Menu mode="horizontal">
        <SubMenu
          title={
            <span className="submenu-title-wrapper">
              <Icon type="question-circle" />
              About
            </span>
          }
        >
          <Menu.ItemGroup title="About">
            <Menu.Item key="setting:1">
              <Icon type="file-unknown" />
              How to use It!
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="Contact us">
            <Menu.Item key="setting:3">
              <Icon type="facebook" />
              facebook
            </Menu.Item>
            <Menu.Item key="setting:4">
              <Icon type="github" />
              github
            </Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
      </Menu>
    );
  }
}
export default RightMenu;
