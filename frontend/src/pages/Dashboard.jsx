import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Sparkles,
  Wallet,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  BarChart2,
  Globe,
  Plus,
  Trash2,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// ─── API imports ──────────────────────────────────────────────────────────────
// Uncomment and use these once your backend is ready:
// import {
//   fetchOverviewStats, fetchChartData, fetchAIInsights,
//   fetchPortfolio, fetchWatchlist, addToWatchlist, removeFromWatchlist,
//   fetchMarketsOverview, fetchMarketNews,
// } from "./api";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_CHART = {
  "1W": [
    { label: "Mon", actual: 51200, forecast: null },
    { label: "Tue", actual: 51800, forecast: null },
    { label: "Wed", actual: 52100, forecast: null },
    { label: "Thu", actual: 51600, forecast: null },
    { label: "Fri", actual: 52480, forecast: 52480 },
    { label: "Sat", actual: null, forecast: 52900 },
    { label: "Sun", actual: null, forecast: 53200 },
  ],
  "1M": [
    { label: "Jan", actual: 41200, forecast: null },
    { label: "Feb", actual: 43850, forecast: null },
    { label: "Mar", actual: 42600, forecast: null },
    { label: "Apr", actual: 46900, forecast: null },
    { label: "May", actual: 49300, forecast: null },
    { label: "Jun", actual: 52480, forecast: 52480 },
    { label: "Jul", actual: null, forecast: 54920 },
    { label: "Aug", actual: null, forecast: 57680 },
    { label: "Sep", actual: null, forecast: 60150 },
  ],
  "3M": [
    { label: "Apr", actual: 46900, forecast: null },
    { label: "May", actual: 49300, forecast: null },
    { label: "Jun", actual: 52480, forecast: 52480 },
    { label: "Jul", actual: null, forecast: 54920 },
    { label: "Aug", actual: null, forecast: 57680 },
    { label: "Sep", actual: null, forecast: 60150 },
    { label: "Oct", actual: null, forecast: 63000 },
  ],
  "1Y": [
    { label: "Jul'24", actual: 38000, forecast: null },
    { label: "Sep'24", actual: 41000, forecast: null },
    { label: "Nov'24", actual: 40200, forecast: null },
    { label: "Jan'25", actual: 44500, forecast: null },
    { label: "Mar'25", actual: 46900, forecast: null },
    { label: "Jun'25", actual: 52480, forecast: 52480 },
    { label: "Sep'25", actual: null, forecast: 60150 },
    { label: "Dec'25", actual: null, forecast: 67000 },
  ],
};

const MOCK_INSIGHTS = [
  { symbol: "NVDA", signal: "Buy", confidence: 91, note: "Strong upward momentum projected over the next 30 days." },
  { symbol: "TSLA", signal: "Hold", confidence: 68, note: "Mixed signals; volatility expected ahead of earnings." },
  { symbol: "AMZN", signal: "Sell", confidence: 74, note: "Bearish trend detected across short-term indicators." },
];

const MOCK_WATCHLIST = [
  { symbol: "AAPL", name: "Apple Inc.", price: 198.32, change: 1.24, signal: "Buy", confidence: 88 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 242.15, change: -2.18, signal: "Hold", confidence: 68 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 891.45, change: 3.67, signal: "Buy", confidence: 91 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 421.78, change: 0.45, signal: "Hold", confidence: 72 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.92, change: -0.87, signal: "Sell", confidence: 74 },
];

const MOCK_PORTFOLIO = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", quantity: 10, avgCost: 175.0, currentPrice: 198.32, signal: "Buy", confidence: 88 },
  { id: 2, symbol: "NVDA", name: "NVIDIA Corp.", quantity: 3, avgCost: 650.0, currentPrice: 891.45, signal: "Buy", confidence: 91 },
  { id: 3, symbol: "TSLA", name: "Tesla Inc.", quantity: 5, avgCost: 260.0, currentPrice: 242.15, signal: "Hold", confidence: 68 },
  { id: 4, symbol: "MSFT", name: "Microsoft Corp.", quantity: 8, avgCost: 390.0, currentPrice: 421.78, signal: "Hold", confidence: 72 },
  { id: 5, symbol: "AMZN", name: "Amazon.com Inc.", quantity: 12, avgCost: 185.0, currentPrice: 178.92, signal: "Sell", confidence: 74 },
];

const MOCK_MARKETS = {
  indices: [
    { name: "S&P 500", value: "5,432.10", change: "+0.82%" },
    { name: "NASDAQ", value: "17,891.40", change: "+1.14%" },
    { name: "DOW", value: "39,243.60", change: "+0.41%" },
    { name: "VIX", value: "13.42", change: "-4.20%" },
  ],
  topGainers: [
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 891.45, changePercent: 3.67 },
    { symbol: "META", name: "Meta Platforms", price: 512.30, changePercent: 2.91 },
    { symbol: "AAPL", name: "Apple Inc.", price: 198.32, changePercent: 1.24 },
  ],
  topLosers: [
    { symbol: "TSLA", name: "Tesla Inc.", price: 242.15, changePercent: -2.18 },
    { symbol: "AMZN", name: "Amazon.com", price: 178.92, changePercent: -0.87 },
    { symbol: "NFLX", name: "Netflix Inc.", price: 631.50, changePercent: -0.63 },
  ],
  sectorPerformance: [
    { sector: "Tech", changePercent: 1.8 },
    { sector: "Health", changePercent: 0.6 },
    { sector: "Finance", changePercent: 0.3 },
    { sector: "Energy", changePercent: -0.5 },
    { sector: "Consumer", changePercent: -0.9 },
    { sector: "Utilities", changePercent: -1.2 },
  ],
};

const MOCK_NEWS = [
  { id: 1, headline: "Fed signals potential rate cut as inflation cools to 2.4%", source: "Reuters", publishedAt: "2h ago", sentiment: "positive" },
  { id: 2, headline: "NVIDIA surpasses $2T market cap on AI chip demand surge", source: "Bloomberg", publishedAt: "3h ago", sentiment: "positive" },
  { id: 3, headline: "Tesla misses Q2 delivery estimates; shares fall in after-hours", source: "WSJ", publishedAt: "5h ago", sentiment: "negative" },
  { id: 4, headline: "Amazon Web Services records 21% YoY revenue growth in latest quarter", source: "CNBC", publishedAt: "6h ago", sentiment: "positive" },
  { id: 5, headline: "Oil prices remain flat amid OPEC supply uncertainty", source: "FT", publishedAt: "8h ago", sentiment: "neutral" },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const SIGNAL_STYLES = {
  Buy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  Hold: "bg-yellow-400/10 text-yellow-400 border-yellow-400/25",
  Sell: "bg-red-500/10 text-red-400 border-red-500/25",
};

const SENTIMENT_STYLES = {
  positive: "text-emerald-400",
  neutral: "text-slate-400",
  negative: "text-red-400",
};

const RANGES = ["1W", "1M", "3M", "1Y"];

const NAV_TABS = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "portfolio", label: "Portfolio", icon: Wallet },
  { id: "watchlist", label: "Watchlist", icon: BarChart2 },
  { id: "markets", label: "Markets", icon: Globe },
];

const getInitials = (name = "") =>
  name.trim().split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const pnl = (pos) => (pos.currentPrice - pos.avgCost) * pos.quantity;
const pnlPct = (pos) => ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100;

// ─── Shared sub-components ────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, trend, sub }) {
  const trendColor =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400";
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null;

  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-indigo-400">
          <Icon size={16} />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-[12px] font-medium ${trendColor}`}>
            {TrendIcon && <TrendIcon size={12} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white leading-none">{value}</p>
      <p className="text-slate-500 text-[12px] mt-1.5">{label}</p>
      {sub && <p className="text-slate-600 text-[11px] mt-0.5">{sub}</p>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const value = payload.find((p) => p.value != null)?.value;
  return (
    <div className="bg-[#111113] border border-white/[0.08] rounded-lg px-3 py-2 shadow-2xl">
      <p className="text-slate-500 text-[11px] mb-0.5">{label}</p>
      <p className="text-white text-[13px] font-semibold">${value?.toLocaleString()}</p>
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-white font-bold text-[18px]">{title}</h2>
        {sub && <p className="text-slate-500 text-[13px] mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ firstName }) {
  const [range, setRange] = useState("1M");
  const [chartData, setChartData] = useState(MOCK_CHART["1M"]);
  const [insights, setInsights] = useState(MOCK_INSIGHTS);
  const [watchlist, setWatchlist] = useState(MOCK_WATCHLIST);
  const [loading, setLoading] = useState(false);

  // ── Fetch chart data on range change ──────────────────────────────────────
  // TODO: replace mock with real API call
  // const loadChart = useCallback(async (r) => {
  //   setLoading(true);
  //   const { data, error } = await fetchChartData(r);
  //   if (data) setChartData(data);
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    // loadChart(range); // ← uncomment when backend ready
    setChartData(MOCK_CHART[range]);
  }, [range]);

  // ── Fetch insights once ────────────────────────────────────────────────────
  // TODO: replace mock with real API call
  // useEffect(() => {
  //   fetchAIInsights().then(({ data }) => { if (data) setInsights(data); });
  //   fetchWatchlist().then(({ data }) => { if (data) setWatchlist(data); });
  // }, []);

  return (
    <div>
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your portfolio today.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-[12px] font-medium">Market open</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Portfolio value" value="$52,480.32" change="+4.7%" trend="up" sub="vs last month" />
        <StatCard icon={Activity} label="Today's P&L" value="+$1,284.50" change="+2.1%" trend="up" sub="since market open" />
        <StatCard icon={Sparkles} label="AI prediction accuracy" value="87.4%" change="+1.2%" trend="up" sub="last 30 days" />
        <StatCard icon={Wallet} label="Active positions" value="12" change="3 alerts" trend="neutral" sub="needs review" />
      </div>

      {/* Chart + AI insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Performance chart */}
        <div className="lg:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h2 className="text-white font-semibold text-[15px]">Portfolio performance</h2>
              <p className="text-slate-500 text-[12px] mt-0.5">Actual value with AI-projected trend</p>
            </div>
            <div className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 flex-shrink-0">
              <Sparkles size={11} className="text-violet-400" />
              <span className="text-violet-400 text-[11px] font-medium">87% confidence</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-4 mb-2">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  range === r ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="actual" stroke="#818cf8" strokeWidth={2} fill="url(#actualFill)" />
                <Line type="monotone" dataKey="forecast" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded-full bg-indigo-400 inline-block" /> Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded-full bg-violet-400 inline-block" /> AI forecast
            </span>
          </div>
        </div>

        {/* AI insights */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
          <h2 className="text-white font-semibold text-[15px] mb-1">AI insights</h2>
          <p className="text-slate-500 text-[12px] mb-4">Signals generated from your watchlist</p>
          <div className="space-y-3">
            {insights.map((item) => (
              <div key={item.symbol} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[11px] font-bold text-slate-300 flex-shrink-0">
                  {item.symbol}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${SIGNAL_STYLES[item.signal]}`}>
                      {item.signal}
                    </span>
                    <span className="text-slate-500 text-[11px]">{item.confidence}% confidence</span>
                  </div>
                  <p className="text-slate-400 text-[12px] mt-1.5 leading-relaxed">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Watchlist preview */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-[15px]">Watchlist</h2>
            <p className="text-slate-500 text-[12px] mt-0.5">Stocks you're tracking</p>
          </div>
        </div>
        <WatchlistTable rows={watchlist} />
      </div>
    </div>
  );
}

// ─── Shared Watchlist table ───────────────────────────────────────────────────
function WatchlistTable({ rows, onRemove }) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-left min-w-[560px]">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.6px] text-slate-500">
            <th className="px-2 pb-3 font-semibold">Stock</th>
            <th className="px-2 pb-3 font-semibold">Price</th>
            <th className="px-2 pb-3 font-semibold">24h change</th>
            <th className="px-2 pb-3 font-semibold">AI signal</th>
            <th className={`px-2 pb-3 font-semibold ${onRemove ? "" : "text-right"}`}>Confidence</th>
            {onRemove && <th className="px-2 pb-3 font-semibold text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.symbol} className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors">
              <td className="px-2 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0">
                    {s.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-white text-[13px] font-medium leading-none">{s.symbol}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{s.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-2 py-3 text-slate-200 text-[13px] font-medium">${s.price.toFixed(2)}</td>
              <td className="px-2 py-3">
                <span className={`flex items-center gap-1 text-[13px] font-medium ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {s.change >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(s.change).toFixed(2)}%
                </span>
              </td>
              <td className="px-2 py-3">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${SIGNAL_STYLES[s.signal]}`}>
                  {s.signal}
                </span>
              </td>
              <td className={`px-2 py-3 text-slate-400 text-[13px] ${onRemove ? "" : "text-right"}`}>{s.confidence}%</td>
              {onRemove && (
                <td className="px-2 py-3 text-right">
                  <button
                    onClick={() => onRemove(s.symbol)}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab: Portfolio ───────────────────────────────────────────────────────────
function PortfolioTab() {
  const [positions, setPositions] = useState(MOCK_PORTFOLIO);

  // TODO: fetch real portfolio
  // useEffect(() => {
  //   fetchPortfolio().then(({ data }) => { if (data) setPositions(data.positions); });
  // }, []);

  const totalValue = positions.reduce((s, p) => s + p.currentPrice * p.quantity, 0);
  const totalCost = positions.reduce((s, p) => s + p.avgCost * p.quantity, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = (totalPnL / totalCost) * 100;

  return (
    <div>
      <SectionHeader
        title="Portfolio"
        sub="Your current holdings and unrealized P&L"
        action={
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[13px] font-medium hover:bg-indigo-500/20 transition-colors">
            <Plus size={13} /> Add position
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Total market value" value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard
          icon={Activity}
          label="Unrealized P&L"
          value={`${totalPnL >= 0 ? "+" : ""}$${Math.abs(totalPnL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={`${totalPnLPct >= 0 ? "+" : ""}${totalPnLPct.toFixed(2)}%`}
          trend={totalPnL >= 0 ? "up" : "down"}
        />
        <StatCard icon={Wallet} label="Positions" value={String(positions.length)} sub="across your portfolio" />
      </div>

      {/* Positions table */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-xl overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.6px] text-slate-500">
              <th className="px-2 pb-3 font-semibold">Stock</th>
              <th className="px-2 pb-3 font-semibold">Qty</th>
              <th className="px-2 pb-3 font-semibold">Avg cost</th>
              <th className="px-2 pb-3 font-semibold">Current</th>
              <th className="px-2 pb-3 font-semibold">Market value</th>
              <th className="px-2 pb-3 font-semibold">P&L</th>
              <th className="px-2 pb-3 font-semibold">AI signal</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => {
              const gain = pnl(p);
              const gainPct = pnlPct(p);
              return (
                <tr key={p.id} className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0">
                        {p.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-white text-[13px] font-medium">{p.symbol}</p>
                        <p className="text-slate-500 text-[11px]">{p.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-slate-300 text-[13px]">{p.quantity}</td>
                  <td className="px-2 py-3 text-slate-300 text-[13px]">${p.avgCost.toFixed(2)}</td>
                  <td className="px-2 py-3 text-slate-200 text-[13px] font-medium">${p.currentPrice.toFixed(2)}</td>
                  <td className="px-2 py-3 text-slate-200 text-[13px]">
                    ${(p.currentPrice * p.quantity).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-2 py-3">
                    <span className={`flex items-center gap-1 text-[13px] font-medium ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {gain >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {Math.abs(gainPct).toFixed(2)}%
                    </span>
                    <span className={`text-[11px] ${gain >= 0 ? "text-emerald-500/70" : "text-red-500/70"}`}>
                      {gain >= 0 ? "+" : "-"}${Math.abs(gain).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${SIGNAL_STYLES[p.signal]}`}>
                      {p.signal}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Watchlist ───────────────────────────────────────────────────────────
function WatchlistTab() {
  const [watchlist, setWatchlist] = useState(MOCK_WATCHLIST);
  const [newSymbol, setNewSymbol] = useState("");
  const [adding, setAdding] = useState(false);

  // TODO: fetch real watchlist
  // useEffect(() => {
  //   fetchWatchlist().then(({ data }) => { if (data) setWatchlist(data); });
  // }, []);

  const handleAdd = async () => {
    if (!newSymbol.trim()) return;
    setAdding(true);
    // TODO: real call → const { data } = await addToWatchlist(newSymbol.toUpperCase());
    // if (data) setWatchlist((prev) => [...prev, data.item]);
    setAdding(false);
    setNewSymbol("");
  };

  const handleRemove = async (symbol) => {
    // TODO: real call → await removeFromWatchlist(symbol);
    setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
  };

  return (
    <div>
      <SectionHeader
        title="Watchlist"
        sub="Stocks you're tracking with AI signals"
        action={
          <div className="flex items-center gap-2">
            <input
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add symbol…"
              maxLength={6}
              className="w-32 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
            <button
              onClick={handleAdd}
              disabled={adding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[13px] font-medium hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
            >
              <Plus size={13} /> Add
            </button>
          </div>
        }
      />

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
        {watchlist.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No stocks in your watchlist yet. Add a symbol above.</p>
        ) : (
          <WatchlistTable rows={watchlist} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
}

// ─── Tab: Markets ─────────────────────────────────────────────────────────────
function MarketsTab() {
  const [markets] = useState(MOCK_MARKETS);
  const [news] = useState(MOCK_NEWS);

  // TODO: fetch real markets
  // useEffect(() => {
  //   fetchMarketsOverview().then(({ data }) => { if (data) setMarkets(data); });
  //   fetchMarketNews(5).then(({ data }) => { if (data) setNews(data); });
  // }, []);

  const barTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const v = payload[0].value;
    return (
      <div className="bg-[#111113] border border-white/[0.08] rounded-lg px-3 py-2 shadow-2xl">
        <p className="text-slate-400 text-[11px]">{label}</p>
        <p className={`text-[13px] font-semibold ${v >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {v >= 0 ? "+" : ""}{v}%
        </p>
      </div>
    );
  };

  return (
    <div>
      <SectionHeader title="Markets" sub="Live market overview and top movers" />

      {/* Index pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {markets.indices.map((idx) => {
          const up = idx.change.startsWith("+");
          return (
            <div key={idx.name} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-xl">
              <p className="text-slate-500 text-[11px] font-medium mb-1">{idx.name}</p>
              <p className="text-white font-bold text-[18px] leading-none">{idx.value}</p>
              <span className={`text-[12px] font-medium mt-1 inline-block ${up ? "text-emerald-400" : "text-red-400"}`}>
                {idx.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sector chart + movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Sector performance */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
          <h3 className="text-white font-semibold text-[15px] mb-1">Sector performance</h3>
          <p className="text-slate-500 text-[12px] mb-4">Today's change by sector</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={markets.sectorPerformance} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="sector" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={barTooltip} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="changePercent" radius={4} fill="#818cf8"
                  label={false}
                  // color by value: positive = emerald, negative = red
                  // recharts doesn't support per-bar fill easily, so we use a custom cell approach
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top movers */}
        <div className="space-y-4">
          {/* Gainers */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-emerald-400" />
              <h3 className="text-white font-semibold text-[14px]">Top gainers</h3>
            </div>
            <div className="space-y-2">
              {markets.topGainers.map((s) => (
                <div key={s.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[9px] font-bold text-slate-300">
                      {s.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white text-[12px] font-medium">{s.symbol}</p>
                      <p className="text-slate-600 text-[10px]">{s.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 text-[12px]">${s.price.toFixed(2)}</p>
                    <p className="text-emerald-400 text-[11px] font-medium">+{s.changePercent.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={14} className="text-red-400" />
              <h3 className="text-white font-semibold text-[14px]">Top losers</h3>
            </div>
            <div className="space-y-2">
              {markets.topLosers.map((s) => (
                <div key={s.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[9px] font-bold text-slate-300">
                      {s.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white text-[12px] font-medium">{s.symbol}</p>
                      <p className="text-slate-600 text-[10px]">{s.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 text-[12px]">${s.price.toFixed(2)}</p>
                    <p className="text-red-400 text-[11px] font-medium">{s.changePercent.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market news */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
        <h3 className="text-white font-semibold text-[15px] mb-4">Market news</h3>
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-white/[0.05] last:border-0 last:pb-0">
              <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                item.sentiment === "positive" ? "bg-emerald-400" :
                item.sentiment === "negative" ? "bg-red-400" : "bg-slate-500"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-[13px] leading-snug">{item.headline}</p>
                <p className="text-slate-600 text-[11px] mt-1">{item.source} · {item.publishedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("so_token") || sessionStorage.getItem("so_token");
    if (!token) { navigate("/login"); return; }
    try { setUser(JSON.parse(atob(token))); }
    catch { navigate("/login"); }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("so_token");
    sessionStorage.removeItem("so_token");
    navigate("/login");
  };

  if (!user) return null;
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <TrendingUp size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-[14px] leading-none">StockOracle</p>
              <p className="text-indigo-400 text-[9px] font-semibold tracking-[1.5px] uppercase mt-0.5">AI Forecasting</p>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
            {NAV_TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  activeTab === id
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:border-white/[0.15] transition-colors">
              <Search size={15} />
            </button>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:border-white/[0.15] transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border border-white/[0.08] flex items-center justify-center text-[11px] font-semibold text-indigo-300">
                  {getInitials(user.name)}
                </div>
                <span className="hidden sm:block text-[13px] text-slate-300 font-medium max-w-[110px] truncate">{user.name}</span>
                <ChevronDown size={13} className="text-slate-500" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-40">
                    <div className="px-3.5 py-3 border-b border-white/[0.06]">
                      <p className="text-[13px] text-white font-medium truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {NAV_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ${
                activeTab === id
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {activeTab === "overview"  && <OverviewTab firstName={firstName} />}
        {activeTab === "portfolio" && <PortfolioTab />}
        {activeTab === "watchlist" && <WatchlistTab />}
        {activeTab === "markets"   && <MarketsTab />}

        <p className="text-center text-slate-700 text-xs mt-8 pb-2">
          Protected by 256-bit encryption · StockOracle © {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}