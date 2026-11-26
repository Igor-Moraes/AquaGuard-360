import { useState } from "react";
import { Banner, SectionTitle } from "../components";
import { fmt, state, tagClass } from "../lib";

export function Scenarios({ d }) {
  const [inputs, setInputs] = useState(["5.8", "4.2", "7.0"]);
  const [result, setResult] = useState([5.8, 4.2, 7]);
  const compare = () => {
    const n = inputs.map(Number);
    if (inputs.some((v) => v === "") || n.some((v) => !Number.isFinite(v) || v < 0 || v > 20))
      return d.toast("Informe valores entre 0 e 20 mg/L.");
    setResult(n);
  };
  return (
    <section className="page">
      <Banner>Simulação conceitual: os cenários não estimam resposta real do viveiro. A implementação futura deverá utilizar modelos calibrados e dados históricos.</Banner>
      <div className="card">
        <h3>Comparador de cenários</h3>
        <p className="card-sub">Altere o valor hipotético de oxigênio para comparar classificações.</p>
        <div className="simulation-grid" style={{ marginTop: 20 }}>
          {inputs.map((v, i) => (
            <div className="field" key={i}>
              <label htmlFor={"sc-" + i}>Cenário {"ABC"[i]} — {i ? "Alternativo" : "Referência"} (mg/L)</label>
              <input id={"sc-" + i} type="number" min="0" max="20" step="0.1" value={v} onChange={(e) => setInputs((s) => s.map((x, j) => (j === i ? e.target.value : x)))} />
            </div>
          ))}
        </div>
        <div className="actions"><button className="btn primary" onClick={compare}>Comparar cenários</button></div>
      </div>
      <SectionTitle title="Comparação" />
      <div className="grid three">
        {result.map((v, i) => (
          <div className="card" key={i}>
            <div className="card-head"><h3>Cenário {"ABC"[i]}</h3><span className={"tag " + tagClass(v)}>{state(v)}</span></div>
            <div className="kpi-value">{fmt(v)} <span className="kpi-unit">mg/L</span></div>
            <div className="card-sub">Classificação ilustrativa por limite fixo.</div>
          </div>
        ))}
      </div>
    </section>
  );
}

