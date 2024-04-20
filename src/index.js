import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import App from './App';
import './index.css';

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
});

// ReactDOM.render(
//   <BrowserRouter>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </BrowserRouter>,
//   document.getElementById('root')
// );

ReactDOM.render(
    <BrowserRouter>
  <ApolloProvider client={client}>
     <Provider store={store}>
       <App />
     </Provider>
  </ApolloProvider>,
  </BrowserRouter>,
  document.getElementById("root")
);
