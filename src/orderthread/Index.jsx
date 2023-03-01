import { useState, useEffect } from "react";
import { Box, Backdrop, CircularProgress } from "@mui/material";
// import "./App.css";

import pluginData from "./../services/OrderConvoData";
import WooConvoThread from "./OrderThread";
import useLocalStorage from "./../services/useLocalStorage";
import { getOrderById } from "./../services/model";

const { settings, order_id } = pluginData;

function OrderConvoHome({ onBack }) {
  const [pluginSettings, setPluginSettings] = useLocalStorage(
    "orderconvo_settings",
    {}
  );
  const [Order, setOrder] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsWorking(true);
      let { data: order } = await getOrderById(order_id);
      order = order.data;
      console.log(order);
      setOrder(order);
      setIsWorking(false);
    };
    setPluginSettings(settings);
    loadData();
  }, [setPluginSettings]);

  return (
    <Box sx={{ flexGrow: 1 }} className="wooconvo-admin-wrapper">
      {Order && <WooConvoThread Order={Order} onBack={onBack} />}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isWorking}
        onClick={() => setIsWorking(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default OrderConvoHome;
