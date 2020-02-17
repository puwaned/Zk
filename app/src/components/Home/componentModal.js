import React, { Component, useState, useEffect } from "react";
import { Card, Modal, Button, Icon, Row, Col, Spin } from "antd";
import { ContractData } from "drizzle-react-components";
import axios from "axios";
import BigNumber from "bignumber.js";
import ElectionInterface from "../../contracts/Election.json";
import { object } from "prop-types";
const { Meta } = Card;

const candidatesData = [
  { id: 0, name: "นายภูวเนศวร์ แย้มวิเศษ", image: "puwaned.jpg" },
  { id: 1, name: "นายภูวเดช ประทุม", image: "puwadech.jpg" },
  { id: 2, name: "นายสุวัจน์ ยืมกระโทก", image: "suwat.jpg" },
  { id: 3, name: "นางสาวตรีเนตร น้อยหัวหาด", image: "trinet.jpg" }
];

const VoteBox = props => {
  const [id, setId] = useState();
  const [status, setStatus] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();

  const handleOnClose = () => {
    props.parentCallback(false);
  };
  const handleOnConfirm = () => {
    setTimeout(() => {}, 2000);
  };
  useEffect(() => {
    setStatus(candidatesData[props.id].name);
    setDescription(
      <ContractData
        contract="Election"
        method="getScore"
        methodArgs={[props.id]}
        render={e => "คะแนน : " + e}
      />
    );
    setImage(
      <img
        alt={candidatesData[props.id].name}
        src={process.env.PUBLIC_URL + candidatesData[props.id].image}
      />
    );
  }, [props.id]);
  const handleContinuse = () => {
    setStatus(<span style={{ fontSize: 15 }}>กำลังตรวจเครื่องแสกน</span>);
    setDescription("กำลังดำเนินการ");
    setImage(
      <img
        className="center-h"
        height="198px"
        width="auto"
        alt="finger"
        src={process.env.PUBLIC_URL + "finger.jpg"}
      />
    );

    //first fetch
    fetch("http://127.0.0.1:5000/check_device")
      .then(res => res.json())
      .then(res => {
        if (res.result === "true") {
          setStatus(
            <span style={{ fontSize: 15 }}>วางนิ้วลงบนเครื่องแสกน</span>
          );
          setDescription("พร้อมดำเนินการ");
          //second fetch
        } else {
          setStatus(
            <span style={{ fontSize: 15, color: "red" }}>ไม่พบเครื่องแสกน</span>
          );
          setDescription("ไม่พร้อมดำเนินการ");
        }
      });
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex" }}>
          <div style={{ fontSize: "1.5rem", position: "absolute" }}>
            ลงคะแนน
          </div>
          <div style={{ marginLeft: 240 }}>
            <Icon type="close" onClick={handleOnClose} />
          </div>
        </div>
      }
      closable={false}
      width={300}
      visible={props.visible}
      footer={null}
    >
      <div className="center-h">
        <Card style={{ width: 200 }} cover={image}>
          <Meta title={status} description={description} />
          <br />
          <div className="center-h">
            {typeof description === "object" ? (
              <Button onClick={handleContinuse} type="primary" size="small">
                คลิกเพื่อไปต่อ
              </Button>
            ) : (
              ""
            )}
            {description === "กำลังดำเนินการ" ? <Spin /> : ""}
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default VoteBox;
