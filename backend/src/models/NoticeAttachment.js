const mongoose = require('mongoose');

const noticeAttachmentSchema = new mongoose.Schema({
  notice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  file_name: { type: String, required: true },
  file_url:  { type: String, required: true },
  file_type: { type: String, required: true },
});

module.exports = mongoose.model('NoticeAttachment', noticeAttachmentSchema);
