import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import Router from '../router';
import Toasts from './Toasts';
import Navbar from '../components/Navbar';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1 mx-auto max-w-7xl w-full p-4">
            <Router />
          </main>
          <Toasts />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;