import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { User } from './components/User';
import { Admin } from './components/Admin';

function App() {

    return (
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<User />} />
              <Route path='admin' element={<Admin />}/>
              <Route path='user' element={<User />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
