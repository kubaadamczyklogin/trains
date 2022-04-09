import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider, gql} from '@apollo/client';
import {Query} from '@apollo/client/react/components';
import "./styles.css";

import { App } from "./components/App";

const GqlUrl = "https://rpkp-server.herokuapp.com/";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: GqlUrl
  })
});

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

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Query query={gqlQuote}> 
        {({ loading, error, data }) => {
            if (error) return <div className="App">Nie udao sié wczyta danych</div>;
            if (loading || !data) return <div className="App">Loading...</div>;

            return  <App gqlData={data}/>
        }}             
      </Query>           
    </ApolloProvider>  
  </StrictMode>,
  rootElement
);
