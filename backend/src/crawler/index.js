const Notice = require('../models/Notice');
const { parseNotices, CRAWL_TARGETS } = require('./parser');
const { notifyNewNotice } = require('../notifications/sseManager');

const crawl = async () => {
  try {
    const allNewNotices = [];

    for (const target of CRAWL_TARGETS) {
      const notices = await parseNotices(target);

      for (const notice of notices) {
        try {
          const existing = await Notice.findOne({ list_no: notice.list_no });

          if (!existing) {
            const newNotice = new Notice(notice);
            await newNotice.save();
            allNewNotices.push(newNotice);
            notifyNewNotice(newNotice);
          } else {
            await Notice.updateOne(
              { list_no: notice.list_no },
              { $set: { view_count: notice.view_count, updated_at: new Date() } }
            );
          }
        } catch (err) {
          if (err.code !== 11000) {
            console.error('공지사항 저장 오류:', err.message);
          }
        }
      }
    }
    return allNewNotices;
  } catch (err) {
    console.error('크롤링 전체 오류:', err.message);
    return [];
  }
};

module.exports = { crawl };
