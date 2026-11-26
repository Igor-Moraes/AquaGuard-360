import { Banner, ProfileGrid, SectionTitle } from "../components";

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
export function Devices() {
  return (
    <section className="page">
      <Banner>Os dispositivos abaixo representam uma arquitetura planejada. Nenhum equipamento físico está conectado.</Banner>
      <div className="grid three">
        {DEVICES.map(([title, tag, sub, items]) => (
          <div className="card" key={title}>
            <div className="card-head"><h3>{title}</h3><span className="tag yellow">{tag}</span></div>
            <p className="card-sub">{sub}</p>
            <ProfileGrid items={items} />
          </div>
        ))}
      </div>
      <SectionTitle title="Arquitetura de aquisição planejada" />
      <div className="card"><ProfileGrid items={ARCH} /></div>
    </section>
  );
}

