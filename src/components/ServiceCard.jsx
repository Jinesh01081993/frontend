import StatusBadge from './StatusBadge';

export default function ServiceCard({ service }) {
  const nestedDatabase = service.details?.database;
  const databaseLabel = nestedDatabase
    ? `DB: ${nestedDatabase.status} ${nestedDatabase.latencyMs ? `(${nestedDatabase.latencyMs} ms)` : ''}`
    : null;

  return (
    <div className="serviceBox">
      <div className="serviceName">{service.name}</div>
      <div className="serviceType">{service.type || 'service'}</div>

      <StatusBadge status={service.status} />

      <small>
        {service.latencyMs !== undefined ? `${service.latencyMs} ms` : service.error || 'local'}
      </small>

      {service.url && <small>{service.url}</small>}
      {databaseLabel && <small>{databaseLabel}</small>}
      {service.error && <small className="errorText">Error: {service.error}</small>}
    </div>
  );
}
