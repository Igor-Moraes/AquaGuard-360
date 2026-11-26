import { useEffect, useRef, useState } from "react";
import { fmt, state, tagClass } from "./lib";

export const Banner = ({ children }) => <div className="banner">{children}</div>;

export const SectionTitle = ({ title, sub, children }) => (
  <div className="section-title">
    <h2>{title}</h2>
    {sub && <small>{sub}</small>}
    {children}
  </div>
);

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

export const AlertItem = ({ a }) => (
  <div className={"alert-item " + a.level}>
    <div className="alert-title">{a.title}</div>
    <div className="alert-text">{a.text}</div>
  </div>
);

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
const BASE_SERIES = [6.5, 6.2, 6.4, 6.0, 5.8, 6.1, 5.7, 5.9, 5.5, 5.4, 5.8, 5.6, 5.9, 5.7, 5.5, 5.8];

export function OxygenChart({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const rect = c.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = window.devicePixelRatio || 1;
      c.width = rect.width * dpr;
      c.height = rect.height * dpr;
      const ctx = c.getContext("2d");
      ctx.scale(dpr, dpr);
      const w = rect.width, h = rect.height;
      const vals = [...BASE_SERIES.slice(0, -1), value];
      const left = 35, right = 10, top = 15, bottom = 25;
      ctx.font = "10px Arial";
      ctx.fillStyle = "#8fa9b2";
      ctx.strokeStyle = "#29434f";
      for (let i = 0; i <= 5; i++) {
        const y = top + (i * (h - top - bottom)) / 5;
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(w - right, y); ctx.stroke();
        ctx.fillText(String(10 - i * 2), 4, y + 3);
      }
      ctx.beginPath();
      vals.forEach((v, i) => {
        const x = left + (i * (w - left - right)) / (vals.length - 1);
        const y = top + ((10 - v) / 10) * (h - top - bottom);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = "#43d6a1";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = "#8fa9b2";
      ctx.fillText("Sequência de registros ilustrativos", left, h - 4);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [value]);
  return <div className="chart-wrap"><canvas ref={ref} /></div>;
}

/** Modal de cadastro de novo viveiro (formulário controlado + validação). */
const FIELDS = [
  ["name", "Nome do viveiro"],
  ["area", "Área (m²)", 1, 100000],
  ["depth", "Profundidade (m)", 0.1, 10],
  ["biomass", "Biomassa estimada (kg)", 0, 1000000],
  ["fish", "Peixes cadastrados", 0, 1000000],
  ["age", "Idade de cultivo (dias)", 0, 1000],
  ["oxygen", "Oxigênio dissolvido (mg/L)", 1, 12],
  ["temp", "Temperatura (°C)", 15, 38],
  ["ph", "pH", 4, 11],
];

export function PondModal({ onClose, onSave }) {
  const [f, setF] = useState({
    name: "", area: "1000", depth: "1.5", biomass: "0", fish: "0",
    age: "0", oxygen: "6", temp: "27", ph: "7",
  });
  const [err, setErr] = useState({});

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Informe o nome do viveiro.";
    FIELDS.slice(1).forEach(([k, , lo, hi]) => {
      const v = Number(f[k]);
      if (f[k] === "" || !Number.isFinite(v) || v < lo || v > hi) er[k] = `Informe um valor entre ${lo} e ${hi}.`;
    });
    if (Object.keys(er).length) return setErr(er);
    const msg = onSave(f);
    if (msg) return setErr({ name: msg });
    onClose();
  };

  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="card modal" onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <div className="card-head">
          <div>
            <h3 id="pm-title">Novo viveiro</h3>
            <div className="card-sub">Cadastre a unidade e as leituras iniciais</div>
          </div>
          <button type="button" className="btn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className="form-grid">
          {FIELDS.map(([k, label]) => (
            <div className="field" key={k}>
              <label htmlFor={"pf-" + k}>{label}</label>
              <input
                id={"pf-" + k}
                type={k === "name" ? "text" : "number"}
                step="any"
                value={f[k]}
                onChange={set(k)}
                autoFocus={k === "name"}
                placeholder={k === "name" ? "Ex.: Viveiro 04" : undefined}
              />
              {err[k] && <div className="err">{err[k]}</div>}
            </div>
          ))}
        </div>
        <div className="actions">
          <button type="submit" className="btn primary">Cadastrar viveiro</button>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
