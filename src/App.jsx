import { useState } from "react";
import { useAquaData, useToast } from "./hooks";
import { PondModal, Sidebar } from "./components";
import * as P from "./pages";

// [id, ícone, rótulo do menu, título da página, subtítulo, componente]
const GROUPS = [
  ["GESTÃO ESTRATÉGICA", [
    ["overview", "◫", "Visão executiva", "Visão executiva", "Inteligência operacional da propriedade aquícola", P.Overview],
    ["ponds", "◉", "Viveiros", "Gestão de viveiros", "Cadastro e acompanhamento individual", P.Ponds],
    ["production", "♧", "Gestão produtiva", "Gestão produtiva", "Biomassa, manejo e informações zootécnicas", P.Production],
  ]],
  ["MONITORAMENTO", [
    ["monitoring", "⌁", "Qualidade da água", "Qualidade da água", "Monitoramento e simulação de parâmetros", P.Monitoring],
    ["devices", "⌘", "Dispositivos IoT", "Dispositivos IoT", "Infraestrutura instrumental e conectividade", P.Devices],
    ["history", "▤", "Histórico e dados", "Histórico e dados", "Registros ambientais e procedência", P.History],
  ]],
  ["INTELIGÊNCIA", [
    ["intelligence", "✧", "Central preditiva", "Central preditiva", "Análises experimentais e interpretação contextual", P.Intelligence],
    ["alerts", "⚑", "Alertas e ocorrências", "Alertas e ocorrências", "Identificação demonstrativa de condições de atenção", P.Alerts],
    ["scenarios", "◈", "Simulação de cenários", "Simulação de cenários", "Comparação de condições hipotéticas", P.Scenarios],
  ]],
  ["ADMINISTRAÇÃO", [
    ["reports", "▧", "Relatórios", "Relatórios", "Indicadores e exportação de dados", P.Reports],
    ["settings", "⚙", "Configurações", "Configurações", "Parâmetros e informações da propriedade", P.Settings],
  ]],
];
const PAGES = Object.fromEntries(GROUPS.flatMap(([, items]) => items).map((p) => [p[0], p]));

export default function App() {
  const { msg, show, toast } = useToast();
  const d = useAquaData(toast);
  const [page, setPage] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const go = (id) => {
    setPage(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const pickPond = (id) => {
    d.setSelectedId(id);
    go("ponds");
  };

  const [, , , title, subtitle, View] = PAGES[page];

  return (
    <div className={"layout" + (sidebarCollapsed ? " sidebar-collapsed" : "")}>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      <Sidebar
        groups={GROUPS}
        page={page}
        menuOpen={menuOpen}
        collapsed={sidebarCollapsed}
        onNavigate={go}
        onClose={() => setMenuOpen(false)}
      />

      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="sidebar-collapse-toggle"
              type="button"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Minimizar menu lateral"}
              aria-expanded={!sidebarCollapsed}
              aria-controls="primary-sidebar-nav"
              data-tooltip={sidebarCollapsed ? "Expandir menu lateral" : "Minimizar menu lateral"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
                <rect x="3.5" y="4.5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M9 5v14" stroke="currentColor" strokeWidth="1.7" />
                <rect x="5.5" y="8" width="1.5" height="8" rx=".7" fill="currentColor" />
              </svg>
            </button>
            <button
              className="mobile-menu"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-sidebar-nav"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="page-heading">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="top-right">
            <span className="live-pill">● MODO DEMONSTRAÇÃO</span>
            <select
              aria-label="Viveiro selecionado"
              value={d.selectedId}
              onChange={(e) => d.setSelectedId(e.target.value === "all" ? "all" : Number(e.target.value))}
            >
              <option value="all">Todos os viveiros</option>
              {d.ponds.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="avatar">AG</div>
          </div>
        </header>

        <View d={d} go={go} pickPond={pickPond} onNew={() => setShowForm(true)} />

        <div className="footer-note">
          AQUAGUARD 360 · ENTERPRISE PROTOTYPE v2.0<br />
          Protótipo de interface para demonstração. Dados simulados, salvos apenas no navegador. Sem conexão
          instrumental, autenticação ou previsão validada. Não utilizar para decisões operacionais reais de cultivo.
        </div>
      </main>

      {showForm && <PondModal onClose={() => setShowForm(false)} onSave={d.addPond} />}
      <div className={"toast" + (show ? " show" : "")} role="status">{msg}</div>
    </div>
  );
}
