import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer } from "@drizzle/react-components";
import drizzleOptions from "../../drizzleOptions";
import voteComponent from "./voteComponent";
import React from "react";
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus
  };
};

const Container = drizzleConnect(voteComponent, mapStateToProps);

const voteContainer = () => {
  return (
    <DrizzleProvider options={drizzleOptions}>
      <LoadingContainer>
        <Container />
      </LoadingContainer>
    </DrizzleProvider>
  );
};

export default voteContainer;
