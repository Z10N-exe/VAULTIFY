import React from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { useStore } from './store/useStore';

function App() {
  const { isConnected } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {isConnected ? <Dashboard /> : <LandingPage />}
    </div>
  );
}

export default App;
