export default function ProfileGrid({ items }) {
  return (
    <div className="profile-grid">
      {items.map(([k, v]) => <div className="profile-item" key={k}><small>{k}</small><strong>{v}</strong></div>)}
    </div>
  );
}
