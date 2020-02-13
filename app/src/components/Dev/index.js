import React, { Component } from "react";
import BigNumber from "bignumber.js";
import axios from "axios";
import { Input, Icon, Button, Row, Col } from "antd";
const { TextArea } = Input;
const antIcon = <Icon type="loading" style={{ fontSize: "5rem" }} spin />;

class Dev extends Component {
  state = {
    secret: [],
    h: ["", ""],
    loading: false
  };

  componentDidMount() {}

  getSecretHash = () => {
    this.setState({ loading: true });
    let randomString = this.state.secret_text;
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

    axios
      .post("http://127.0.0.1:5000/create_secret", {
        a: A,
        b: B,
        c: C,
        d: D
      })
      .then(response => {
        console.log(response.data["h0"] + " " + response.data["h1"]);
        this.setState({ h: [response.data["h0"], response.data["h1"]] });
      })
      .catch(error => {})
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleOnChange = e => {
    this.setState({ secret_text: e.target.value });
  };

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <h2>get all secret </h2>
            <Button>click to get all secret</Button>
            <TextArea rows={10} value={this.state.secret} />
            <br />.
          </Col>
          <Col span={12}>
            <h2>get secret hash</h2>
            <br />
            <Input
              style={{ width: 400 }}
              placeholder="Basic usage"
              onChange={this.handleOnChange}
            />
            <span> </span>
            <Button onClick={this.getSecretHash}>submit</Button>
            <br /> <hr />
            {this.state.loading ? (
              antIcon
            ) : (
              <div>
                <p>h0 : {this.state.h[0]}</p>
                <p>h1 : {this.state.h[1]}</p>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dev;
