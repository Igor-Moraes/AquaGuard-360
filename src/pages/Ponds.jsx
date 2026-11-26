import { PondCard, SectionTitle } from "../components";
import { fmt, num, state, tagClass } from "../lib";

export function Ponds({ d, onNew }) {
  const { ponds, focus } = d;
  return (
    <section className="page">
      <SectionTitle title="Cadastro e acompanhamento dos viveiros">
        <button className="btn primary" onClick={onNew}>+ Novo viveiro</button>
      </SectionTitle>
      <div className="grid three">
        {ponds.map((p) => <PondCard key={p.id} p={p} active={p.id === focus.id} onSelect={d.setSelectedId} />)}
      </div>

      <SectionTitle title="Detalhamento da unidade selecionada" />
      <div className="card">
        <div className="card-head">
          <div>
            <h3>{focus.name}</h3>
            <div className="card-sub">Perfil individual demonstrativo</div>
          </div>
          <span className={"tag " + tagClass(focus.oxygen)}>{state(focus.oxygen)}</span>
        </div>
        <div className="profile-grid">
          {[
            ["Área", `${num(focus.area)} m²`],
            ["Profundidade", `${fmt(focus.depth)} m`],
            ["Biomassa estimada", `${num(focus.biomass)} kg`],
            ["Peixes cadastrados", num(focus.fish)],
            ["Idade de cultivo", `${focus.age} dias`],
            ["Densidade estimada", `${fmt(focus.biomass / focus.area, 2)} kg/m²`],
          ].map(([k, v]) => (
            <div className="profile-item" key={k}><small>{k}</small><strong>{v}</strong></div>
          ))}
        </div>
        <div className="actions">
          <button className="btn danger-btn" onClick={() => window.confirm(`Remover ${focus.name}?`) && d.removePond(focus.id)}>
            Remover viveiro
          </button>
        </div>
      </div>
    </section>
  );
}

