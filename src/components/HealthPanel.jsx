import ServiceCard from './ServiceCard';

export default function HealthPanel({ health, onRefresh, loading, gatewayDown }) {
  const services = health?.services || [];

  return (
    <section className="card">
      {gatewayDown && (
        <div className="gatewayDownBanner">
          ⚠️ Gateway is unreachable — services cannot be checked. Make sure the gateway is running on port 8080.
        </div>
      )}
      <div className="cardHeader">
        <div>
          <h2>Microservice Health Check</h2>
          <p>Click the button to check which services are up or down.</p>
        </div>

        <button onClick={onRefresh} disabled={loading}>
          {loading ? 'Checking...' : 'Check Health'}
        </button>
      </div>

      {health && (
        <div className={`overall ${health.overallStatus === 'UP' ? 'up' : 'down'}`}>
          <span style={{ fontSize: '8px' }}>●</span>
          {health.overallStatus === 'UP' ? 'All Systems Operational' : `Degraded — ${health.overallStatus}`}
        </div>
      )}

      <div className="grid">
        {services.map(service => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </section>
  );
}
