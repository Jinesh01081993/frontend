export default function ServiceDown({ serviceName }) {
  return (
    <div className="downOverlay">
      <div>
        <h2>{serviceName} service is down</h2>
        <p>The form is hidden because this feature is temporarily unavailable.</p>
      </div>
    </div>
  );
}
