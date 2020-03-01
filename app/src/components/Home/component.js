import React, { Component } from "react";
import { ContractData } from "drizzle-react-components";
import { Card, Col, Row } from "antd";
import Modal from "./componentModal";
import PropTypes from "prop-types";
const { Meta } = Card;

const candidatesData = [
  { id: 0, name: "นายภูวเนศวร์ แย้มวิเศษ", image: "puwaned.jpg" },
  { id: 1, name: "นายภูวเดช ประทุม", image: "puwadech.jpg" },
  { id: 2, name: "นายสุวัจน์ ยืมกระโทก", image: "suwat.jpg" },
  { id: 3, name: "นางสาวตรีเนตร น้อยหัวหาด", image: "trinet.jpg" }
];

export default class MyComponent extends Component {
  constructor(props, context) {
    super(props);
    this.state = { visible: false, candidateIdSelected: 0 };
  }

  handleClick = e => {
    this.setState({ candidateIdSelected: e, visible: true });
  };

  handleModal = value => {
    this.setState({ visible: value });
  };

  renderCandidateCard = () => {
    return candidatesData.map((item, index) => {
      return (
        <Col key={index} md={{ span: 6 }}>
          <Card
            onClick={() => this.handleClick(item.id)}
            className="grow"
            hoverable
            style={{ width: 240, borderRadius: "5px" }}
            cover={
              <img alt="example" src={process.env.PUBLIC_URL + item.image} />
            }
          >
            <Meta
              title={item.name}
              description={
                <ContractData
                  contract="Election"
                  method="getScore"
                  methodArgs={[item.id]}
                  render={e => "คะแนน : " + e}
                />
              }
            />
            <br />
          </Card>
        </Col>
      );
    });
  };

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <Modal
          visible={this.state.visible}
          addr={this.props.accounts[0]}
          parentCallback={this.handleModal}
          id={this.state.candidateIdSelected}
          drizzle={this.context.drizzle}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>โปรดเลือกผู้สมัครที่ต้องการ</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p>คลิกที่รูปผู้สมัครเพื่อทำการลงคะแนน</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Row gutter={16} style={{ marginTop: "20px" }}>
            {this.renderCandidateCard()}
          </Row>
        </div>
      </div>
    );
  }
}

MyComponent.contextTypes = {
  drizzle: PropTypes.object
};
