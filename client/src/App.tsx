
// function App() {
  

//   return (
//     <>
      
//     </>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router';
import HomePage from './pages/homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes later */}
      </Routes>
    </Router>
  );
}

export default App;

