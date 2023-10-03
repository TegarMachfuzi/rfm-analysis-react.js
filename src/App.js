import './App.css';
import FormUpload from './components/FormUpload';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
      <div className='flex flex-row bg-neutral-200 h-screen w-screen'>
        <FormUpload/>
      </div>
        );
}

export default App;
