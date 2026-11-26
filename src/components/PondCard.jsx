import { fmt, state, tagClass } from "../lib";

export function PondCard({ p, active, onSelect }) {
  return (
    <div
      className={"card pond-card" + (active ? " selected" : "")}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(p.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(p.id)}
    >
      <div className="card-head">
        <h3>{p.name}</h3>
        <span className={"tag " + tagClass(p.oxygen)}>{state(p.oxygen)}</span>
      </div>
      <div className="pond-meta">{p.area} m² · Profundidade {fmt(p.depth)} m</div>
      <div className="pond-do">{fmt(p.oxygen)} <span className="kpi-unit">mg/L</span></div>
      <div className="pond-meta">Oxigênio dissolvido</div>
      <div className="pond-bottom">
        <span>Temperatura {fmt(p.temp)} °C</span>
        <span>pH {fmt(p.ph)}</span>
      </div>
    </div>
  );
}

/** Gráfico de linha em <canvas>, redesenhado com useEffect + ResizeObserver. */
