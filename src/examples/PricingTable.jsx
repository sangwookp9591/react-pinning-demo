import './PricingTable.css';

// 7. SaaS 가격 테이블 - 헤더 행 고정
export const PricingTable = () => {
  const features = [
    '사용자 수',
    '스토리지',
    '프로젝트',
    '협업 도구',
    '우선 지원',
    'API 접근',
    '커스텀 도메인',
    '고급 분석',
    'SSO',
    '전담 매니저',
    '온프레미스',
    'SLA 보장',
    '24/7 지원',
    '교육 세션',
    '마이그레이션 지원',
  ];

  const plans = [
    {
      name: 'Free',
      price: '₩0',
      values: ['5명', '5GB', '3개', '✓', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗'],
    },
    {
      name: 'Pro',
      price: '₩29,000',
      popular: true,
      values: ['50명', '100GB', '무제한', '✓', '✓', '✓', '✓', '✓', '✗', '✗', '✗', '✗', '✓', '✗', '✗'],
    },
    {
      name: 'Enterprise',
      price: '문의',
      values: ['무제한', '1TB', '무제한', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'],
    },
  ];

  return (
    <div className="pricing-container">
      <header className="pricing-header">
        <h1>요금제</h1>
        <p>비즈니스에 맞는 플랜을 선택하세요</p>
      </header>

      <div className="table-wrapper">
        <table className="pricing-table">
          <thead>
            <tr className="sticky-header">
              <th className="feature-col">기능</th>
              {plans.map((plan, i) => (
                <th key={i} className={plan.popular ? 'popular' : ''}>
                  {plan.popular && <span className="badge">인기</span>}
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">{plan.price}</div>
                  <button className="select-btn">선택하기</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, i) => (
              <tr key={i}>
                <td className="feature-name">{feature}</td>
                {plans.map((plan, j) => (
                  <td key={j} className="feature-value">
                    {plan.values[i]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
