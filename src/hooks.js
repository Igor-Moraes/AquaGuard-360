import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  INITIAL_HISTORY, INITIAL_MANAGEMENT, INITIAL_PONDS, INITIAL_SETTINGS,
  getAlerts, stamp, uid,
} from "./lib";

/** useState que persiste no localStorage. */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage indisponível */ }
  }, [key, value]);
  return [value, setValue];
}

/** Mensagem temporária (toast). */
export function useToast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef();
  const toast = useCallback((m) => {
    setMsg(m);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return { msg, show, toast };
}

/** Estado central da aplicação: viveiros, histórico, manejo e configurações. */
export function useAquaData(toast) {
  const [ponds, setPonds] = useLocalStorage("ag360:ponds", INITIAL_PONDS);
  const [history, setHistory] = useLocalStorage("ag360:history", INITIAL_HISTORY);
  const [management, setManagement] = useLocalStorage("ag360:management", INITIAL_MANAGEMENT);
  const [settings, setSettings] = useLocalStorage("ag360:settings", INITIAL_SETTINGS);
  const [selectedId, setSelectedId] = useState("all");
  const [lastSync, setLastSync] = useState(null);

  // "Todos os viveiros" usa o primeiro viveiro como foco nas telas individuais
  const focus = ponds.find((p) => p.id === selectedId) || ponds[0];
  const alerts = useMemo(() => getAlerts(ponds), [ponds]);

  const log = (p, source) =>
    setHistory((h) =>
      [{ id: uid(), date: stamp(), pond: p.name, oxygen: p.oxygen, temp: p.temp, ph: p.ph, source }, ...h].slice(0, 500)
    );

  /** Retorna uma mensagem de erro (string) ou null se cadastrou. */
  function addPond(f) {
    const name = f.name.trim();
    if (ponds.some((p) => p.name.toLowerCase() === name.toLowerCase()))
      return "Já existe um viveiro com esse nome.";
    const r = { oxygen: +f.oxygen, temp: +f.temp, ph: +f.ph };
    const p = {
      id: Date.now(), name, area: +f.area, depth: +f.depth,
      biomass: +f.biomass, fish: +f.fish, age: +f.age, ...r, initial: r,
    };
    setPonds((l) => [...l, p]);
    log(p, "Cadastro");
    setSelectedId(p.id);
    toast(`${name} cadastrado.`);
    return null;
  }

  function removePond(id) {
    if (ponds.length <= 1) return toast("Mantenha ao menos um viveiro cadastrado.");
    const p = ponds.find((x) => x.id === id);
    setPonds((l) => l.filter((x) => x.id !== id));
    setSelectedId("all");
    toast(`${p.name} removido.`);
  }

  function applyReadings(id, r) {
    const p = ponds.find((x) => x.id === id);
    if (!p) return;
    const updated = { ...p, ...r };
    setPonds((l) => l.map((x) => (x.id === id ? updated : x)));
    log(updated, "Simulação");
    setLastSync(stamp());
    toast("Cenário aplicado. Dados continuam simulados.");
  }

  function resetReadings() {
    setPonds((l) => l.map((p) => ({ ...p, ...p.initial })));
    setLastSync(stamp());
    toast("Valores iniciais restaurados.");
  }

  function addManagement(entry) {
    setManagement((m) => [{ id: uid(), date: stamp(), ...entry }, ...m]);
    toast("Registro de manejo adicionado.");
  }

  function resetAll() {
    setPonds(INITIAL_PONDS);
    setHistory(INITIAL_HISTORY);
    setManagement(INITIAL_MANAGEMENT);
    setSettings(INITIAL_SETTINGS);
    setSelectedId("all");
    toast("Dados de demonstração restaurados.");
  }

  return {
    ponds, history, management, settings, setSettings, alerts, focus, lastSync,
    selectedId, setSelectedId, toast,
    addPond, removePond, applyReadings, resetReadings, addManagement, resetAll,
  };
}
