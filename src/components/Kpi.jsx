export const Kpi = ({ label, icon, value, unit, foot, tone = "", footTone = "" }) => (
  <div className="card">
    <div className="kpi-top">
      <span>{label}</span>
      {icon && <span className="kpi-icon">{icon}</span>}
    </div>
    <div className={"kpi-value " + tone}>{value}</div>
    <div className="kpi-unit">{unit}</div>
    {foot && <div className={"kpi-foot " + footTone}>{foot}</div>}
  </div>
);
