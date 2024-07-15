import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import StartRating from './StarRating';
import { useState } from 'react';

// function handleSetMovieRating({rating}){
//   const [displayRating,setDisplayRating] = useState(0);
// return(
//   setDisplayRating(rating)
// );
// }
// function Test(){
//   const[movieRating,setMovieRating] = useState(0);
//   return(
//     <div>
//       <StartRating color='blue' maxRating={10} onSetRating={setMovieRating} />
//       <p>This movie was rated {movieRating} stars</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

