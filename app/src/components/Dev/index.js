import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Input, Button, List, Spin, Tabs } from "antd";
const { TabPane } = Tabs;

const Dev = props => {
  const [secret, setSecret] = useState([]);
  const [secretText, setSecretText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [h, setH] = useState([]);

  const get = async () => {
    setLoading(true);
    const data = await (await fetch("http://127.0.0.1:5000/get_secret_key"))
      .json()
      .finally(() => {
        setLoading(false);
      });
    const result = await data.result.split(",");
    setSecret(result);
  };

  const convertSecret = secret => {
    let binary = "";
    for (var i = 0; i < secret.length; i++) {
      binary += secret[i].charCodeAt(0).toString(2) + "";
    }
    const first = new BigNumber(binary.slice(0, 112), 2).toString(10);
    const second = new BigNumber(binary.slice(112, 224), 2).toString(10);
    const third = new BigNumber(binary.slice(224, 336), 2).toString(10);
    const fourth = new BigNumber(binary.slice(336, 448), 2).toString(10);

    return [first, second, third, fourth];
  };

  const create_proof = () => {
    setLoading2(true);
    const secret = convertSecret(secretText);
    fetch("http://127.0.0.1:5000/create_secret", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        a: secret[0],
        b: secret[1],
        c: secret[2],
        d: secret[3]
      })
    })
      .then(res => res.json())
      .then(res => {
        const data = [res.h0, res.h1];
        setH(data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading2(false);
      });
  };
  return (
    <div style={{ marginTop: "20px" }}>
      <div className="card-container">
        <Tabs type="card">
          <TabPane tab="Get Secret key" key="1">
            <div style={{ padding: 30 }}>
              <Button onClick={get}>GET SECRET</Button>{" "}
              {loading ? <Spin /> : ""}
              <List
                style={{ marginTop: 20 }}
                size="large"
                bordered
                dataSource={secret}
                renderItem={(item, index) => (
                  <List.Item>
                    {index + 1} : {item}
                  </List.Item>
                )}
              />
              <div style={{ marginTop: 30 }}>
                <Input
                  placeholder="past secret here"
                  style={{ width: 400, marginTop: 20 }}
                  value={secretText}
                  onChange={e => setSecretText(e.target.value)}
                />{" "}
                <Button onClick={create_proof}>GET HASH</Button>{" "}
                {loading2 ? <Spin /> : ""}
                <List
                  style={{ marginTop: 20 }}
                  size="large"
                  bordered
                  dataSource={h}
                  renderItem={(item, index) => (
                    <List.Item>
                      h{index} : {item}
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Dev;
