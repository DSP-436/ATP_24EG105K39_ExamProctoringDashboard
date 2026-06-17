import { useEffect, useState, useMemo } from 'react';
import useAdminStore from '../../store/adminStore';
import StatsCard from '../analytics/StatsCard';
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  StackedBarChart,
} from '../analytics/Chart';
import {
  FiUsers, FiBook, FiCheckCircle, FiAlertTriangle, FiActivity,
  FiBarChart2, FiTrendingUp, FiAward,
} from 'react-icons/fi';
import Loader from '../common/Loader';

export default function Analytics() {
  const {
    stats, analytics, rankings, violationTrends, passFailDistribution,
    fetchAllAnalytics, loading,
  } = useAdminStore();

  const [rankingSort, setRankingSort] = useState('avgPercentage');
  const [rankingOrder, setRankingOrder] = useState('desc');

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  const sortedRankings = useMemo(() => {
    if (!rankings?.length) return [];
    return [...rankings].sort((a, b) => {
      const mul = rankingOrder === 'desc' ? 1 : -1;
      return (a[rankingSort] - b[rankingSort]) * mul;
    });
  }, [rankings, rankingSort, rankingOrder]);

  const toggleSort = (key) => {
    if (rankingSort === key) {
      setRankingOrder(rankingOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setRankingSort(key);
      setRankingOrder('desc');
    }
  };

  if (loading && !stats) return <Loader />;
  if (!stats) return <Loader />;

  const examBars = (analytics?.examAnalytics || []).map((e) => ({
    title: e.title?.length > 12 ? e.title.substring(0, 12) + '…' : e.title,
    'Avg Score': e.avgScore,
    'Passed': e.passed,
    'Failed': e.failed,
  }));

  const pfBars = passFailDistribution?.length
    ? passFailDistribution.map((d) => ({
        title: d.title?.length > 12 ? d.title.substring(0, 12) + '…' : d.title,
        Passed: d.passed,
        Failed: d.failed,
      }))
    : [];

  const severityLines = (violationTrends || []).map((d) => ({
    date: d.date?.substring(5),
    High: d.high || 0,
    Medium: d.medium || 0,
    Low: d.low || 0,
  }));

  const dailyLines = (analytics?.dailySubmissions || []).map((d) => ({
    date: d._id?.substring(5),
    Submissions: d.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <button
          onClick={fetchAllAnalytics}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          icon={FiUsers}
          label="Total Students"
          value={stats.totalStudents}
          color="primary"
          subtitle="Registered"
        />
        <StatsCard
          icon={FiBook}
          label="Total Exams"
          value={stats.totalExams}
          color="purple"
          subtitle={`${stats.activeExams} active`}
        />
        <StatsCard
          icon={FiCheckCircle}
          label="Results Submitted"
          value={stats.totalResults}
          color="success"
          subtitle={`${stats.flaggedResults} flagged`}
        />
        <StatsCard
          icon={FiAlertTriangle}
          label="Suspicious Logs"
          value={stats.totalLogs}
          color="danger"
          subtitle="Total violations"
        />
        <StatsCard
          icon={FiActivity}
          label="Active Exams"
          value={stats.activeExams}
          color="indigo"
          subtitle="Currently running"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dailyLines.length > 0 && (
          <LineChartComponent
            data={dailyLines}
            xKey="date"
            lines={[{ key: 'Submissions', color: '#3b82f6', name: 'Submissions' }]}
            title="Daily Submissions (Last 30 Days)"
          />
        )}

        {severityLines.length > 0 && (
          <StackedBarChart
            data={severityLines}
            xKey="date"
            bars={[
              { key: 'High', color: '#ef4444', name: 'High', radius: [0, 0, 0, 0] },
              { key: 'Medium', color: '#f59e0b', name: 'Medium' },
              { key: 'Low', color: '#6b7280', name: 'Low' },
            ]}
            title="Violation Trends by Severity"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics?.examAnalytics?.length > 0 && (
          <BarChartComponent
            data={examBars}
            xKey="title"
            bars={[
              { key: 'Avg Score', color: '#3b82f6', name: 'Avg Score' },
            ]}
            title="Average Score by Exam"
          />
        )}

        {pfBars.length > 0 && (
          <StackedBarChart
            data={pfBars}
            xKey="title"
            bars={[
              { key: 'Passed', color: '#22c55e', name: 'Passed' },
              { key: 'Failed', color: '#ef4444', name: 'Failed' },
            ]}
            title="Pass / Fail Distribution by Exam"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics?.suspiciousActivities?.length > 0 && (
          <PieChartComponent
            data={analytics.suspiciousActivities}
            title="Suspicious Activity Distribution"
          />
        )}

        {analytics?.examAnalytics?.length > 0 && (
          <BarChartComponent
            data={examBars}
            xKey="title"
            bars={[
              { key: 'Passed', color: '#22c55e', name: 'Passed' },
              { key: 'Failed', color: '#ef4444', name: 'Failed' },
            ]}
            title="Passed vs Failed by Exam"
          />
        )}
      </div>

      {sortedRankings.length > 0 && (
        <div className="card overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <FiAward className="text-primary-600 text-lg" />
            <h3 className="font-semibold">Student Rankings</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-gray-500">#</th>
                <th className="pb-3 font-semibold text-gray-500">Student</th>
                <th
                  className="pb-3 font-semibold text-gray-500 cursor-pointer hover:text-primary-600"
                  onClick={() => toggleSort('examsTaken')}
                >
                  Exams {rankingSort === 'examsTaken' ? (rankingOrder === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th
                  className="pb-3 font-semibold text-gray-500 cursor-pointer hover:text-primary-600"
                  onClick={() => toggleSort('avgPercentage')}
                >
                  Avg % {rankingSort === 'avgPercentage' ? (rankingOrder === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th className="pb-3 font-semibold text-gray-500">Passed</th>
                <th className="pb-3 font-semibold text-gray-500">Failed</th>
                <th className="pb-3 font-semibold text-gray-500">Suspicious</th>
              </tr>
            </thead>
            <tbody>
              {sortedRankings.map((s, i) => (
                <tr key={s.studentId} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-gray-400 font-medium">{i + 1}</td>
                  <td className="py-3">
                    <p className="font-medium">{s.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </td>
                  <td className="py-3">{s.examsTaken}</td>
                  <td className="py-3">
                    <span className={`font-bold ${s.avgPercentage >= 60 ? 'text-success-600' : 'text-danger-600'}`}>
                      {s.avgPercentage}%
                    </span>
                  </td>
                  <td className="py-3 text-success-600">{s.passedCount}</td>
                  <td className="py-3 text-danger-600">{s.failedCount}</td>
                  <td className="py-3">
                    <span className={s.suspiciousCount > 0 ? 'text-warning-600 font-medium' : 'text-gray-400'}>
                      {s.suspiciousCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {analytics?.examAnalytics?.length > 0 && (
        <div className="card overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-primary-600 text-lg" />
            <h3 className="font-semibold">Exam Performance Details</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-gray-500">Exam</th>
                <th className="pb-3 font-semibold text-gray-500">Students</th>
                <th className="pb-3 font-semibold text-gray-500">Passed</th>
                <th className="pb-3 font-semibold text-gray-500">Failed</th>
                <th className="pb-3 font-semibold text-gray-500">Avg Score</th>
                <th className="pb-3 font-semibold text-gray-500">Flagged</th>
                <th className="pb-3 font-semibold text-gray-500">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.examAnalytics.map((e, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{e.title}</td>
                  <td className="py-3">{e.totalStudents}</td>
                  <td className="py-3 text-success-600">{e.passed}</td>
                  <td className="py-3 text-danger-600">{e.failed}</td>
                  <td className="py-3 font-bold">{e.avgScore}%</td>
                  <td className="py-3">
                    <span className={e.flagged > 0 ? 'text-warning-600' : 'text-gray-400'}>
                      {e.flagged}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                        <div
                          className="bg-success-500 h-2 rounded-full transition-all"
                          style={{ width: `${e.totalStudents > 0 ? (e.passed / e.totalStudents) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {e.totalStudents > 0 ? Math.round((e.passed / e.totalStudents) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
