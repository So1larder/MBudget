import React, { useState } from 'react';
import './App.css';

function SiteLogo({ className }) {
  return (
    <div className={className ? className : ''}>
      <div className="site-title">MBudget</div>
      <div className="logo-gradient">
        <svg viewBox="0 0 140 160" className="logo-svg" xmlns="http://www.w3.org/2000/svg">
          <circle cx="70" cy="60" r="50" stroke="#bfa13a" strokeWidth="4" fill="none" />
          <text x="70" y="78" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="40" fontWeight="700" fill="#bfa13a">MB</text>
          <path d="M30 120 Q40 130 70 135 Q100 130 110 120" stroke="#bfa13a" strokeWidth="3" fill="none" />
          <path d="M40 125 Q55 132 70 133 Q85 132 100 125" stroke="#bfa13a" strokeWidth="2" fill="none" />
          <path d="M50 128 Q65 134 70 134 Q75 134 90 128" stroke="#bfa13a" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="page-content">Аналізуйте свій бюджет комфортно та впевнено разом з MBudget!</div>
  );
}
function Budget() {
  const incomeCategories = ['Зарплата', 'Подарунок', 'Премія', 'Інше'];
  const expenseCategories = ['Їжа', 'Транспорт', 'Розваги', 'Комуналка', 'Покупки', 'Інше'];

  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('income');
  const [form, setForm] = useState({ amount: '', comment: '', category: '' });
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');

  const handleOpenForm = (type) => {
    setFormType(type);
    setForm({ amount: '', comment: '', category: '' });
    setShowForm(true);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    const now = new Date();
    const date = now.toLocaleDateString('uk-UA');
    const time = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    setHistory([
      { type: formType, date, time, amount: form.amount, comment: form.comment, category: form.category },
      ...history,
    ]);
    setShowForm(false);
  };
  // нотатки
  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes([{ text: noteInput, id: Date.now() }, ...notes]);
      setNoteInput('');
    }
  };
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };
  // фільтри і пошук
  const filteredHistory = history.filter(item => {
    const typeMatch = filterType === 'all' || item.type === filterType;
    const searchMatch =
      item.comment.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return typeMatch && searchMatch;
  });

  // підрахунок 
  const totalIncome = history.filter(i => i.type === 'income').reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpense = history.filter(i => i.type === 'expense').reduce((sum, i) => sum + Number(i.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="budget-new-layout">
      <div className="budget-side-panel">
        <div className="budget-actions-modern">
          <button className="budget-btn big" onClick={() => handleOpenForm('income')}>+ Поповнення</button>
          <button className="budget-btn big" onClick={() => handleOpenForm('expense')}>- Витрата</button>
        </div>
        {showForm && (
          <form className="budget-form-modern" onSubmit={handleSubmit}>
            <label>
              Сума:
              <input type="number" name="amount" value={form.amount} onChange={handleChange} required min="1" className="budget-form-input" />
            </label>
            <label>
              Категорія:
              <select name="category" value={form.category} onChange={handleChange} required className="budget-form-input">
                <option value="">Оберіть категорію</option>
                {(formType === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>
              Коментар:
              <input type="text" name="comment" value={form.comment} onChange={handleChange} maxLength="60" className="budget-form-input" />
            </label>
            <div style={{display:'flex', gap:12, marginTop:8}}>
              <button type="submit" className="budget-btn big">Додати</button>
              <button type="button" className="budget-btn budget-btn-cancel big" onClick={() => setShowForm(false)}>Скасувати</button>
            </div>
          </form>
        )}
        {/* нотатки */}
        <div className="budget-notes-block-modern">
          <div className="budget-history-title" style={{marginBottom: 8}}>Нотатки</div>
          <div style={{display:'flex', gap:8, marginBottom:8}}>
            <input type="text" value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Нова нотатка..." className="budget-form-input" maxLength={60} />
            <button className="budget-btn" style={{padding:'6px 12px'}} onClick={handleAddNote} type="button">Додати</button>
          </div>
          <ul style={{paddingLeft:18, margin:0}}>
            {notes.length === 0 && <li style={{color:'#bfa13a99'}}>Нотаток немає</li>}
            {notes.map(note => (
              <li key={note.id} style={{color:'#bfa13a', marginBottom:4, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span>{note.text}</span>
                <button style={{marginLeft:8, color:'#ff5e5e', background:'none', border:'none', cursor:'pointer'}} onClick={() => handleDeleteNote(note.id)} title="Видалити">✕</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="budget-history-rectangle big">
        <div className="budget-history-header">
          <div className="budget-history-title">Історія</div>
          <div className="budget-summary">
            <div>Доходи: <span className="budget-income">+{totalIncome} ₴</span></div>
            <div>Витрати: <span className="budget-expense">-{totalExpense} ₴</span></div>
            <div>Баланс: <span className="budget-balance">{balance} ₴</span></div>
          </div>
        </div>
        {/* фільтри та пошук */}
        <div className="budget-filters-row">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="budget-form-input budget-filter-select">
            <option value="all">Усі</option>
            <option value="income">Доходи</option>
            <option value="expense">Витрати</option>
          </select>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук..." className="budget-form-input budget-filter-search" />
        </div>
        <div className="budget-history">
          {filteredHistory.length === 0 && <div className="budget-empty">Історія порожня</div>}
          {filteredHistory.map((item, idx) => (
            <div key={idx} className={`budget-history-item ${item.type}`}> 
              <div className="budget-history-row">
                <span className="budget-history-date">{item.date} {item.time}</span>
                <span className="budget-history-amount {item.type}">{item.type === 'income' ? '+' : '-'}{item.amount} ₴</span>
              </div>
              <div style={{display:'flex', gap:8, fontSize:'0.98rem', color:'#bfa13a99'}}>
                <span>Категорія: {item.category}</span>
                {item.comment && <span> | {item.comment}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Analysis() {
  return (
    <div className="page-content">Подальший аналіз</div>
  );
}
function Account() {
  return (
    <div className="account-content">
      <div className="account-avatar"></div>
      <div className="account-info">
        <div className="account-label">Ім'я користувача</div>
        <div className="account-value">User Name</div>
        <div className="account-label">Email</div>
        <div className="account-value">user@email.com</div>
      </div>
      <div className="account-actions">
        <button className="account-btn">Змінити дані</button>
        <button className="account-btn">Змінити обліковий запис</button>
        <button className="account-btn">Вийти</button>
      </div>
    </div>
  );
}

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [page, setPage] = useState('home');

  let headerTitle = '';
  if (page === 'budget') headerTitle = 'Мій Бюджет';
  if (page === 'analysis') headerTitle = 'Аналіз';
  if (page === 'account') headerTitle = 'Мій акаунт';

  const renderPage = () => {
    if (page === 'home') return <Home />;
    if (page === 'budget') return <Budget />;
    if (page === 'analysis') return <Analysis />;
    if (page === 'account') return <Account />;
    return null;
  };

  return (
    <div className="main-bg">
      <div className="header-bar">
        <div className="header-left">
          {(page === 'budget' || page === 'analysis' || page === 'account') && <div className="budget-logo-fixed"><SiteLogo /></div>}
        </div>
        {(page === 'budget' || page === 'analysis' || page === 'account') && <div className="header-title">{headerTitle}</div>}
        <div>
          <div className="navbar-fab" onClick={() => setNavOpen(true)}>
            <span className="navbar-fab-icon">☰</span>
          </div>
        </div>
      </div>
      {navOpen && (
        <div className="side-nav">
          <button className="side-nav-close" onClick={() => setNavOpen(false)}>&times;</button>
          <ul>
            <li onClick={() => { setPage('home'); setNavOpen(false); }}>Головна</li>
            <li onClick={() => { setPage('account'); setNavOpen(false); }}>Мій акаунт</li>
            <li onClick={() => { setPage('budget'); setNavOpen(false); }}>Бюджет</li>
            <li onClick={() => { setPage('analysis'); setNavOpen(false); }}>Аналіз</li>
            <li onClick={() => { /* вподальшому має бути вихід */ setNavOpen(false); }}>Вийти</li>
          </ul>
        </div>
      )}
      {page !== 'budget' && page !== 'analysis' && page !== 'account' && <SiteLogo />}
      {renderPage()}
      {page !== 'budget' && page !== 'analysis' && page !== 'account' && (
        <footer className="site-description">
          <div>MBudget — сервіс для контролю фінансів.</div>
          <div>Відстежуйте доходи, витрати та заощадження зручно та безпечно.</div>
          <div style={{marginTop: '10px'}}>
            <span role="img" aria-label="email"></span> info@mbudget.com &nbsp;|&nbsp;
            <span role="img" aria-label="phone"></span> +38 (099) 123-45-67
          </div>
          <div style={{marginTop: '8px'}}>
            <a href="#" className="footer-link">Політика конфіденційності</a> |
            <a href="#" className="footer-link"> Умови користування</a>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
