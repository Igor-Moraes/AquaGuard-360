import { useEffect, useState } from "react";
import emblem from "../assets/icons/aquaguard-emblema.svg";

export function Sidebar({ groups, page, menuOpen, collapsed, onNavigate, onClose }) {
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!collapsed) setTooltip(null);
  }, [collapsed]);

  const showTooltip = (event, text) => {
    if (!collapsed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({ text, left: rect.right + 8, top: rect.top + rect.height / 2 });
  };

  return (
    <aside className={"sidebar" + (menuOpen ? " open" : "") + (collapsed ? " collapsed" : "")}>
      <div className="brand">
        <img className="brand-mark" src={emblem} alt="Emblema AquaGuard 360" />
        <div className="brand-copy">
          <div className="brand-name">AQUAGUARD 360</div>
          <div className="brand-sub">ENTERPRISE INTELLIGENCE</div>
        </div>
      </div>
      <button className="sidebar-close" type="button" onClick={onClose} aria-label="Fechar menu">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      <nav className="nav" id="primary-sidebar-nav">
        {groups.map(([label, items]) => (
          <div className="nav-group" key={label}>
            <div className="nav-label">{label}</div>
            {items.map(([id, icon, text]) => (
              <button
                key={id}
                className={page === id ? "active" : ""}
                onClick={() => onNavigate(id)}
                aria-label={text}
                onMouseEnter={(event) => showTooltip(event, text)}
                onMouseLeave={() => setTooltip(null)}
                onFocus={(event) => showTooltip(event, text)}
                onBlur={() => setTooltip(null)}
              >
                <span className="nav-icon" aria-hidden="true">{icon}</span>
                <span className="nav-text">{text}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="connection">● Ambiente demonstrativo ativo</span><br />
        AquaGuard 360 · Enterprise v2.0<br />
        Dados salvos neste navegador
      </div>
      {collapsed && tooltip && (
        <div className="sidebar-tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>
          {tooltip.text}
        </div>
      )}
    </aside>
  );
}
