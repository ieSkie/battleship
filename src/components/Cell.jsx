function Cell({ value, onClick, hideShips }) {
  const displayValue = hideShips && value === "ship" ? "empty" : value;

  return <div className={`cell ${displayValue}`} onClick={onClick} />;
}

export default Cell;
