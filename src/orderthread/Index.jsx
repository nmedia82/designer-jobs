import { useState, useEffect } from "react";
import { Box, Backdrop, CircularProgress, Typography } from "@mui/material";
// import "./App.css";

import pluginData from "./../services/OrderConvoData";
import WooConvoThread from "./OrderThread";
import useLocalStorage from "./../services/useLocalStorage";
import { getOrderById } from "./../services/model";
import { get_setting } from "../services/helper";

const { settings } = pluginData;

function OrderConvoHome({
  OrderID,
  JobID,
  onBack,
  onOrderStatusUpdate,
  onJobClose,
  UserRole,
}) {
  const [pluginSettings, setPluginSettings] = useLocalStorage(
    "orderconvo_settings",
    {}
  );
  const [Order, setOrder] = useState(null);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsWorking(true);
      let { data: order } = await getOrderById(OrderID);
      order = order.data;
      setOrder(order);
      setIsWorking(false);
    };
    setPluginSettings(settings);
    loadData();
  }, [setPluginSettings, OrderID]);

  const getHeaderNote = () => {
    return UserRole === "customer"
      ? get_setting("header_note_customers")
      : get_setting("header_note_designers");
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="wooconvo-admin-wrapper">
      <div dangerouslySetInnerHTML={{ __html: getHeaderNote() }}></div>
      {Order && (
        <WooConvoThread
          Order={Order}
          JobID={JobID}
          onBack={onBack}
          onOrderStatusUpdate={onOrderStatusUpdate}
          onJobClose={onJobClose}
        />
      )}
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
