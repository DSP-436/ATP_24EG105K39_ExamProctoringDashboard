import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
const STACK_COLORS = { passed: '#22c55e', failed: '#ef4444' };
const SEVERITY_COLORS = { low: '#6b7280', medium: '#f59e0b', high: '#ef4444' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function BarChartComponent({ data, xKey, bars, title }) {
  if (!data?.length) return <EmptyCard title={title} />;
  return (
    <div className="card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          {(bars || [{ key: 'value', color: '#3b82f6', name: 'Value' }]).map((b) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.name || b.key}
              fill={b.color || '#3b82f6'}
              radius={[4, 4, 0, 0]}
              maxBarSize={b.maxBarSize || 50}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChartComponent({ data, xKey, lines, title }) {
  if (!data?.length) return <EmptyCard title={title} />;
  return (
    <div className="card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          {(lines || [{ key: 'value', color: '#3b82f6', name: 'Value' }]).map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name || l.key}
              stroke={l.color || '#3b82f6'}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaChartComponent({ data, xKey, areas, title }) {
  if (!data?.length) return <EmptyCard title={title} />;
  return (
    <div className="card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          {(areas || [{ key: 'value', color: '#3b82f6', name: 'Value' }]).map((a) => (
            <Area
              key={a.key}
              type="monotone"
              dataKey={a.key}
              name={a.name || a.key}
              stroke={a.color || '#3b82f6'}
              fill={a.color || '#3b82f6'}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartComponent({ data, title, dataKey = 'count', nameKey = '_id' }) {
  if (!data?.length) return <EmptyCard title={title} />;
  const total = data.reduce((s, d) => s + (d[dataKey] || 0), 0);
  return (
    <div className="card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={45}
            label={({ name, value }) => `${name} (${((value / total) * 100).toFixed(0)}%)`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, 'Count']}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StackedBarChart({ data, xKey, bars, title }) {
  if (!data?.length) return <EmptyCard title={title} />;
  return (
    <div className="card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          {bars.map((b) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.name || b.key}
              fill={b.color || '#3b82f6'}
              stackId="stack"
              radius={b.radius || [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyCard({ title }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
        No data available
      </div>
    </div>
  );
}
