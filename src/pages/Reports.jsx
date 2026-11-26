import { SectionTitle } from "../components";
import { exportCSV } from "../lib";

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

