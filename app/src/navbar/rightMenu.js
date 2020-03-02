import React, { Component } from "react";
import { Menu, Icon } from "antd";
import Licence from "../components/Home/Licence";
const { SubMenu } = Menu;
class RightMenu extends Component {
  state = { visible: false };
  render() {
    const handleModal = e => {
      this.setState({ visible: e });
    };
    return (
      <div>
        <Licence visible={this.state.visible} parentCallback={handleModal} />
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
              <Menu.Item key="setting:1" onClick={() => handleModal(true)}>
                <Icon type="file-unknown" />
                Disclaimer
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Contact us">
              <Menu.Item key="setting:3">
                <a
                  href="https://web.facebook.com/puwanedz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon type="facebook" />
                  facebook
                </a>
              </Menu.Item>
              <Menu.Item key="setting:4">
                <a
                  href="https://github.com/puwaned"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon type="github" />
                  github
                </a>
              </Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}
export default RightMenu;
