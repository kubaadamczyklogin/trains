import "./TrainsTable.css";
import { addingMinutes } from "./../functions";

function TrainHome({
  train,
  byBikeToTrain,
  SelectTrainHome,
  selected,
  suggested
}) {
  const { fromWorkToTrain, fromTorMiaToHome, fromTorGloToHome } = byBikeToTrain;
  const work = addingMinutes(train.BydBie, -fromWorkToTrain);
  let aboutTrain = `odjazd o ${train.BydBie}, do `;
  let home;

  if (train.TorMia) {
    aboutTrain += "Toruń Miasto";
    home = addingMinutes(train.TorMia, fromTorMiaToHome);
  } else {
    aboutTrain += "Toruń Główny";
    home = addingMinutes(train.TorGlo, fromTorGloToHome);
  }

  function handleClick() {
    SelectTrainHome(work, train.BydBie, aboutTrain, home);
  }

  return (
    <tr
      className={`Train ${selected ? "selected" : ""} ${
        suggested ? "suggested" : ""
      }`}
      onClick={handleClick}
    >
      <td>
        <span>{work}</span>
      </td>
      <td>
        <span>{train.BydBie}</span>
      </td>
      <td>
        <span>{train.TorGlo}</span>
      </td>
      <td>
        <span>{train.TorMia} </span>
      </td>
      <td>
        <span>{home}</span>
      </td>
    </tr>
  );
}

export function TrainsHomeTable({
  trainsToTorun,
  byBikeToTrain,
  SelectTrainHome,
  selectedTrain,
  suggestedTrains
}) {
  return (
    <table className="TrainsTable">
      <thead>
        <tr>
          <th>
            Wyjedź
            <br /> z pracy
          </th>
          <th>
            Bydgoszcz
            <br /> Bielawy
          </th>
          <th>
            Toruń
            <br /> Główny
          </th>
          <th>
            Toruń
            <br /> Miasto
          </th>
          <th>
            Będziesz
            <br /> w Domu
          </th>
        </tr>
      </thead>
      <tbody>
        {trainsToTorun.map((train) => {
          return (
            <TrainHome
              key={train.BydBie}
              train={train}
              byBikeToTrain={byBikeToTrain}
              SelectTrainHome={SelectTrainHome}
              selected={selectedTrain === train.BydBie}
              suggested={suggestedTrains.includes(train.BydBie)}
            />
          );
        })}
      </tbody>
    </table>
  );
}
