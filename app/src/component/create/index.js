import React, { Component } from "react";
import io from "socket.io-client";
import { Typography, Spin, Icon, Card, Button } from "antd";
const { Text } = Typography;
const { Meta } = Card;
const antIcon = <Icon type="loading" style={{ fontSize: "5rem" }} spin />;
const socket = io("http://127.0.0.1:5001/");

class Create extends Component {
  state = {
    classDiv: (
      <img
        height="150px"
        width="180px"
        src={process.env.PUBLIC_URL + "finger.png"}
      />
    )
  };

  componentDidMount() {
    socket.on("response", msg => {
      let command = JSON.parse(msg);
      switch (command.value) {
        case "start":
          break;
        case "enroll_count2":
          this.setState({
            classDiv: (
              <div style={{ marginTop: "25px" }}>
                {antIcon}
                <p style={{ marginTop: "25px" }}>press finger : 2</p>
              </div>
            )
          });
          break;
        case "enroll_count1":
          this.setState({
            classDiv: (
              <div style={{ marginTop: "25px" }}>
                {antIcon}

                <p style={{ marginTop: "25px" }}>press finger : 1</p>
              </div>
            )
          });

          break;
        case "success":
          this.setState({
            classDiv: (
              <center>
                <div style={{ marginTop: "25px" }}>
                  <p style={{ fontSize: "2rem" }}>Success</p>
                </div>
              </center>
            )
          });
          socket.disconnect();
          break;
        case "fail":
          this.setState({
            classDiv: (
              <center>
                <div style={{ marginTop: "25px" }}>
                  <p style={{ fontSize: "2rem" }}>Fail</p>
                </div>
              </center>
            )
          });
          socket.disconnect();
          break;
      }
    });
  }

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <center>
          <Text code style={{ fontSize: "2rem" }}>
            Create Secret
          </Text>
          <Card style={{ width: 300, marginTop: "50px" }}>
            <div style={{ height: "150px", width: "180px" }}>
              {this.state.classDiv}
            </div>

            <Meta
              style={{ marginTop: "10px" }}
              title={
                <Button
                  onClick={() =>
                    socket.connect() &
                    socket.emit("request_to_server", "enroll_finger") &
                    this.setState({
                      classDiv: (
                        <div style={{ marginTop: "25px" }}>
                          {antIcon}

                          <p style={{ marginTop: "25px" }}>press finger : 3</p>
                        </div>
                      )
                    })
                  }
                >
                  start
                </Button>
              }
            />
          </Card>
        </center>
      </div>
    );
  }
}

export default Create;
