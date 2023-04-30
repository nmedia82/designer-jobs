import { useState, useEffect } from "react";
import { Backdrop, CircularProgress, Divider } from "@mui/material";

import ReplyMsg from "./ReplyMsg";
import MessagesBody from "./Messages";
import "./thread.css";
import NavBar from "./NavBar";
import { addMessage, resetUnread } from "./../services/model";
import pluginData from "./../services/OrderConvoData";
import { get_orderconvo_api_url } from "../services/helper";
const { context } = pluginData;
const api_url = get_orderconvo_api_url();

export default function WooConvoThread({
  Order,
  JobID,
  onBack,
  onOrderStatusUpdate,
  onJobClose,
}) {
  const [Thread, setThread] = useState([]);
  const [showMore, setshowMore] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [FilterThread, setFilterThread] = useState([]);

  const { order_id, status: order_status } = Order;

  useEffect(() => {
    const thread = [...Order.thread];
    setFilterThread(thread);
    setThread(thread);

    const markOrderAsRead = async () => {
      const unread_count =
        context === "myaccount" ? Order.unread_customer : Order.unread_vendor;
      if (unread_count > 0) {
        await resetUnread(Order.order_id);
      }
    };

    markOrderAsRead();
  }, [Order]);

  const handleReplySend = async (reply_text, files = [], NotifyTo = "") => {
    setIsWorking(true);
    var attachments = [];
    attachments = await handleFileUpload(files);

    try {
      const { data: response } = await addMessage(
        order_id,
        reply_text,
        attachments,
        NotifyTo
      );
      const { success, data: order } = response;
      const { thread } = order;
      onOrderStatusUpdate(order_id);
      setIsWorking(false);
      if (success) {
        setThread(thread);
        setFilterThread(thread);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // upload to server
  const handleFileUpload = (files) => {
    var promises = [];
    files.forEach(async (file) => {
      const p = new Promise(async (resolve, reject) => {
        const resp = await uploadFile(file);
        const { data: attachment } = await resp.json();
        resolve(attachment);
      });
      promises.push(p);
    });
    return Promise.all(promises);
  };

  // upload to local server
  const uploadFile = (file) => {
    // console.log(file);
    const url = `${api_url}/upload-file`;
    const data = new FormData();
    data.append("file", file);
    data.append("order_id", order_id);
    return fetch(url, { method: "POST", body: data });
  };

  const handleSearch = (str) => {
    let thread = [...Thread];
    thread = thread.filter((r) => matchSearch(str, r.message));
    console.log(thread);
    setFilterThread(thread);
  };

  const matchSearch = (text, testwith) => {
    const regex = new RegExp("(?:^|\\s)" + text, "gi");
    return regex.test(testwith);
  };

  const handleDownload = async (file) => {
    const { filename } = file;

    const download_url = `${api_url}/download-file?filename=${filename}&order_id=${order_id}`;
    window.open(download_url);
  };

  return (
    <>
      <NavBar
        TotalCount={
          FilterThread.filter((thread) => thread.type === "message").length
        }
        OrderID={JobID}
        Context={context}
        onCollapsed={() => setshowMore(!showMore)}
        showMore={showMore}
        onSearchThread={handleSearch}
        onBack={onBack}
      />
      <MessagesBody
        Thread={FilterThread}
        showMore={showMore}
        onDownload={handleDownload}
      />

      <Divider variant="inset" component="h2" sx={{ height: 10 }} />

      {/* Reply to --- */}
      {order_status !== "completed" && (
        <ReplyMsg onReplySend={handleReplySend} onJobClose={onJobClose} />
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isWorking}
        onClick={() => setIsWorking(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
