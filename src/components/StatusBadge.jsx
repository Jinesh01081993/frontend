export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${status === 'UP' ? 'up' : 'down'}`}>
      {status}
    </span>
  );
}
