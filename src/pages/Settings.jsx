import { useState } from "react";
import { ProfileGrid } from "../components";

export function Settings({ d }) {
  const [draft, setDraft] = useState(d.settings);
  const set = (k) => (e) => setDraft((s) => ({ ...s, [k]: e.target.value }));
  const save = () => {
    if (!draft.name.trim() || !draft.species.trim()) return d.toast("Preencha o nome da propriedade e a espécie.");
    d.setSettings({ ...draft, name: draft.name.trim(), species: draft.species.trim() });
    d.toast("Configuração salva.");
  };
  return (
    <section className="page">
      <div className="grid two">
        <div className="card">
          <h3>Perfil da propriedade</h3>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field"><label htmlFor="st-name">Nome da propriedade</label><input id="st-name" value={draft.name} onChange={set("name")} /></div>
            <div className="field"><label htmlFor="st-sp">Espécie cultivada</label><input id="st-sp" value={draft.species} onChange={set("species")} /></div>
            <div className="field">
              <label htmlFor="st-sys">Sistema de cultivo</label>
              <select id="st-sys" value={draft.system} onChange={set("system")}>
                {["Viveiros escavados", "Tanques-rede", "Tanques circulares"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="actions">
            <button className="btn primary" onClick={save}>Salvar configuração</button>
            <button className="btn danger-btn" onClick={() => window.confirm("Apagar os dados salvos e restaurar a demonstração?") && d.resetAll()}>Restaurar dados de demonstração</button>
          </div>
        </div>
        <div className="card">
          <h3>Parâmetros do ambiente</h3>
          <div style={{ marginTop: 14 }}>
            <ProfileGrid items={[
              ["Frontend", "React + Hooks"], ["Backend futuro", "Python / FastAPI"],
              ["Banco futuro", "PostgreSQL"], ["IoT futuro", "ESP32 / MQTT"],
              ["Inteligência", "Modelos Python"], ["Persistência atual", "Armazenamento local do navegador"],
            ]} />
          </div>
        </div>
      </div>
    </section>
  );
}
