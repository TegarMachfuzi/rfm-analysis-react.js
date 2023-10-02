import './App.css';
import FormUpload from './components/FormUpload';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <Router>
      <div className='flex flex-row bg-neutral-200 h-screen w-screen'>
        <Routes>
        <Route path='/' element={<FormUpload/>}/>
      </Routes>
      </div>
      
    </Router>
  );
}

export default App;
