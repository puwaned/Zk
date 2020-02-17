import React, { Component, useState, useEffect } from "react";
import { Card, Modal, Button, Icon, Row, Col, Spin } from "antd";
import { ContractData } from "drizzle-react-components";
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
  const [status, setStatus] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();

  const handleOnClose = () => {
    props.parentCallback(false);
  };
  const clearModal = () => {
    setImage(
      <img
        alt={candidatesData[props.id].name}
        src={process.env.PUBLIC_URL + candidatesData[props.id].image}
      />
    );
    setStatus(candidatesData[props.id].name);
    setDescription(
      <ContractData
        contract="Election"
        method="getScore"
        methodArgs={[props.id]}
        render={e => "คะแนน : " + e}
      />
    );
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

    //first fetch check device status
    fetch("http://127.0.0.1:5000/check_device")
      .then(res => res.json())
      .then(res => {
        if (res.result === "true") {
          setStatus(
            <span style={{ fontSize: 15 }}>วางนิ้วลงบนเครื่องแสกน</span>
          );
          setDescription("พร้อมดำเนินการ");

          //second fetch get finger to verify
          fetch("http://127.0.0.1:5000/verify_1")
            .then(res => res.json())
            .then(res => {
              if (res.status === 200) {
                setStatus(
                  <span style={{ fontSize: 15 }}>กำลังตรวจลายนิ้วมือ</span>
                );
                setDescription("กำลังดำเนินการ");
                //third fetch
                fetch("http://127.0.0.1:5000/verify_2", {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify({
                    finger: res.result
                  })
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log(res.result);
                    if (res.result !== "false") {
                      setStatus(
                        <span style={{ fontSize: 15 }}>กำลังสร้างหลักฐาน</span>
                      );
                      getProofs(converSecret(res.result));
                      //fourth fetch
                    } else {
                      setImage(
                        <img
                          alt="correct"
                          src={process.env.PUBLIC_URL + "incorrect.jpg"}
                        />
                      );
                      setStatus(
                        <span style={{ fontSize: 15, color: "red" }}>
                          ลายนิ้วมือไม่ถูกต้อง
                        </span>
                      );
                      setDescription("ไม่พร้อมดำเนินการ");
                    }
                  });
              }
            });
        } else {
          setStatus(
            <span style={{ fontSize: 15, color: "red" }}>ไม่พบเครื่องแสกน</span>
          );
          setDescription("ไม่พร้อมดำเนินการ");
          setImage(
            <img alt="unplug" src={process.env.PUBLIC_URL + "unplug.jpg"} />
          );
        }
      });
  };

  const converSecret = randomString => {
    var binary = "";
    for (var i = 0; i < randomString.length; i++) {
      binary += randomString[i].charCodeAt(0).toString(2) + "";
    }
    let a = binary.slice(0, 112);
    let b = binary.slice(112, 224);
    let c = binary.slice(224, 336);
    let d = binary.slice(336, 448);

    const A = new BigNumber(a, 2).toString(10);
    const B = new BigNumber(b, 2).toString(10);
    const C = new BigNumber(c, 2).toString(10);
    const D = new BigNumber(d, 2).toString(10);
    return [A, B, C, D];
  };

  const getProofs = arr => {
    fetch("http://127.0.0.1:5000/get_proofs", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        a: arr[0],
        b: arr[1],
        c: arr[2],
        d: arr[3]
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.result !== "false") {
          setStatus(<span style={{ fontSize: 15 }}>ลายนิ้วมือถูกต้อง</span>);
          setDescription("พร้อมดำเนินการ");
          setImage(
            <img alt="correct" src={process.env.PUBLIC_URL + "correct.jpg"} />
          );
          sendVote(res.result);
        } else {
          setStatus(
            <span style={{ fontSize: 15, color: "red" }}>เข้ารหัสผิดพลาด</span>
          );
          setDescription("ไม่พร้อมดำเนินการ");
          setImage(
            <img alt="correct" src={process.env.PUBLIC_URL + "incorrect.jpg"} />
          );
        }
      });
  };

  const sendVote = proof => {
    let web3 = props.drizzle.web3;
    let ElectionContract = new web3.eth.Contract(
      ElectionInterface.abi,
      "0xFa138ef09ae751E8E67FbA257EFEDD8527E3ce0d"
    );

    let A = proof["proof"]["a"].map(item => {
      return new BigNumber(item);
    });

    let B1 = proof["proof"]["b"][0].map(item => {
      return new BigNumber(item);
    });

    let B2 = proof["proof"]["b"][1].map(item => {
      return new BigNumber(item);
    });

    let C = proof["proof"]["c"].map(item => {
      return new BigNumber(item);
    });

    let input = proof["inputs"].map(item => {
      return new BigNumber(item);
    });

    ElectionContract.methods
      .Vote(props.id, A, [B1, B2], C, input)
      .send({ from: props.addr })
      .then(function(receipt) {
        if (receipt.status === true) {
        } else {
        }
      })
      .catch(err => {});
  };

  return (
    <Modal
      afterClose={clearModal}
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
