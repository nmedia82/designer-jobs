window.OrderConvoData = JSON.stringify({
  order_id: 141,
  context: "myaccount",
  settings: {
    message_vs_order_status: "wc-pending",
    enable_msg_count_display: true,
    enable_msg_search: true,
    myaccount_tab_label: "My messages",
    bg_color_message_header: "#e1d5d5",
    bg_color_order_messages: "#9fc7df",
    icon_color_send_button: "#000",
    icon_color_upload_button: "blue",
    enable_order_notices: true,
    reverse_message_display_order: true,
    enable_file_attachments: false,
    max_files_allowed: 2,
    max_file_size: 50,
    thumb_size: 75,
    file_types_allowed: "jpg,png,pdf",
    attachments_required: true,
    attachments_in_email: true,
    image_open_click: false,
    enable_quickreply: false,
    quick_replies: ["Hi", "Well done man."],
    enable_revisions: true,
    revisions_note: "Please request max 5 revisions",
    revisions_limit: 5,
    revisions_orderchange: "wc-completed",
    disable_on_completed: true,
  },
});

const { order_id, context, settings } = JSON.parse(window.OrderConvoData);

export default {
  order_id,
  context,
  settings,
};
