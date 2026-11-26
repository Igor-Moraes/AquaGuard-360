import { useEffect, useState } from "react";
import { AlertItem, Banner, Kpi, OxygenChart, PondCard, SectionTitle } from "./components";
import { exportCSV, fmt, num, state, tagClass } from "./lib";

const tone = (v) => (v < 3 ? "danger" : v < 5 ? "warning" : "good");

/* ---------- Visão executiva ---------- */
export function Overview({ d, go, pickPond }) {
  const { ponds, focus, alerts, settings } = d;
  const biomass = ponds.reduce((s, p) => s + p.biomass, 0);
  const avgO2 = ponds.length ? ponds.reduce((s, p) => s + p.oxygen, 0) / ponds.length : 0;
  const active = alerts.filter((a) => a.level !== "green").length;
  return (
    <section className="page">
      <div className="hero">
        <div>
          <div className="eyebrow">CENTRAL DE INTELIGÊNCIA AQUÍCOLA</div>
          <h2>Da água à decisão.</h2>
          <p>Uma visão integrada das condições ambientais e produtivas. Identifique alterações, acompanhe tendências e organize decisões com base nas informações do cultivo.</p>
        </div>
        <div className="hero-badge">
          <strong>{settings.name.toUpperCase()}</strong><br />
          Sistema: {settings.system}<br />
          Espécie: {settings.species}<br />
          {new Date().toLocaleDateString("pt-BR")}
        </div>
      </div>
      <Banner>AMBIENTE SIMULADO — Os dados, alertas e análises desta apresentação são fictícios. Não existe conexão com sensores reais ou modelo preditivo validado.</Banner>

      <div className="grid metrics">
        <Kpi label="Viveiros cadastrados" icon="◉" value={String(ponds.length).padStart(2, "0")} unit="Unidades cadastradas" foot="● Estrutura cadastrada" footTone="good" />
        <Kpi label="Biomassa total" icon="♧" value={num(biomass)} unit="kg estimados" foot="● Valores cadastrais simulados" />
        <Kpi label="Alertas ativos" icon="⚑" value={String(active).padStart(2, "0")} unit="Ocorrências demonstrativas" foot="● Exigem acompanhamento" tone={active ? "warning" : "good"} footTone={active ? "warning" : "good"} />
        <Kpi label="Oxigênio médio" icon="⌁" value={fmt(avgO2)} unit="mg/L" foot="● Média das leituras simuladas" />
      </div>

      <SectionTitle title="Inteligência operacional" sub="Resumo da situação dos viveiros" />
      <div className="grid two">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Comportamento do oxigênio dissolvido</h3>
              <div className="card-sub">Série histórica ilustrativa · {focus.name} · mg/L</div>
            </div>
            <span className="tag blue">Demonstração</span>
          </div>
          <div className="legend"><span><i className="oxygen" />Oxigênio dissolvido</span></div>
          <OxygenChart value={focus.oxygen} />
        </div>
        <div className="card">
          <div className="card-head">
            <h3>Central de ocorrências</h3>
            <span className="tag yellow">Acompanhamento</span>
          </div>
          {alerts.slice(0, 2).map((a, i) => <AlertItem key={i} a={a} />)}
          <button className="btn" onClick={() => go("alerts")}>Abrir central de alertas →</button>
        </div>
      </div>

      <SectionTitle title="Condição individual dos viveiros" sub="Selecione uma unidade para detalhamento" />
      <div className="grid three">
        {ponds.map((p) => <PondCard key={p.id} p={p} active={p.id === focus.id} onSelect={pickPond} />)}
      </div>
    </section>
  );
}

/* ---------- Viveiros ---------- */
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

/* ---------- Gestão produtiva ---------- */
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

/* ---------- Qualidade da água ---------- */
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

/* ---------- Dispositivos IoT ---------- */
const DEVICES = [
  ["ESP32 — AG360-001", "Planejado", "Unidade de aquisição do Viveiro 01", [["Comunicação", "MQTT"], ["Alimentação", "A definir"]]],
  ["Sensor de oxigênio", "Não conectado", "Medição de oxigênio dissolvido", [["Calibração", "Não verificada"], ["Interface", "A definir"]]],
  ["Sonda multiparâmetro", "Não conectada", "Temperatura e pH", [["Protocolo", "A definir"], ["Estado", "Projeto piloto"]]],
];
const ARCH = [
  ["1. Instrumentação", "Sensores calibrados"], ["2. Aquisição", "ESP32"],
  ["3. Comunicação", "MQTT com autenticação"], ["4. Processamento", "API Python / FastAPI"],
  ["5. Persistência", "Banco temporal"], ["6. Visualização", "AquaGuard 360"],
];
const Profile = ({ items }) => (
  <div className="profile-grid">
    {items.map(([k, v]) => <div className="profile-item" key={k}><small>{k}</small><strong>{v}</strong></div>)}
  </div>
);

export function Devices() {
  return (
    <section className="page">
      <Banner>Os dispositivos abaixo representam uma arquitetura planejada. Nenhum equipamento físico está conectado.</Banner>
      <div className="grid three">
        {DEVICES.map(([title, tag, sub, items]) => (
          <div className="card" key={title}>
            <div className="card-head"><h3>{title}</h3><span className="tag yellow">{tag}</span></div>
            <p className="card-sub">{sub}</p>
            <Profile items={items} />
          </div>
        ))}
      </div>
      <SectionTitle title="Arquitetura de aquisição planejada" />
      <div className="card"><Profile items={ARCH} /></div>
    </section>
  );
}

/* ---------- Histórico ---------- */
export function History({ d }) {
  const rows = d.history;
  const exportHistory = () =>
    exportCSV("aquaguard_historico.csv", [
      ["Data e hora", "Viveiro", "Oxigenio mg/L", "Temperatura C", "pH", "Origem"],
      ...rows.map((r) => [r.date, r.pond, r.oxygen, r.temp, r.ph, r.source]),
    ]);
  return (
    <section className="page">
      <SectionTitle title="Histórico de medições">
        <button className="btn" onClick={exportHistory}>Exportar CSV</button>
      </SectionTitle>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Data e hora</th><th>Viveiro</th><th>OD (mg/L)</th><th>Temperatura</th><th>pH</th><th>Origem</th></tr></thead>
          <tbody>
            {rows.length ? rows.slice(0, 100).map((r) => (
              <tr key={r.id}><td>{r.date}</td><td>{r.pond}</td><td>{fmt(r.oxygen)}</td><td>{fmt(r.temp)} °C</td><td>{fmt(r.ph)}</td><td>{r.source}</td></tr>
            )) : <tr><td colSpan="6" className="empty">Nenhuma medição registrada.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- Central preditiva ---------- */
const ETAPAS = [
  ["Etapa 1", "", "Linha de base", "Persistência e regressão simples para estabelecer referência quantitativa."],
  ["Etapa 2", "blue", "Modelos supervisionados", "Avaliação de Random Forest e XGBoost, condicionada à quantidade e qualidade dos dados."],
  ["Etapa 3", "yellow", "Validação em campo", "Comparação cronológica, análise de erros, eventos críticos e generalização entre viveiros."],
];

export function Intelligence({ d }) {
  const p = d.focus;
  return (
    <section className="page">
      <Banner>CENTRAL PREDITIVA EXPERIMENTAL — Nesta versão, a estimativa utiliza persistência da última leitura. Não há treinamento de IA, previsão validada ou garantia de antecedência de eventos críticos.</Banner>
      <div className="grid two">
        <div className="card">
          <div className="eyebrow">REFERÊNCIA EXPERIMENTAL</div>
          <h3>Oxigênio dissolvido — {p.name}</h3>
          <div className="kpi-value">{fmt(p.oxygen)} mg/L</div>
          <div className="kpi-unit">Estimativa por persistência · próximo intervalo demonstrativo</div>
          <div className="info-box">
            <strong>Como essa estimativa é produzida?</strong>
            <p>O sistema repete a última leitura disponível. É uma referência de comparação para futuros modelos, não uma previsão biológica do comportamento da água.</p>
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">INTERPRETAÇÃO CONTEXTUAL</div>
          <h3>Condição atual do viveiro</h3>
          <p className="card-sub" style={{ fontSize: 12, lineHeight: 1.9 }}>
            {p.name}: oxigênio {fmt(p.oxygen)} mg/L, temperatura {fmt(p.temp)} °C e pH {fmt(p.ph)}. A referência por persistência repete a última leitura. Ela não representa uma previsão validada. Para avaliar risco real, serão necessários dados temporais, histórico de manejo, calibração e validação experimental.
          </p>
          <div className="info-box">
            <strong>Variáveis a incorporar</strong>
            <p>Histórico temporal, horário, biomassa, alimentação, aeração, renovação da água, meteorologia e condições específicas de cultivo.</p>
          </div>
        </div>
      </div>
      <SectionTitle title="Desenvolvimento do modelo preditivo" />
      <div className="grid three">
        {ETAPAS.map(([tag, cls, title, text]) => (
          <div className="card" key={tag}>
            <span className={"tag " + cls}>{tag}</span>
            <h3 style={{ marginTop: 13 }}>{title}</h3>
            <p className="card-sub" style={{ lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Alertas ---------- */
export function Alerts({ d }) {
  return (
    <section className="page">
      <Banner>Limites utilizados são exclusivamente ilustrativos. Os valores operacionais deverão ser definidos por responsável técnico, considerando espécie, fase de cultivo, manejo e condições ambientais.</Banner>
      <SectionTitle title="Central de alertas"><span className="tag yellow">Classificação demonstrativa</span></SectionTitle>
      {d.alerts.map((a, i) => <AlertItem key={i} a={a} />)}
    </section>
  );
}

/* ---------- Cenários ---------- */
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

/* ---------- Relatórios ---------- */
export function Reports({ d }) {
  const exportHistory = () =>
    exportCSV("aquaguard_historico.csv", [
      ["Data e hora", "Viveiro", "Oxigenio mg/L", "Temperatura C", "pH", "Origem"],
      ...d.history.map((r) => [r.date, r.pond, r.oxygen, r.temp, r.ph, r.source]),
    ]);
  const exportAlerts = () =>
    exportCSV("aquaguard_alertas.csv", [["Nivel", "Ocorrencia", "Descricao"], ...d.alerts.map((a) => [a.level, a.title, a.text])]);
  const exportProduction = () =>
    exportCSV("aquaguard_producao.csv", [
      ["Viveiro", "Area m2", "Profundidade m", "Biomassa kg", "Peixes", "Idade dias"],
      ...d.ponds.map((p) => [p.name, p.area, p.depth, p.biomass, p.fish, p.age]),
      [],
      ["Data e hora", "Viveiro", "Operacao", "Registro"],
      ...d.management.map((m) => [m.date, m.pond, m.type, m.value]),
    ]);
  return (
    <section className="page">
      <SectionTitle title="Relatórios e indicadores" />
      <div className="grid three">
        <div className="card"><h3>Relatório ambiental</h3><p className="card-sub">Resumo das medições disponíveis no protótipo.</p><button className="btn" onClick={exportHistory}>Exportar dados CSV</button></div>
        <div className="card"><h3>Relatório de ocorrências</h3><p className="card-sub">Classificações demonstrativas do cenário atual.</p><button className="btn" onClick={exportAlerts}>Exportar alertas CSV</button></div>
        <div className="card"><h3>Relatório produtivo</h3><p className="card-sub">Cadastro dos viveiros e registros de manejo.</p><button className="btn" onClick={exportProduction}>Exportar produção CSV</button></div>
      </div>
      <SectionTitle title="Indicadores de validação a implementar" />
      <div className="grid three">
        <div className="card"><h3>MAE</h3><p className="card-sub">Erro absoluto médio das previsões.</p></div>
        <div className="card"><h3>RMSE</h3><p className="card-sub">Raiz do erro quadrático médio.</p></div>
        <div className="card"><h3>Eventos críticos</h3><p className="card-sub">Sensibilidade, falsos alarmes e antecedência.</p></div>
      </div>
    </section>
  );
}

/* ---------- Configurações ---------- */
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
            <Profile items={[
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
