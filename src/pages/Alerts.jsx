import { AlertItem, Banner, SectionTitle } from "../components";

export function Alerts({ d }) {
  return (
    <section className="page">
      <Banner>Limites utilizados são exclusivamente ilustrativos. Os valores operacionais deverão ser definidos por responsável técnico, considerando espécie, fase de cultivo, manejo e condições ambientais.</Banner>
      <SectionTitle title="Central de alertas"><span className="tag yellow">Classificação demonstrativa</span></SectionTitle>
      {d.alerts.map((a, i) => <AlertItem key={i} a={a} />)}
    </section>
  );
}

