import "./TrainsTable.css";
import { addingMinutes } from "./../functions";

function TrainToWork({ train, byBikeToTrain, SelectTrainToWork, selected }) {
  const { FromHomeToTorMia, FromHomeToTorGlo, FromTrainToWork } = byBikeToTrain;
  let home;
  let aboutTrain;
  const work = addingMinutes(train.BydBie, FromTrainToWork);

  if (train.TorMia) {
    home = addingMinutes(train.TorMia, -FromHomeToTorMia);
    aboutTrain = `z Toruń Miasto, odjazd o: ${train.TorMia}`;
  } else {
    home = addingMinutes(train.TorGlo, -FromHomeToTorGlo);
    aboutTrain = `z Toruń Główny, odjazd o: ${train.TorGlo}`;
  }

  function handleClick() {
    SelectTrainToWork(home, train.TorGlo, aboutTrain, work);
  }

  return (
    <tr className={`Train ${selected ? "selected" : ""}`} onClick={handleClick}>
      <td>
        <span>{home}</span>
      </td>
      <td>
        <span>{train.TorMia}</span>
      </td>
      <td>
        <span>{train.TorGlo}</span>
      </td>
      <td>
        <span>{train.BydBie}</span>
      </td>
      <td>
        <span>{work}</span>
      </td>
    </tr>
  );
}

export function TrainsToWorkTable({
  trainsToBydgoszcz,
  byBikeToTrain,
  SelectTrainToWork,
  selectedTrain
}) {
  return (
    <table className="TrainsTable">
      <thead>
        <tr>
          <th>
            Wyjedź
            <br /> z domu
          </th>
          <th>
            Toruń
            <br /> Miasto
          </th>
          <th>
            Toruń
            <br /> Główny
          </th>
          <th>
            Bydgoszcz
            <br /> Bielawy
          </th>
          <th>
            Będziesz
            <br /> w pracy
          </th>
        </tr>
      </thead>
      <tbody>
        {trainsToBydgoszcz.map((train) => {
          return (
            <TrainToWork
              key={train.TorGlo}
              train={train}
              byBikeToTrain={byBikeToTrain}
              SelectTrainToWork={SelectTrainToWork}
              selected={selectedTrain === train.TorGlo}
            />
          );
        })}
      </tbody>
    </table>
  );
}
