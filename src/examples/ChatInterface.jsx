import './ChatInterface.css';

// 8. Slack/Discord - 채팅 인터페이스 (입력창 고정)
export const ChatInterface = () => {
  const messages = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    user: ['Alice', 'Bob', 'Charlie'][i % 3],
    text: `메시지 내용 ${i + 1}. 안녕하세요!`,
    time: `${9 + Math.floor(i / 10)}:${(i % 10) * 6}`,
  }));

  return (
    <div className="chat-container">
      {/* 고정 헤더 */}
      <header className="chat-header">
        <div className="channel-info">
          <h2># general</h2>
          <span className="members">1,234 members</span>
        </div>
        <div className="header-actions">
          <button>🔔</button>
          <button>📌</button>
          <button>⚙️</button>
        </div>
      </header>

      {/* 스크롤 가능한 메시지 영역 */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="avatar">{msg.user[0]}</div>
            <div className="message-content">
              <div className="message-header">
                <span className="username">{msg.user}</span>
                <span className="timestamp">{msg.time}</span>
              </div>
              <p className="message-text">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 고정 입력창 */}
      <div className="chat-input-container">
        <button className="attach-btn">📎</button>
        <input
          type="text"
          placeholder="# general에 메시지 보내기"
          className="chat-input"
        />
        <button className="emoji-btn">😀</button>
        <button className="send-btn">전송</button>
      </div>
    </div>
  );
};
