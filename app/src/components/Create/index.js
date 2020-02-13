import React, { Component } from "react";
import { Typography, Icon, Card, Button } from "antd";
const { Text } = Typography;
const { Meta } = Card;
const antIcon = <Icon type="loading" style={{ fontSize: "5rem" }} spin />;

class Create extends Component {
  state = {
    classDiv: (
      <img
        height="150px"
        width="180px"
        alt="finger"
        src={process.env.PUBLIC_URL + "finger.png"}
      />
    )
  };

  componentDidMount() {}

  render() {
    return <div style={{ marginTop: "20px" }}>sdasd</div>;
  }
}

export default Create;
