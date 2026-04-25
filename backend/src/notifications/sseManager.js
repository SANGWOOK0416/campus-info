const clients = new Map(); // userId(string) → res

function addClient(userId, res) {
  clients.set(userId, res);
}

function removeClient(userId) {
  clients.delete(userId);
}

function sendToUser(userId, event, data) {
  const res = clients.get(userId);
  if (res) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

function sendToAll(event, data) {
  clients.forEach((res) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// 공지사항 알림 — 크롤러 담당자가 호출
function notifyNewNotice(notice) {
  sendToAll('new_notice', {
    noticeId: notice._id,
    title: notice.title,
    source: notice.source,
  });
}

// 댓글 알림 — 게시글 작성자에게만
function notifyNewComment(postAuthorId, comment) {
  sendToUser(postAuthorId.toString(), 'new_comment', {
    message: '새로운 댓글이 있습니다.',
    commentId: comment._id,
    postId: comment.post_id,
    content: comment.content,
  });
}

module.exports = { addClient, removeClient, notifyNewNotice, notifyNewComment };
