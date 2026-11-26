export const fmt = (n, d = 1) =>
  Number(n).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const num = (n) => Number(n).toLocaleString("pt-BR");
export const state = (v) => (v < 3 ? "Crítica" : v < 5 ? "Atenção" : "Referência");
export const tagClass = (v) => (v < 3 ? "red" : v < 5 ? "yellow" : "blue");
export const stamp = () => new Date().toLocaleString("pt-BR");

let seq = 0;
export const uid = () => `${Date.now()}-${seq++}`;

const mk = (id, name, area, depth, oxygen, temp, ph, biomass, fish, age) => ({
  id, name, area, depth, oxygen, temp, ph, biomass, fish, age,
  initial: { oxygen, temp, ph },
});

export const INITIAL_PONDS = [
  mk(1, "Viveiro 01", 1200, 1.5, 5.8, 27.4, 7.2, 1250, 2800, 120),
  mk(2, "Viveiro 02", 950, 1.4, 4.1, 29.1, 7.6, 980, 2200, 105),
  mk(3, "Viveiro 03", 1500, 1.6, 6.7, 26.8, 7.0, 1600, 3500, 135),
];

export const INITIAL_HISTORY = INITIAL_PONDS.map((p) => ({
  id: "h" + p.id,
  date: "Registro demonstrativo 06:00",
  pond: p.name,
  oxygen: p.oxygen,
  temp: p.temp,
  ph: p.ph,
  source: "Dados fictícios",
}));

export const INITIAL_MANAGEMENT = [
  { id: "m1", date: "Registro demonstrativo", pond: "Viveiro 01", type: "Alimentação", value: "12 kg de ração" },
  { id: "m2", date: "Registro demonstrativo", pond: "Viveiro 02", type: "Inspeção", value: "Verificação visual" },
];

export const INITIAL_SETTINGS = {
  name: "Fazenda Experimental",
  species: "Tilápia-do-Nilo",
  system: "Viveiros escavados",
};

export function getAlerts(ponds) {
  const a = [];
  ponds.forEach((p) => {
    if (p.oxygen < 3)
      a.push({ level: "red", title: `${p.name} — Oxigênio em condição crítica`, text: `Leitura simulada de ${fmt(p.oxygen)} mg/L. Confirmar com instrumento de referência e avaliar imediatamente o viveiro.` });
    else if (p.oxygen < 5)
      a.push({ level: "yellow", title: `${p.name} — Atenção ao oxigênio`, text: `Leitura simulada de ${fmt(p.oxygen)} mg/L. Acompanhar tendência e verificar medição e aeração.` });
    if (p.temp > 32)
      a.push({ level: "yellow", title: `${p.name} — Temperatura elevada`, text: `Temperatura simulada de ${fmt(p.temp)} °C. Verificar as condições do cultivo.` });
    if (p.ph < 6 || p.ph > 9)
      a.push({ level: "yellow", title: `${p.name} — pH fora da faixa ilustrativa`, text: `pH simulado de ${fmt(p.ph)}. Confirmar leitura e avaliar a água.` });
  });
  if (!a.length)
    a.push({ level: "green", title: "Nenhuma ocorrência pelos limites demonstrativos", text: "Isso não comprova ausência de risco ambiental ou produtivo." });
  return a;
}

export function exportCSV(filename, rows) {
  const csv = rows
    .map((r) => r.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(";"))
    .join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
