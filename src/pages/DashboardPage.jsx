import HealthPanel from '../components/HealthPanel';

export default function DashboardPage({ health, loading, onRefresh, gatewayDown }) {
  return (
    <HealthPanel
      health={health}
      loading={loading}
      onRefresh={onRefresh}
      gatewayDown={gatewayDown}
    />
  );
}
