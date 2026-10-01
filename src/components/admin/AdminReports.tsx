import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from 'recharts';
import { useStudio } from '../../context/StudioContext';

interface MonthlyDataPoint {
  mes: string;
  mesCompleto: string;
  ganancias: number;
  citas: number;
  ticketPromedio: number;
  nuevasClientas: number;
  meta: number;
}

export const AdminReports: React.FC = () => {
  const { appointments } = useStudio();
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('12m');
  const [activeMetric, setActiveMetric] = useState<'both' | 'revenue' | 'volume'>('both');

    // Calculate data from actual appointments context
  const fullYearData = useMemo(() => {
    // Initialize 12 months for the current year
    const currentYear = new Date().getFullYear();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthNamesFull = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    let baseData = months.map((m, i) => ({
      mes: m,
      mesCompleto: `${monthNamesFull[i]} ${currentYear}`,
      ganancias: 0,
      citas: 0,
      ticketPromedio: 0,
      nuevasClientas: 0,
      meta: 3000 // default mock goal
    }));

    // Aggregate appointments
    appointments.forEach(apt => {
      if (apt.status === 'cancelada' || apt.status === 'no_asistio') return;
      if (!apt.dateStr) return;
      
      const dateParts = apt.dateStr.split('-');
      if (dateParts.length !== 3) return;
      
      const aptYear = parseInt(dateParts[0], 10);
      const aptMonth = parseInt(dateParts[1], 10) - 1; // 0-indexed
      
      // Only count current year for simplicity in this MVP view
      if (aptYear === currentYear && aptMonth >= 0 && aptMonth < 12) {
        baseData[aptMonth].ganancias += (apt.price || 0);
        baseData[aptMonth].citas += 1;
        // Mocking new clients randomly for simplicity
        baseData[aptMonth].nuevasClientas += Math.floor(Math.random() * 2); 
      }
    });
    
    // Calculate averages
    baseData = baseData.map(d => ({
      ...d,
      ticketPromedio: d.citas > 0 ? d.ganancias / d.citas : 0
    }));

    return baseData;
  }, [appointments]);

  // Filtered dataset according to timeframe
  const displayData = useMemo(() => {
    if (timeRange === '6m') {
      return fullYearData.slice(6);
    }
    return fullYearData;
  }, [timeRange]);

  // Technique revenue distribution data
  const techniqueData = [
    { tecnica: 'Acrílico Esculpido', ingresos: 1980, citas: 41, porcentaje: 38 },
    { tecnica: 'Manicura Rusa', ingresos: 1540, citas: 34, porcentaje: 29 },
    { tecnica: 'Nail Art 3D & Oro', ingresos: 960, citas: 15, porcentaje: 18 },
    { tecnica: 'Soft Gel Tips', ingresos: 510, citas: 10, porcentaje: 10 },
    { tecnica: 'Spa & Pedicura', ingresos: 250, citas: 6, porcentaje: 5 },
  ];

  // Aggregated totals
  const totalRevenue = displayData.reduce((sum, d) => sum + d.ganancias, 0);
  const totalAppointments = displayData.reduce((sum, d) => sum + d.citas, 0);
  const avgTicket = totalRevenue / totalAppointments;
  const bestMonth = [...displayData].sort((a, b) => b.ganancias - a.ganancias)[0];

  // Custom Recharts Tooltip matching L'Atelier Vernis luxury branding
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as MonthlyDataPoint;
      return (
        <div className="bg-[#1e1b18] text-white p-3.5 rounded-2xl shadow-xl border border-[#fedeb2]/30 text-xs min-w-[200px] animate-in fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="font-serif font-bold text-sm text-[#fedeb2]">{dataPoint.mesCompleto}</span>
            <span className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Atelier Metrics</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-white/80 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#725b38] inline-block"></span>
                Ganancias:
              </span>
              <span className="font-bold text-white font-mono">${dataPoint.ganancias.toLocaleString()} MXN</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/80 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fedeb2] inline-block"></span>
                Volumen Citas:
              </span>
              <span className="font-bold text-[#fedeb2] font-mono">{dataPoint.citas} citas</span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10 text-white/70">
              <span>Ticket Promedio:</span>
              <span className="text-white">${dataPoint.ticketPromedio.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70">
              <span>Nuevas Clientas:</span>
              <span className="text-green-400 font-semibold">+{dataPoint.nuevasClientas}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header and Controls */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#725b38] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            <span>Business Intelligence & Analytics</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a] tracking-tight">
            Dashboard de Rendimiento & Ganancias
          </h1>
          <p className="text-xs text-[#4c4640] leading-relaxed mt-1">
            Visualización histórica de ingresos facturados, volumen de turnos completados y comportamiento de demanda en cabina.
          </p>
        </div>

        {/* Filters and Timeframe */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Metric Selector Tabs */}
          <div className="inline-flex p-1 bg-[#f2edea] rounded-full border border-[#cec5bd]/40 text-xs">
            <button
              type="button"
              onClick={() => setActiveMetric('both')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                activeMetric === 'both' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Ganancias & Citas
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('revenue')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                activeMetric === 'revenue' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Solo Ganancias
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('volume')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                activeMetric === 'volume' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Solo Citas
            </button>
          </div>

          {/* Time range toggle */}
          <div className="inline-flex p-1 bg-white border border-[#cec5bd]/40 rounded-full text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                timeRange === '6m' ? 'bg-[#fedeb2] text-[#584323]' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Últimos 6 Meses
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('12m')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                timeRange === '12m' ? 'bg-[#fedeb2] text-[#584323]' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Año Completo 2024
            </button>
          </div>
        </div>
      </section>

      {/* KPI Cards Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Facturación en Período
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#725b38]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-[11px] font-sans text-[#725b38] font-semibold block mt-0.5">
              MXN totales recaudados
            </span>
            <p className="text-[10px] text-green-700 font-bold mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +14.8% vs año anterior
            </p>
          </div>
        </div>

        {/* Total Appointments Volume */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Volumen Total de Citas
            </span>
            <div className="w-8 h-8 rounded-full bg-[#fedeb2]/60 flex items-center justify-center text-[#725b38]">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
              {totalAppointments}
            </span>
            <span className="text-[11px] font-sans text-[#4c4640] block mt-0.5">
              Sesiones en cabina
            </span>
            <p className="text-[10px] text-[#725b38] font-bold mt-1.5">
              Promedio: {Math.round(totalAppointments / displayData.length)} citas / mes
            </p>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Ticket Promedio
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#1c1b1a]">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
              ${avgTicket.toFixed(2)}
            </span>
            <span className="text-[11px] font-sans text-[#4c4640] block mt-0.5">
              MXN por clienta atendida
            </span>
            <p className="text-[10px] text-green-700 font-bold mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              +$4.95 gracias a Nail Art 3D
            </p>
          </div>
        </div>

        {/* Best Performance Month */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Mes Récord Histórico
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-[18px]">star</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#725b38]">
              {bestMonth.mes}
            </span>
            <span className="text-[11px] font-sans text-[#1c1b1a] font-bold block mt-0.5">
              ${bestMonth.ganancias.toLocaleString()} MXN ({bestMonth.citas} citas)
            </span>
            <p className="text-[10px] text-[#4c4640] mt-1.5">
              {bestMonth.mesCompleto}
            </p>
          </div>
        </div>
      </section>

      {/* Primary Recharts Visualization Card */}
      <section className="bg-white p-5 sm:p-6 rounded-3xl border border-[#cec5bd]/40 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f2edea]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest">
                Evolución Temporal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f8f3f0] text-[#4c4640] text-[9px] font-bold uppercase">
                {timeRange === '6m' ? 'Semestre 2' : 'Ene - Dic 2024'}
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1c1b1a] mt-0.5">
              Ganancias Mensuales ($ MXN) vs. Volumen de Citas
            </h2>
          </div>

          {/* Chart Legend Badges */}
          <div className="flex items-center gap-3 text-xs">
            {(activeMetric === 'both' || activeMetric === 'revenue') && (
              <span className="flex items-center gap-1.5 font-semibold text-[#1c1b1a]">
                <span className="w-3 h-3 rounded-md bg-[#725b38] inline-block shadow-xs"></span>
                <span>Ganancias ($ MXN)</span>
              </span>
            )}
            {(activeMetric === 'both' || activeMetric === 'volume') && (
              <span className="flex items-center gap-1.5 font-semibold text-[#1c1b1a]">
                <span className="w-3 h-3 rounded-full border-2 border-[#1e1b18] bg-[#fedeb2] inline-block"></span>
                <span>Volumen Citas</span>
              </span>
            )}
          </div>
        </div>

        {/* Recharts Composed Chart (Bar + Line) */}
        <div className="w-full h-80 sm:h-96 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={displayData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="barGoldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#725b38" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#b8996f" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fedeb2" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#fedeb2" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e6e2df" vertical={false} />

              <XAxis
                dataKey="mes"
                stroke="#7d766f"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cec5bd' }}
              />

              {/* Left Y Axis for Revenue ($ MXN) */}
              <YAxis
                yAxisId="left"
                stroke="#725b38"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={[0, 6500]}
              />

              {/* Right Y Axis for Appointments Count */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#1e1b18"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 140]}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Bar for Monthly Revenue */}
              {(activeMetric === 'both' || activeMetric === 'revenue') && (
                <Bar
                  yAxisId="left"
                  dataKey="ganancias"
                  name="Ganancias"
                  fill="url(#barGoldGradient)"
                  radius={[8, 8, 0, 0]}
                  barSize={timeRange === '6m' ? 36 : 22}
                  animationDuration={900}
                />
              )}

              {/* Line & Glow Area for Appointments Volume */}
              {(activeMetric === 'both' || activeMetric === 'volume') && (
                <>
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="citas"
                    fill="url(#areaGlow)"
                    stroke="none"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="citas"
                    name="Volumen de Citas"
                    stroke="#1e1b18"
                    strokeWidth={3}
                    dot={{ fill: '#fedeb2', stroke: '#1e1b18', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#725b38', stroke: '#ffffff', strokeWidth: 2 }}
                    animationDuration={1100}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Sub-caption */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#4c4640] pt-2 border-t border-[#f2edea] gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">insights</span>
            <span>Tendencia sostenida: +8.5% mensual en reservas de manicura rusa y acrílico de autor.</span>
          </div>
          <span className="text-[11px] text-[#7d766f]">Actualizado en tiempo real con las citas del calendario</span>
        </div>
      </section>

      {/* Secondary Analytics Row: Technique Breakdown & Specialist Revenue */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Technique Revenue Breakdown Bar Chart */}
        <div className="bg-white p-5 rounded-3xl border border-[#cec5bd]/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
                Mix de Servicios
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1c1b1a]">
                Ingresos por Técnica Principal
              </h3>
            </div>
            <span className="text-xs text-[#725b38] font-bold">Mes en Curso</span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={techniqueData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2df" horizontal={false} />
                <XAxis type="number" stroke="#7d766f" fontSize={10} tickFormatter={(val) => `$${val}`} />
                <YAxis
                  dataKey="tecnica"
                  type="category"
                  stroke="#1c1b1a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={95}
                />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `$${value} MXN (${item.payload.citas} citas - ${item.payload.porcentaje}%)`,
                    'Ingresos',
                  ]}
                  contentStyle={{
                    backgroundColor: '#1e1b18',
                    color: '#fff',
                    borderRadius: '12px',
                    border: '1px solid rgba(254, 222, 178, 0.4)',
                    fontSize: '11px',
                  }}
                />
                <Bar
                  dataKey="ingresos"
                  fill="#725b38"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-[#f2edea] text-xs">
            <div className="flex items-center justify-between text-[#4c4640]">
              <span>Técnica más rentable:</span>
              <strong className="text-[#1c1b1a]">Acrílico Esculpido ($1,980 MXN • 38%)</strong>
            </div>
          </div>
        </div>

        {/* Team Productivity & Specialist Breakdown */}
        <div className="bg-white p-5 rounded-3xl border border-[#cec5bd]/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
                Productividad de Cabina
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1c1b1a]">
                Facturación por Especialista
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[10px] font-bold">
              3 Activas
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Valeria M */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#cec5bd]/40">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCtk1PLhz_DgiDImJBjAghivC1Hkxg0SWPrcPpr28yMLUWiT3o82aNakoxq4iHDvuVI5dkxnwoEqvmDmV_YQU2AbSa-x5JqFy5I4JyfHBZJTh5wehjsRgaD4429kzbdtdvYq-XoVTuw-gJUjhbt-er8TprH48gzxybSO2PHV57Rb_eS4BAu9LupcwEIxDrvai_TIHhUmkfZlTG3sDw1SRPbYtrE8NBBx2dmTHwLXubJ1EY-zBwxA"
                      alt="Valeria M."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-[#1c1b1a] block">Valeria M. (Senior Master)</span>
                    <span className="text-[10px] text-[#4c4640]">Mesa 01 • Acrílico & Rusa</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#725b38] block">$2,340.00 MXN</span>
                  <span className="text-[10px] text-[#4c4640]">48 Citas (48% del total)</span>
                </div>
              </div>
              <div className="w-full bg-[#f2edea] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1e1b18] h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Camila R */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#cec5bd]/40">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAns1edMFgCkOV1Xv5HdjyyrZj9jlIrksfnluATWcj6MN_x4U6sjqQsuDqYntCOC-QChSSYb2M7oaar-CkzJrOXiXRwlbefZS9CyTajPLP6c6ZN488TeE-yuisBOYDEOXQ90vihU3kZfamfl8bNYetScWr9fxQlNhTEw25FSfjnCGWYFBC65HTey3JKAMx3BhbA-fUHlaLcV22d1yiAScFkPGmf6_c-BIy_GexsP2OYr7JlWSi5Dw"
                      alt="Camila R."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-[#1c1b1a] block">Camila R. (Nail Artist)</span>
                    <span className="text-[10px] text-[#4c4640]">Mesa 03 • Nail Art 3D</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#725b38] block">$1,620.00 MXN</span>
                  <span className="text-[10px] text-[#4c4640]">36 Citas (33% del total)</span>
                </div>
              </div>
              <div className="w-full bg-[#f2edea] h-2 rounded-full overflow-hidden">
                <div className="bg-[#725b38] h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Sofía L */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#cec5bd]/40">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkfiLIvIqRfOYokHU6lqoT-Lofmpg3bvelWvQX7dfzaMv-GWje3dJ2kv_scaMMCjdLV0dF84hJIekyLQN7blHomEfgCI7glXZInnkrYfYGpEwh_yY2OVxae99IDJk7XyYgaqRfe6SOJdJW0sahJBiFtIc-ojLfpKQKxgv2SHe8TC9Szr9bZJoe_X92GyimAwndUx2UgMH4v6cOtxZTU2AQ9Ef0IINl92y939q6ObFpQdq5_UUUpQ"
                      alt="Sofía L."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-[#1c1b1a] block">Sofía L. (Master Spa)</span>
                    <span className="text-[10px] text-[#4c4640]">Mesa 02 • Pedicura & Bienestar</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#725b38] block">$890.00 MXN</span>
                  <span className="text-[10px] text-[#4c4640]">22 Citas (19% del total)</span>
                </div>
              </div>
              <div className="w-full bg-[#f2edea] h-2 rounded-full overflow-hidden">
                <div className="bg-[#fedeb2] h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
