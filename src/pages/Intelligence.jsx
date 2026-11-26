import { Banner, SectionTitle } from "../components";
import { fmt } from "../lib";

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

