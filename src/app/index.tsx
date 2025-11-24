import React from "react";
import { Provider } from "./provider";
import { Router } from "./router";

const App = () => {
  return (
    <React.Fragment>
      <Provider>
        <Router />
      </Provider>
    </React.Fragment>
  );
};
export default App;
