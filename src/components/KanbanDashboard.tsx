import { Check, Calendar, CreditCard, Smartphone, Wallet, ArchiveX, MoreHorizontal } from 'lucide-react';
import './kanban.css';

const MOCK_STAGES = [
  { id: 'initiated', title: 'Payment Initiated', dotColor: '#95a5a6', emptyText: 'No initiated transactions' },
  { id: 'processing', title: 'Processing', dotColor: '#3498db', emptyText: 'No processing transactions' },
  { id: 'completed', title: 'Completed', dotColor: '#2ecc71', emptyText: 'No completed transactions' },
  { id: 'failed', title: 'Failed', dotColor: '#e74c3c', emptyText: 'No failed transactions' }
];

const MOCK_CARDS = [
  { id: '1', stage: 'initiated', customer: 'Alice Doe', title: 'Alice Doe — TXN#1023', description: 'UPI Payment', amount: 1500, method: 'UPI', avatarColor: '#9b59b6' },
  { id: '2', stage: 'initiated', customer: 'Bob Smith', title: 'Bob Smith — TXN#1024', description: 'Card Payment', amount: 450, method: 'Card', avatarColor: '#34495e' },
  { id: '3', stage: 'processing', customer: 'Charlie', title: 'Charlie — TXN#1025', description: 'Bank Transfer', amount: 12000, method: 'Card', avatarColor: '#e67e22' },
  { id: '4', stage: 'processing', customer: 'Dave L.', title: 'Dave L. — TXN#1026', description: 'Wallet Payment', amount: 99, method: 'Wallet', avatarColor: '#f1c40f' },
  { id: '5', stage: 'completed', customer: 'Eve', title: 'Eve — TXN#1027', description: 'UPI Payment', amount: 200, method: 'UPI', avatarColor: '#1abc9c' }
];

const getMethodIcon = (method: string) => {
  if (method === 'UPI') return <Smartphone size={16} />;
  if (method === 'Wallet') return <Wallet size={16} />;
  return <CreditCard size={16} />;
};

export function KanbanDashboard() {
  return (
    <div className="kanban-wrapper">
      <div className="kanban-main-card">

        <div className="kanban-top-actions">
          <h2 className="kanban-title">Payment Overview</h2>
          <div className="team-avatars">
            <div className="avatar" style={{ background: '#34495e' }}>JD</div>
            <div className="avatar" style={{ background: '#e67e22' }}>AS</div>
            <div className="avatar" style={{ background: '#e74c3c' }}>MK</div>
            <div className="avatar" style={{ background: '#f1c40f' }}>RJ</div>
            <div className="avatar" style={{ background: '#bdc3c7', color: '#333' }}>+2</div>
          </div>
        </div>

        <div className="kanban-board-scroll">
          <div className="kanban-board">
            {MOCK_STAGES.map((stage, index) => (
              <div key={stage.id} className="kanban-column-wrapper">

                <div className="kanban-column">
                  <div className="card-list">
                    {MOCK_CARDS.filter(c => c.stage === stage.id).length === 0 && (
                      <div className="empty-state">
                        <ArchiveX size={24} className="empty-icon" />
                        <span>{stage.emptyText}</span>
                      </div>
                    )}
                    {MOCK_CARDS.filter(c => c.stage === stage.id).map(card => (
                      <div key={card.id} className="kanban-card">
                        <div className="card-top">
                          <div className="customer-info">
                            <div className="small-avatar" style={{ backgroundColor: card.avatarColor }}>
                              {card.customer.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <div className="kanban-action-icons">
                            <Check size={16} />
                            <Calendar size={16} />
                            <MoreHorizontal size={16} />
                          </div>
                        </div>

                        <div className="kanban-card-title-row">
                          <span className="kanban-card-title">{card.title}</span>
                          <span className="status-dot" style={{ backgroundColor: stage.dotColor }}></span>
                        </div>
                        <div className="kanban-card-description">{card.description}</div>

                        <div className="card-amount">INR {card.amount.toLocaleString()}</div>

                        <div className="card-bottom">
                          <span className="method-icon">{getMethodIcon(card.method)}</span>
                        </div>

                        {/* Connector element if not last column */}
                        {index < MOCK_STAGES.length - 1 && (
                          <>
                            <div className="connector-dot"></div>
                            <div className="connector-line"></div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage Name below column */}
                <div className="stage-label-bottom">
                  {stage.title}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
