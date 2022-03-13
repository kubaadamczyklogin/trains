export function Results(props) {
  const {
    leaveHome,
    leaveWork,
    startWork,
    aboutTrainToWork,
    afterEightHuers,
    workTime,
    overTime,
    aboutTrainHome,
    comingHome
  } = props;
  return (
    <table className="Results">
      <tbody>
        <tr>
          <th>Wyjedż z domu o:</th>
          <td>{leaveHome}</td>
        </tr>
        <tr>
          <th>Pociąg do pracy:</th>
          <td>{aboutTrainToWork}</td>
        </tr>
        <tr>
          <th>Start pracy:</th>
          <td>{startWork}</td>
        </tr>
        <tr>
          <th>Przepracujesz 8h o:</th>
          <td>{afterEightHuers}</td>
        </tr>
        <tr>
          <th>Przepracujesz łącznie:</th>
          <td>{workTime}</td>
        </tr>
        <tr>
          <th>Nadgodziny:</th>
          <td>{overTime}</td>
        </tr>
        <tr>
          <th>Wyjedż z pracy o:</th>
          <td>{leaveWork}</td>
        </tr>
        <tr>
          <th>Pociąg powrotny:</th>
          <td>{aboutTrainHome}</td>
        </tr>
        <tr>
          <th>Będziesz w domu o:</th>
          <td>{comingHome}</td>
        </tr>
      </tbody>
    </table>
  );
}
