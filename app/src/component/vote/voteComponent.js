import React, { Component } from "react";
import io from "socket.io-client";
import { Typography, Steps, Icon, Card, Button, Col, Row, Modal } from "antd";
import "./custom.css";
import { ContractData, AccountData } from "@drizzle/react-components";
const { Text } = Typography;
const { Meta } = Card;
const { Step } = Steps;
const antIcon = <Icon type="loading" style={{ fontSize: "5rem" }} spin />;
const socket = io("http://127.0.0.1:5001/");
const candidatesData = [
  { id: 1, name: "นายภูวเนศวร์ แย้มวิเศษ", score: 0, image: "puwaned.jpg" },
  { id: 2, name: "นายภูวเดช ประทุม", score: 0, image: "puwadech.jpg" },
  { id: 3, name: "นายสุวัจน์ ยืมกระโทก", score: 0, image: "suwat.jpg" },
  { id: 4, name: "นางสาวตรีเนตร น้อยหัวหาด", score: 0, image: "trinet.jpg" }
];

class Vote extends Component {
  state = {
    visible: false,
    candidateIdSelected: 0
  };

  componentDidMount() {
    console.log(this.props.accounts[0]);
    let check = false;
    socket.on("response", msg => {
      let command = JSON.parse(msg);
      console.log(command);
      if (command.tag === "success") {
      }
      if (command.tag === "verify") {
        console.log("verify");
      }
      if (command.tag === "fail") {
        console.log("fail");
      }
    });
  }

  handleClick = e => {
    this.setState({ candidateIdSelected: e.target.id, visible: true });
  };

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <Modal
          title={<div>Hello</div>}
          visible={this.state.visible}
          closable={false}
          footer={<div>heelo footer</div>}
        >
          <Row>
            <center>
              <Col md={{ span: 10 }}>
                <img
                  style={{ height: 200, width: "auto" }}
                  src={
                    process.env.PUBLIC_URL +
                    candidatesData[this.state.candidateIdSelected].image
                  }
                />
              </Col>
              <Col md={{ span: 4 }}>
                <div
                  style={{
                    borderLeft: "3px solid black",
                    height: "220px",
                    position: "absolute",
                    marginLeft: "50px",
                    marginTop: "-10px"
                  }}
                ></div>
              </Col>
              <Col md={{ span: 10 }}>
                <div>
                  <div style={{ height: "150px", border: "1px solid black" }}>
                    <div style={{ marginTop: "10px" }}>
                      <img
                        height="100px"
                        width="auto"
                        src={process.env.PUBLIC_URL + "finger.png"}
                      />
                    </div>
                  </div>
                  <p>Click the start button to get started.</p>
                  <Button
                    onClick={() =>
                      socket.emit("request_to_server", "verify_finger")
                    }
                  >
                    start
                  </Button>
                </div>
              </Col>
            </center>
          </Row>
        </Modal>
        <center>
          <p
            style={{
              fontSize: "2rem",
              border: "3px solid #DEDBDA",
              width: "550px",
              padding: "10px 0px",
              backgroundColor: "#EFECEB",
              borderRadius: "5px"
            }}
          >
            โปรดเลือกผู้สมัครที่ต้องการ
          </p>

          <Row style={{ marginTop: "50px" }}>
            <Col md={{ span: 5, offset: 2 }}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src={process.env.PUBLIC_URL + "puwaned.jpg"}
                  />
                }
              >
                <Meta
                  title="นายภูวเนศวร์ แย้มวิเศษ"
                  description={
                    <ContractData
                      contract="Election"
                      method="getScore"
                      methodArgs="0"
                    />
                  }
                />
                <br />
                <Button
                  id={0}
                  className="grow"
                  icon="interaction"
                  onClick={this.handleClick}
                >
                  เลือก
                </Button>
              </Card>
            </Col>
            <Col md={{ span: 5 }}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src={process.env.PUBLIC_URL + "puwadech.jpg"}
                  />
                }
              >
                <Meta title="นายภูวเดช ประทุม" description="คะแนน : 0" />
                <br />
                <Button
                  id={1}
                  className="grow"
                  icon="interaction"
                  onClick={this.handleClick}
                >
                  เลือก
                </Button>
              </Card>
            </Col>
            <Col md={{ span: 5 }}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src={process.env.PUBLIC_URL + "suwat.jpg"}
                  />
                }
              >
                <Meta title="นายสุวัจน์ ยืมกระโทก" description="คะแนน : 0" />
                <br />
                <Button
                  id={2}
                  className="grow"
                  icon="interaction"
                  onClick={this.handleClick}
                >
                  เลือก
                </Button>
              </Card>
            </Col>
            <Col md={{ span: 5 }}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src={process.env.PUBLIC_URL + "trinet.jpg"}
                  />
                }
              >
                <Meta
                  title="นางสาวตรีเนตร น้อยหัวหาด"
                  description="คะแนน : 0"
                />
                <br />
                <Button
                  id={3}
                  className="grow"
                  icon="interaction"
                  onClick={this.handleClick}
                >
                  เลือก
                </Button>
              </Card>
            </Col>
          </Row>
        </center>
      </div>
    );
  }
}

export default Vote;
