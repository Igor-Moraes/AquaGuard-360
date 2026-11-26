import { useEffect, useState } from "react";

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
