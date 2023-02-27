import { useState, useEffect } from "react";
import { Backdrop, CircularProgress, Divider } from "@mui/material";

import ReplyMsg from "./ReplyMsg";
import MessagesBody from "./Messages";
import RevisionsAddon from "./RevisionsAddons";
import "./thread.css";
import NavBar from "./NavBar";
import { addMessage, resetUnread } from "./../services/model";
import pluginData from "./../services/OrderConvoData";
import { get_setting } from "./../services/helper";
import { get_orderconvo_api_url } from "../services/helper";
const { order_id, context } = pluginData;
const api_url = get_orderconvo_api_url();

export default function WooConvoThread({ Order }) {
  const [Thread, setThread] = useState([]);
  const [RevisionLimit, setRevisionLimit] = useState(0);
  const [showMore, setshowMore] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [FilterThread, setFilterThread] = useState([]);

  useEffect(() => {
    const thread = [...Order.thread];
    setFilterThread(thread);
    setThread(thread);

    const revisions_limit_order = Order.revisions_limit;
    const revisions_limit_global = get_setting("revisions_limit");
    if (revisions_limit_order > 0) {
      setRevisionLimit(revisions_limit_order);
    } else if (revisions_limit_global > 0) {
      setRevisionLimit(revisions_limit_global);
    }

    const markOrderAsRead = async () => {
      const unread_count =
        context === "myaccount" ? Order.unread_customer : Order.unread_vendor;
      if (unread_count > 0) {
        await resetUnread(Order.order_id);
      }
    };

    markOrderAsRead();
  }, [Order]);

  const handleReplySend = async (reply_text, files = []) => {
    setIsWorking(true);
    var attachments = [];
    attachments = await handleFileUpload(files);

    try {
      const { data: response } = await addMessage(
        order_id,
        reply_text,
        attachments
      );
      const { success, data: order } = response;
      const { thread } = order;
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
    const { filename, location, bucket, key, region } = file;

    const download_url = `${api_url}/download-file?filename=${filename}&order_id=${order_id}`;
    window.open(download_url);
  };

  const totalCustomerMessages = Thread.filter(
    (msg) => msg.type === "message" && msg.context === "myaccount"
  ).length;

  const canReply = () => {
    let can_reply = true;
    const disable_on_complete = get_setting("disable_on_completed");
    can_reply =
      disable_on_complete && Order.status === "wc-completed" ? false : true;
    const enable_revisions = get_setting("enable_revisions");
    if (enable_revisions) {
      const revisions_limit = get_setting("revisions_limit");
      can_reply = revisions_limit > totalCustomerMessages;
    }
    return can_reply;
  };

  const canRevise = () => {
    const enable_revisions = get_setting("enable_revisions");
    return canReply() && enable_revisions;
  };

  return (
    <>
      <NavBar
        TotalCount={
          FilterThread.filter((thread) => thread.type === "message").length
        }
        OrderID={order_id}
        Context={context}
        onCollapsed={() => setshowMore(!showMore)}
        showMore={showMore}
        onSearchThread={handleSearch}
      />
      <MessagesBody
        Thread={FilterThread}
        showMore={showMore}
        onDownload={handleDownload}
      />

      <Divider variant="inset" component="h2" sx={{ height: 10 }} />

      {/* Reply to --- */}
      <ReplyMsg onReplySend={handleReplySend} />

      {/* Revision Addons */}
      {canRevise() && (
        <RevisionsAddon
          RevisionsLimit={RevisionLimit}
          totalCustomerMessages={totalCustomerMessages}
        />
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
