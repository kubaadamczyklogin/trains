import { useState } from "react";
import { addingMinutes, millisecondsToTime } from "./../functions";
import { TrainsToWorkTable } from "./TrainsToWorkTable";
import { TrainsHomeTable } from "./TrainsHomeTable";
import { CustomTime } from "./CustomTime";
import { Results } from "./Results";
import "./App.css";

const trainsToTorun = [
  {
    BydBie: "14:12",
    TorGlo: "14:42"
  },
  {
    BydBie: "14:42",
    TorGlo: "15:22"
  },
  {
    BydBie: "15:12",
    TorGlo: "15:42"
  },
  {
    BydBie: "15:32",
    TorGlo: "16:11",
    TorMia: "16:26"
  },
  {
    BydBie: "15:59",
    TorGlo: "16:33"
  },
  {
    BydBie: "16:42",
    TorGlo: "17:21"
  },
  {
    BydBie: "17:42",
    TorGlo: "18:21",
    TorMia: "18:28"
  },
  {
    BydBie: "18:15",
    TorGlo: "18:45"
  },
  {
    BydBie: "18:41",
    TorGlo: "19:20"
  },
  {
    BydBie: "19:42",
    TorGlo: "20:21",
    TorMia: "20:25"
  }
];

const trainsToBydgoszcz = [
  {
    TorGlo: "4:35",
    BydBie: "5:12"
  },
  {
    TorGlo: "5:06",
    BydBie: "5:36"
  },
  {
    TorMia: "5:28",
    TorGlo: "5:35",
    BydBie: "6:12"
  },
  {
    TorGlo: "6:15",
    BydBie: "6:44"
  },
  {
    TorMia: "6:28",
    TorGlo: "6:35",
    BydBie: "7:13"
  },
  {
    TorGlo: "7:05",
    BydBie: "7:33"
  },
  {
    TorGlo: "7:38",
    BydBie: "8:14"
  },
  {
    TorGlo: "8:15",
    BydBie: "8:44"
  },
  {
    TorGlo: "8:35",
    BydBie: "9:10"
  },
  {
    TorGlo: "9:35",
    BydBie: "10:11"
  }
];

const byBikeToTrain = {
  fromHomeToTorMia: 10,
  fromHomeToTorGlo: 20,
  fromTrainToWork: 25,
  fromWorkToTrain: 20,
  fromTorMiaToHome: 10,
  fromTorGloToHome: 20
};

export function App() {
  const [leaveHome, setLeaveHome] = useState("?");
  const [aboutTrainToWork, setAboutTrainToWork] = useState("?");
  const [selectedTrainToWork, setSelectedTrainToWork] = useState("?");
  const [afterEightHuers, setAfterEightHuers] = useState("?");
  const [suggestedTrains, setSuggestedTrains] = useState([]);
  const [startWork, setStartWork] = useState("?");
  const [workTime, setWorkTime] = useState("?");
  const [overTime, setOverTime] = useState("?");
  const [leaveWork, setLeaveWork] = useState("?");
  const [aboutTrainHome, setAboutTrainHome] = useState("?");
  const [selectedTrainHome, setSelectedTrainHome] = useState("?");
  const [comingHome, setComingHome] = useState("?");

  function findSugestedTrains(workFinishTime) {
    let suggestedEarly = ["?", -10000000];
    let suggestedLate = ["?", 10000000];
    let idealTrainTime = addingMinutes(
      workFinishTime,
      byBikeToTrain.fromWorkToTrain
    );
    idealTrainTime = idealTrainTime.split(":");

    let time = new Date();
    const idealTrainTimeRaw = time.setHours(
      idealTrainTime[0],
      idealTrainTime[1]
    );

    trainsToTorun.forEach((train) => {
      let trainTimeRaw = train.BydBie.split(":");
      time = new Date();
      trainTimeRaw = time.setHours(trainTimeRaw[0], trainTimeRaw[1]);
      const result = trainTimeRaw - idealTrainTimeRaw;

      if (result > 0) {
        if (suggestedLate[1] > result) suggestedLate = [train.BydBie, result];
      } else {
        if (suggestedEarly[1] < result) suggestedEarly = [train.BydBie, result];
      }
    });

    setSuggestedTrains([suggestedEarly[0], suggestedLate[0]]);
  }

  function howMuchHouers(startWork, endWork) {
    if (startWork !== "?" && endWork !== "?") {
      startWork = startWork.split(":");
      let time = new Date();
      const startWorkRaw = time.setHours(startWork[0], startWork[1]);
      endWork = endWork.split(":");
      time = new Date();
      const endWorkRaw = time.setHours(endWork[0], endWork[1]);
      const totalWorkTime = endWorkRaw - startWorkRaw;
      const overTime = totalWorkTime - 8 * 60 * 60 * 1000;
      setWorkTime(millisecondsToTime(totalWorkTime));
      setOverTime(millisecondsToTime(overTime));
    }
  }

  function handleSelectTrainToWork(home, TorGlo, aboutTrain, work) {
    const workPlusEight = addingMinutes(work, 8 * 60);

    setLeaveHome(home);
    setStartWork(work);
    setAboutTrainToWork(aboutTrain);
    setSelectedTrainToWork(TorGlo);
    setAfterEightHuers(workPlusEight);
    findSugestedTrains(workPlusEight);
    howMuchHouers(work, leaveWork);
  }

  function handleSelectTrainHome(work, BydBie, aboutTrain, home) {
    setLeaveWork(work);
    setSelectedTrainHome(BydBie);
    setAboutTrainHome(aboutTrain);
    setComingHome(home);
    howMuchHouers(startWork, work);
  }

  function handleTimeChange(timeToChange, timeType, modifier) {
    const timeAfterChange = addingMinutes(timeToChange, modifier);

    if (timeType === "startWork") {
      const workPlusEight = addingMinutes(timeAfterChange, 8 * 60);
      setStartWork(timeAfterChange);
      setAfterEightHuers(workPlusEight);
      findSugestedTrains(workPlusEight);
      howMuchHouers(timeAfterChange, leaveWork);
    } else if (timeType === "leaveWork") {
      setLeaveWork(timeAfterChange);
      howMuchHouers(startWork, timeAfterChange);
    }
  }

  return (
    <div className="App">
      <div className="TransportEditor">
        <TrainsToWorkTable
          trainsToBydgoszcz={trainsToBydgoszcz}
          byBikeToTrain={byBikeToTrain}
          SelectTrainToWork={handleSelectTrainToWork}
          selectedTrain={selectedTrainToWork}
        />
        <CustomTime
          timeToChange={startWork}
          timeType="startWork"
          TimeChange={handleTimeChange}
        />
        <CustomTime
          timeToChange={leaveWork}
          timeType="leaveWork"
          TimeChange={handleTimeChange}
        />
        <TrainsHomeTable
          trainsToTorun={trainsToTorun}
          byBikeToTrain={byBikeToTrain}
          SelectTrainHome={handleSelectTrainHome}
          selectedTrain={selectedTrainHome}
          suggestedTrains={suggestedTrains}
        />
      </div>
      <Results
        leaveHome={leaveHome}
        leaveWork={leaveWork}
        startWork={startWork}
        aboutTrainToWork={aboutTrainToWork}
        afterEightHuers={afterEightHuers}
        workTime={workTime}
        overTime={overTime}
        aboutTrainHome={aboutTrainHome}
        comingHome={comingHome}
      />
    </div>
  );
}
