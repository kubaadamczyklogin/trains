import "./CustomTime.css";
export function CustomTime({ timeToChange, timeType, TimeChange }) {
  function handleClick(modifier) {
    TimeChange(timeToChange, timeType, modifier);
  }

  return (
    <div className="CustomTime">
      <span onClick={() => handleClick(-5)} className="button">
        - 5
      </span>
      <span onClick={() => handleClick(-1)} className="button">
        -
      </span>
      <span className="button result">{timeToChange}</span>
      <span onClick={() => handleClick(1)} className="button">
        +
      </span>
      <span onClick={() => handleClick(5)} className="button">
        + 5
      </span>
    </div>
  );
}
