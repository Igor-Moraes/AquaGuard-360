export const AlertItem = ({ a }) => (
  <div className={"alert-item " + a.level}>
    <div className="alert-title">{a.title}</div>
    <div className="alert-text">{a.text}</div>
  </div>
);
