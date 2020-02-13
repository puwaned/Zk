import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";
import drizzleOptions from "../../drizzleOptions";
import VoteComponent from "./component";
import React from "react";
import { drizzleConnect } from "drizzle-react";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3
  };
};

const Components = drizzleConnect(VoteComponent, mapStateToProps);

const Home = () => {
  return (
    <DrizzleProvider options={drizzleOptions}>
      <LoadingContainer>
        <Components />
      </LoadingContainer>
    </DrizzleProvider>
  );
};

export default Home;
