import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// using apollo to set the sandbox endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// getting the token from local storage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({

  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // wrapping the entire application in the apollo provider
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={<SearchBooks/>} 
            />
            <Route 
              path="/saved" 
              element={<SavedBooks/>} 
            />
            <Route 
              path='*' 
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
