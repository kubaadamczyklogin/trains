import React from "react";
import { addingMinutes, millisecondsToTime } from "./../functions";
import { TrainsToWorkTable } from "./TrainsToWorkTable";
import { TrainsHomeTable } from "./TrainsHomeTable";
import { CustomTime } from "./CustomTime";
import { Results } from "./Results";
import "./App.css";

export class App extends React.Component {
  constructor(props){
    super(props);
    this.gqlData = props.gqlData;   
    this.byBikeToTrain = this.gqlData.ByBikeToTrain;
    this.trainsToTorun = this.gqlData.TrainsToTorun; 
    this.trainsToBydgoszcz = this.gqlData.TrainsToBydgoszcz; 

    this.state = {
      leaveHome: "?",
      aboutTrainToWork: "?",
      selectedTrainToWork: "?",
      afterEightHuers: "?",
      suggestedTrains: [],
      startWork: "?",
      workTime: "?",
      overTime: "?",
      leaveWork: "?",
      aboutTrainHome: "?",
      selectedTrainHome: "?",
      comingHome: "?"
    }
  }    

  findSugestedTrains(workFinishTime) {    
    let suggestedEarly = ["?", -10000000];
    let suggestedLate = ["?", 10000000];
    let idealTrainTime = addingMinutes(
      workFinishTime,
      this.byBikeToTrain.FromWorkToTrain
    );
    idealTrainTime = idealTrainTime.split(":");

    let time = new Date();
    const idealTrainTimeRaw = time.setHours(
      idealTrainTime[0],
      idealTrainTime[1]
    );

    this.trainsToTorun.forEach((train) => {
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

    this.setState({
      suggestedTrains: [suggestedEarly[0], suggestedLate[0]]
    });
  }

  howMuchHouers(startWork, endWork) {   
    if (startWork !== "?" && endWork !== "?") {
      startWork = startWork.split(":");
      let time = new Date();
      const startWorkRaw = time.setHours(startWork[0], startWork[1]);
      endWork = endWork.split(":");
      time = new Date();
      const endWorkRaw = time.setHours(endWork[0], endWork[1]);
      const totalWorkTime = endWorkRaw - startWorkRaw;
      const overTime = totalWorkTime - 8 * 60 * 60 * 1000;

      this.setState({
        workTime: millisecondsToTime(totalWorkTime),
        overTime: millisecondsToTime(overTime)
      });    
    }
  }

  handleSelectTrainToWork(home, TorGlo, aboutTrain, work) {    
      const workPlusEight = addingMinutes(work, 8 * 60);

      this.setState({
        leaveHome: home,
        startWork: work,
        aboutTrainToWork: aboutTrain,
        selectedTrainToWork: TorGlo,
        afterEightHuers: workPlusEight
      });

      this.findSugestedTrains(workPlusEight);
      this.howMuchHouers(work, this.state.leaveWork);
  }

  handleSelectTrainHome(work, BydBie, aboutTrain, home) {  
    
    this.setState({
      leaveWork: work,
      selectedTrainHome: BydBie,
      aboutTrainHome: aboutTrain,
      comingHome: home
    });    

    this.howMuchHouers(this.state.startWork, work);
  }

  handleTimeChange(timeToChange, timeType, modifier) {    
    const timeAfterChange = addingMinutes(timeToChange, modifier);

    if (timeType === "startWork") {
      const workPlusEight = addingMinutes(timeAfterChange, 8 * 60);

      this.setState({
        startWork: timeAfterChange,
        afterEightHuers: workPlusEight
      });      

      this.findSugestedTrains(workPlusEight);
      this.howMuchHouers(timeAfterChange, this.state.leaveWork);

    } else if (timeType === "leaveWork") {
      this.setState({
        leaveWork: timeAfterChange
      });     

      this.howMuchHouers(this.state.startWork, timeAfterChange);
    }
  }

  render() { 
    const {
      leaveHome,
      aboutTrainToWork,
      selectedTrainToWork,
      afterEightHuers,
      suggestedTrains,
      startWork,
      workTime,
      overTime,
      leaveWork,
      aboutTrainHome,
      selectedTrainHome,
      comingHome
    } = this.state;
      return (
        <div className="App">          
          <div className="TransportEditor">               
            <TrainsToWorkTable
              trainsToBydgoszcz={this.trainsToBydgoszcz}
              byBikeToTrain={this.byBikeToTrain}
              SelectTrainToWork={this.handleSelectTrainToWork.bind(this)}
              selectedTrain={selectedTrainToWork}
            />
            <CustomTime
              timeToChange={startWork}
              timeType="startWork"
              TimeChange={this.handleTimeChange.bind(this)}
            />
            <CustomTime
              timeToChange={leaveWork}
              timeType="leaveWork"
              TimeChange={this.handleTimeChange.bind(this)}
            />
            <TrainsHomeTable
              trainsToTorun={this.trainsToTorun}
              byBikeToTrain={this.byBikeToTrain}
              SelectTrainHome={this.handleSelectTrainHome.bind(this)}
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