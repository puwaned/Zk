import React, { Component, useState, useEffect } from "react";
import { Card, Modal, Button, Icon, Row, Col } from "antd";
import { ContractData } from "drizzle-react-components";
import axios from "axios";
import BigNumber from "bignumber.js";
import ElectionInterface from "../../contracts/Election.json";
const { Meta } = Card;

const candidatesData = [
  { id: 0, name: "นายภูวเนศวร์ แย้มวิเศษ", image: "puwaned.jpg" },
  { id: 1, name: "นายภูวเดช ประทุม", image: "puwadech.jpg" },
  { id: 2, name: "นายสุวัจน์ ยืมกระโทก", image: "suwat.jpg" },
  { id: 3, name: "นางสาวตรีเนตร น้อยหัวหาด", image: "trinet.jpg" }
];

const VoteBox = props => {
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");
  const handleOnClose = () => {
    props.parentCallback(false);
  };
  const handleOnConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  useEffect(() => {
    setContext(
      <Card
        style={{ width: 200 }}
        cover={
          <img
            alt={candidatesData[props.id].name}
            src={process.env.PUBLIC_URL + candidatesData[props.id].image}
          />
        }
      >
        <Meta
          title={candidatesData[props.id].name}
          description={
            <ContractData
              contract="Election"
              method="getScore"
              methodArgs={[props.id]}
              render={e => "คะแนน : " + e}
            />
          }
        />
      </Card>
    );
  }, [props.id]);

  return (
    <Modal
      title={"ลงคะแนน"}
      width={300}
      visible={props.visible}
      closable={false}
      footer={
        <div className="center-h">
          <Button type="danger" onClick={handleOnClose}>
            Close
          </Button>
          <Button type="primary" onClick={handleOnConfirm}>
            Confirm{" "}
            {loading ? (
              <Icon type="loading" style={{ fontSize: "1rem" }} spin />
            ) : (
              ""
            )}
          </Button>
        </div>
      }
    >
      <div className="center-h">{context}</div>
    </Modal>
  );
};

export default VoteBox;
