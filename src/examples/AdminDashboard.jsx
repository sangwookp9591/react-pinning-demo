import './AdminDashboard.css';

// 9. Admin Dashboard - 통계 카드 고정 + 테이블 스크롤
export const AdminDashboard = () => {
  const stats = [
    { label: '총 사용자', value: '12,345', change: '+12%', icon: '👥' },
    { label: '월 매출', value: '₩45M', change: '+23%', icon: '💰' },
    { label: '활성 세션', value: '3,456', change: '-5%', icon: '📊' },
    { label: '전환율', value: '3.2%', change: '+8%', icon: '🎯' },
  ];

  const users = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `사용자 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'User', 'Editor'][i % 3],
    status: i % 4 === 0 ? '오프라인' : '온라인',
  }));

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>대시보드</h1>
        <button className="export-btn">📥 내보내기</button>
      </header>

      {/* 고정 통계 카드 */}
      <div className="stats-container">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 스크롤 가능한 사용자 테이블 */}
      <div className="table-section">
        <h2>사용자 관리</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status ${user.status === '온라인' ? 'online' : 'offline'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">✏️</button>
                    <button className="action-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
