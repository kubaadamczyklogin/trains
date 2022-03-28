import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider} from '@apollo/client';
import "./styles.css";

import { App } from "./components/App";

const GqlUrl = "https://rpkp-server.herokuapp.com/";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: GqlUrl
  })
});

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>  
  </StrictMode>,
  rootElement
);
