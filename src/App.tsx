import React from 'react';
import GlobalStyle from './styles/global';
import AppProvider from './hooks/index';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/index';

function App() {
  return (
    <BrowserRouter>
      <AppProvider> 
          <Routes />
      </AppProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
