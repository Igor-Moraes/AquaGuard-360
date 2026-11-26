import { SectionTitle } from "../components";
import { exportCSV, fmt } from "../lib";

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

