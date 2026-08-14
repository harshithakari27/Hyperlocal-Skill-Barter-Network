function Spinner({ label = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      <span>{label}</span>
    </div>
  );
}

export default Spinner;