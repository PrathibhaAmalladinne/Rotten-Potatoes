import { useEffect, useRef, useState } from "react";
import StartRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '922f1d34';

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId,setSelectedId] = useState(null);
 
  const {movies,isLoading,error} = useMovies(query,handleCloseMovie)
   const[watched,setWatched] = useLocalStorageState([],"watched");
  // const [watched,setWatched] = useState(function(){
  //   const storedValue = localStorage.getItem("watched");
  //     return JSON.parse(storedValue);
  // });
  
  function handleSelectMovie(id){
    setSelectedId((selectedId)=>(id === selectedId ?
      null : id));
  }
  function handleCloseMovie(){
    setSelectedId(null);
  }
  function handleAddWatched(movie){
    setWatched((watched)=>[...watched,movie]);

    // localStorage.setItem("watched",JSON.stringify([...watched,movie]));
  }
  function handleRemoveWatched(movie){
    setWatched(watched.filter((m)=>m.imdbID !== movie.imdbID));
  } 




  return (
    <>
      <NavBar>
         <Search query={query} setQuery={setQuery} onCloseMovie={handleCloseMovie}/>
         <NumResults movies={movies} />
      </NavBar>

      <Main> 
         <Box>
            {/* {isLoading ? <Loader /> : <MovieList movies={movies}/>} */}
            {isLoading && <Loader/> }
            {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
            {error && <ErrorMessage message={error}/>}
         </Box>

         <Box>
            { selectedId ? (
              <MovieDetails 
              selectedId={selectedId} 
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              onRemoveWatched={handleRemoveWatched}
              watched={watched}
              /> 
            ):(
            <>
            <WatchedSummary watched={watched}  />
            <WatchedMoviesList
            watched={watched} 
            onSelectMovie={handleSelectMovie}
            onRemoveWatched={handleRemoveWatched} />
            </>
            )}
         </Box>
      </Main>
    </>
  );
}
function Search({query,setQuery}){
  const inputEl = useRef(null);

  useKey("Enter",function(){
    if(document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });
 

  return(
  <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref = {inputEl}
      />
  );
}
function Logo(){
  return(
    <div className="logo">
          <span role="img">🍿</span>
          <h1>RottenPotatoes</h1>
        </div>
  );
  }

function ErrorMessage({message}){
  return(
    <p className="error">
      <span>🎈</span>{message}
    </p>
  );
}
function Loader(){
  return <p className="loader">Loading...</p>
}

function NavBar({children}){
  return(
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function NumResults({movies}){
  return(
    <p className="num-results">
        Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({children}){
return(
  <main className="main">
       {children}            
      </main>
);
}
function Box({children}){
  const [isOpen, setIsOpen] = useState(true);
  return(
    <div className="box">
          <ButtonToggle isOpen={isOpen} setIsOpen={setIsOpen}/>
          {isOpen && children}
        </div>
  );
}
function ButtonToggle({isOpen,setIsOpen}){
 return (
  <button
    className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}>
     {isOpen ? "–" : "+"}
  </button>
 );
}
function MovieList({movies,onSelectMovie}){
  return(
    <ul className="list list-movies">
              {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}/>
              ))}
            </ul>
  );
}

function Movie({movie,onSelectMovie}){
  return(
        <li onClick={() => onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
              <div>
                 <p>
                  <span>🗓</span>
                   <span>{movie.Year}</span>
                 </p>
              </div>
        </li>
  );
}


function MovieDetails({selectedId,onCloseMovie,onAddWatched,onRemoveWatched,watched}){
const [movie,setMovie] = useState({});
const [isLoading,setIsLoading] = useState(false);
const [userRating,setUserRating]  =useState(0);
const watchedUserRating = watched.find(movie=>movie.imdbID)?.userRating ;

const countRef = useRef(0);
useEffect(function(){
  if(userRating)
  countRef.current = countRef.current +1;
},[userRating])

const isWatched = watched.map((movie)=>movie.imdbID).includes(selectedId);
console.log(watched);
const {
  Title : title,
  Year : year,
  Poster : poster,
  Runtime : runtime,
  imdbRating,
  Plot : plot,
  Released : released,
  Actors : actors,
  Genre : genre,
  Director : director,
} = movie;

 function handleAdd(){
  const newWatchedMovie = {
    imdbID:selectedId,
    title,
    year,
    poster,
    imdbRating:Number(imdbRating),
    runtime:Number(runtime.split(" ").at(0)),
    userRating,
    countRatingDecisions :countRef.current,
  }
   onAddWatched(newWatchedMovie);
   //setAddedToList(true);
   onCloseMovie();
 }
 function handleRemove(){
  onRemoveWatched(movie);
  onCloseMovie();
 }
 useKey("Escape",onCloseMovie);

 useEffect(function(){

    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
 },[selectedId])

 useEffect(function(){
  if(!title) return;
    document.title = `Movie | ${title}`;

    return function(){
      document.title = "usePopcorn";
    }
 },
 [title]);
  return(
    <div className="details">

      {isLoading ? (<Loader /> 
      ) : (
      <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}> &larr;
            </button>
            <img src={poster} alt = {`poster of the ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p><span>⭐</span> {imdbRating} IMDb rating</p>
            </div>
          </header>
          
          <section>
             <div className="rating">
              
               {!isWatched ? 
               <StartRating  maxRating={10} size={24} onSetRating={setUserRating} />
               : <p>You rated this movie {watchedUserRating} ⭐️</p>
               }
             </div>
             { (userRating>0 && !isWatched)?
                 (<button className="btn-add" onClick={handleAdd}>
                 + Add to Watched list
                 </button> ):( watchedUserRating &&
                  <button className="btn-add" onClick={handleRemove}>
                  -Remove from Watched list
                </button>
                 )}
      
                <p><em>{plot}</em></p>
                <p>Starring {actors}</p>
                <p>Directed by {director}</p>
          </section>
      </>
      )}
    </div>
  );
}

function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return(
    <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
  );
}
function WatchedMoviesList({watched,onSelectMovie,onRemoveWatched}){
  return(
    <ul className="list">
                {watched.map((movie) => (
                  <WatchedMovie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} onRemoveWatched={onRemoveWatched} />
                ))}
              </ul>
  );
}
function WatchedMovie({movie,onSelectMovie,onRemoveWatched}){
  console.log(movie.data);
  return(
    // onClick={() => onSelectMovie(movie.imdbID)}
    <li  
    // onClick={bools && `${}`} 
    >
      <img src={movie.poster} alt={`${movie.title} poster`} onClick={() => onSelectMovie(movie.imdbID)} />
      <h3 onClick={() => onSelectMovie(movie.imdbID)}>{movie.title}</h3>
      
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button 
        // onMouseOver={setBools(false)}
        className="btn-delete" onClick={()=>onRemoveWatched(movie)}>❌</button>
      </div>
    </li>
  );
}