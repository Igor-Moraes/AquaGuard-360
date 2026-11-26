import { useEffect, useRef } from "react";

const BASE_SERIES = [6.5, 6.2, 6.4, 6.0, 5.8, 6.1, 5.7, 5.9, 5.5, 5.4, 5.8, 5.6, 5.9, 5.7, 5.5, 5.8];

export function OxygenChart({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const rect = c.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = window.devicePixelRatio || 1;
      c.width = rect.width * dpr;
      c.height = rect.height * dpr;
      const ctx = c.getContext("2d");
      ctx.scale(dpr, dpr);
      const w = rect.width, h = rect.height;
      const vals = [...BASE_SERIES.slice(0, -1), value];
      const left = 35, right = 10, top = 15, bottom = 25;
      ctx.font = "10px Arial";
      ctx.fillStyle = "#8fa9b2";
      ctx.strokeStyle = "#29434f";
      for (let i = 0; i <= 5; i++) {
        const y = top + (i * (h - top - bottom)) / 5;
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(w - right, y); ctx.stroke();
        ctx.fillText(String(10 - i * 2), 4, y + 3);
      }
      ctx.beginPath();
      vals.forEach((v, i) => {
        const x = left + (i * (w - left - right)) / (vals.length - 1);
        const y = top + ((10 - v) / 10) * (h - top - bottom);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = "#43d6a1";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = "#8fa9b2";
      ctx.fillText("Sequência de registros ilustrativos", left, h - 4);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [value]);
  return <div className="chart-wrap"><canvas ref={ref} /></div>;
}

/** Modal de cadastro de novo viveiro (formulário controlado + validação). */
