import { useState } from "react";
import { Banner, Kpi, SectionTitle } from "../components";
import { num } from "../lib";

const TIPOS = ["Alimentação", "Biometria", "Renovação de água", "Aeração", "Inspeção"];

export function Production({ d }) {
  const { ponds, management } = d;
  const [pond, setPond] = useState(ponds[0].name);
  const [type, setType] = useState(TIPOS[0]);
  const [value, setValue] = useState("");

  const biomass = ponds.reduce((s, p) => s + p.biomass, 0);
  const fish = ponds.reduce((s, p) => s + p.fish, 0);
  const avgW = fish ? (biomass * 1000) / fish : 0;
  const cycle = ponds.length ? ponds.reduce((s, p) => s + p.age, 0) / ponds.length : 0;

  const submit = () => {
    if (!value.trim()) return d.toast("Informe uma quantidade ou observação.");
    d.addManagement({ pond: ponds.some((p) => p.name === pond) ? pond : ponds[0].name, type, value: value.trim() });
    setValue("");
  };

  return (
    <section className="page">
      <Banner>Indicadores produtivos apresentados como dados fictícios. Não representam resultados zootécnicos obtidos em campo.</Banner>
      <div className="grid four">
        <Kpi label="Biomassa cadastrada" value={num(biomass)} unit="kg" />
        <Kpi label="Peixes estimados" value={num(fish)} unit="indivíduos" />
        <Kpi label="Peso médio" value={num(Math.round(avgW))} unit="g/peixe" />
        <Kpi label="Ciclo produtivo" value={num(Math.round(cycle))} unit="dias (média)" />
      </div>

      <SectionTitle title="Registro de manejo" />
      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="mg-pond">Viveiro</label>
            <select id="mg-pond" value={pond} onChange={(e) => setPond(e.target.value)}>
              {ponds.map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="mg-type">Tipo de manejo</label>
            <select id="mg-type" value={type} onChange={(e) => setType(e.target.value)}>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="mg-val">Quantidade / observação</label>
            <input id="mg-val" value={value} placeholder="Ex.: 12 kg de ração" onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
        </div>
        <div className="actions"><button className="btn primary" onClick={submit}>Registrar manejo</button></div>
      </div>

      <SectionTitle title="Registros de manejo" />
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Data e hora</th><th>Viveiro</th><th>Operação</th><th>Registro</th></tr></thead>
          <tbody>
            {management.map((m) => <tr key={m.id}><td>{m.date}</td><td>{m.pond}</td><td>{m.type}</td><td>{m.value}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

