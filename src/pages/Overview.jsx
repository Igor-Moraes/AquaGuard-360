import { AlertItem, Banner, Kpi, OxygenChart, PondCard, SectionTitle } from "../components";
import { fmt, num } from "../lib";

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

