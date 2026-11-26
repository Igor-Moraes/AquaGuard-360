import { useEffect, useState } from "react";
import { Banner, Kpi, SectionTitle } from "../components";
import { fmt, state } from "../lib";

const tone = (v) => (v < 3 ? "danger" : v < 5 ? "warning" : "good");

const SLIDERS = [
  ["oxygen", "Oxigênio dissolvido", 1, 12, " mg/L"],
  ["temp", "Temperatura", 15, 38, " °C"],
  ["ph", "pH", 4, 11, ""],
];

export function Monitoring({ d }) {
  const p = d.focus;
  const [draft, setDraft] = useState({ oxygen: p.oxygen, temp: p.temp, ph: p.ph });
  useEffect(() => setDraft({ oxygen: p.oxygen, temp: p.temp, ph: p.ph }), [p.id, p.oxygen, p.temp, p.ph]);

  const random = () =>
    d.applyReadings(p.id, {
      oxygen: +(2 + Math.random() * 7).toFixed(1),
      temp: +(24 + Math.random() * 10).toFixed(1),
      ph: +(6 + Math.random() * 3).toFixed(1),
    });

  return (
    <section className="page">
      <Banner>
        Os controles abaixo alteram os dados simulados de <strong>{p.name}</strong>
        {d.selectedId === "all" && " (primeiro viveiro — escolha outro no seletor do topo)"}. A interface não recebe medições físicas.
      </Banner>
      <SectionTitle title="Parâmetros de qualidade da água" />
      <div className="grid metrics">
        <Kpi label="Oxigênio dissolvido" value={fmt(p.oxygen)} unit="mg/L" foot="Medição simulada" />
        <Kpi label="Temperatura" value={fmt(p.temp)} unit="°C" foot="Medição simulada" />
        <Kpi label="pH" value={fmt(p.ph)} unit="unidade de pH" foot="Medição simulada" />
        <Kpi label="Condição da leitura" value={state(p.oxygen)} unit="Classificação ilustrativa" foot="Baseada em limites configurados" tone={tone(p.oxygen)} />
      </div>

      <SectionTitle title="Laboratório de simulação" />
      <div className="card">
        <div className="simulation-grid">
          {SLIDERS.map(([k, label, min, max, suffix]) => (
            <div key={k}>
              <div className="field">
                <label htmlFor={"sl-" + k}>{label}</label>
                <input id={"sl-" + k} type="range" min={min} max={max} step="0.1" value={draft[k]} onChange={(e) => setDraft((s) => ({ ...s, [k]: Number(e.target.value) }))} />
              </div>
              <output htmlFor={"sl-" + k}>{fmt(draft[k]) + suffix}</output>
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => d.applyReadings(p.id, draft)}>Aplicar cenário</button>
          <button className="btn" onClick={random}>Gerar cenário aleatório</button>
          <button className="btn" onClick={d.resetReadings}>Restaurar valores</button>
        </div>
      </div>

      <SectionTitle title="Qualidade e procedência dos dados" />
      <div className="grid three">
        <div className="card"><h3>Origem</h3><p className="card-sub">Entrada manual simulada</p><span className="tag blue">Sem sensor conectado</span></div>
        <div className="card"><h3>Integridade</h3><p className="card-sub">Valores dentro dos limites de entrada</p><span className="tag">Validação básica</span></div>
        <div className="card"><h3>Sincronização</h3><p className="card-sub">{d.lastSync ? `Última alteração: ${d.lastSync}` : "Sem sincronização externa"}</p><span className="tag yellow">Ambiente local</span></div>
      </div>
    </section>
  );
}

