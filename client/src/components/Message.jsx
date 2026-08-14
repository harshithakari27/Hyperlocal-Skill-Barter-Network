function Message({ type = 'success', children }) {
  if (!children) return null;
  return <div className={`message message-${type}`}>{children}</div>;
}

export default Message;
