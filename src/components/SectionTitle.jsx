export const SectionTitle = ({ title, sub, children }) => (
  <div className="section-title">
    <h2>{title}</h2>
    {sub && <small>{sub}</small>}
    {children}
  </div>
);
