import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { reduxConfig } from "./app/reduxConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import esES from "antd/locale/es_ES";
import { ConfigProvider } from "antd";
import "./index.css";

dayjs.locale("es");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={reduxConfig}>
      <ConfigProvider locale={esES}>
        <App />
        <ToastContainer />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
