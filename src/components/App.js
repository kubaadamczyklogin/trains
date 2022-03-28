import { useState } from "react";
import { useQuery, gql } from '@apollo/client';
import { addingMinutes, millisecondsToTime } from "./../functions";
import { TrainsToWorkTable } from "./TrainsToWorkTable";
import { TrainsHomeTable } from "./TrainsHomeTable";
import { CustomTime } from "./CustomTime";
import { Results } from "./Results";
import "./App.css";

const gqlQuote = gql`
  query getQuote {    
    ByBikeToTrain {     
      FromHomeToTorMia
      FromHomeToTorGlo
      FromTrainToWork
      FromWorkToTrain
      FromTorMiaToHome
      FromTorGloToHome    
    } 
    TrainsToTorun{ 
      TorMia
      TorGlo
      BydBie     
    }   
    TrainsToBydgoszcz{ 
      TorMia
      TorGlo
      BydBie     
    } 
  }
`;

export function App() {
  const { data, loading, error} = useQuery(gqlQuote);  
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

  if (loading) {   
    return(
      <div className="App">Loading...</div>
    )
  } else if(error) {    
    return(
      <div className="App">Nie udao sié wczyta danych</div>
    )
  }  else { 
    const byBikeToTrain = data.ByBikeToTrain;
    const trainsToTorun = data.TrainsToTorun; 
    const trainsToBydgoszcz = data.TrainsToBydgoszcz;

    

    function findSugestedTrains(workFinishTime) {
      let suggestedEarly = ["?", -10000000];
      let suggestedLate = ["?", 10000000];
      let idealTrainTime = addingMinutes(
        workFinishTime,
        byBikeToTrain.FromWorkToTrain
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
}

