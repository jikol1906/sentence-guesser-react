import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Test2 from "./Components/App";

ReactDOM.render(


  <React.StrictMode>
    {/* <App /> */}
    {/* <div className="bg-blue-700 flex text-white min-h-screen">
      <div className="m-auto max-w-5xl">
        <Test word="hello" />
        <Test word="this" />
        <Test word="works" />
        <Test word="pretty" />
        <Test word="good" />
        <Test word="good" />
        <Test word="good" />
        <Test word="good" />
        <Test word="good" />
        <Test word="good" />
      </div>
    </div> */}
    <Test2/>
    {/* <Test3/> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
