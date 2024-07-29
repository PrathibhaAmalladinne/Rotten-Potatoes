import { useState,useEffect } from "react";


const KEY = '922f1d34';

export function useMovies(query,callback){
    const [movies, setMovies] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError]  = useState("");
    useEffect(
        function(){
            callback?.();
          const controller = new AbortController();
      
        async function fetchMovies(){
         try{ 
        setError("");
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {signal: controller.signal}
        );
      
        if(!res.ok) 
          throw new Error("Something went wrong while fetcing movies");
      
        const data = await res.json();
        if(data.Response === "False") 
          throw new Error("Movie Not found");
      
        setMovies(data.Search);
      } catch(err) {
          if(err.name!=="AbortError")
          console.log(err.message);
          setError(err.message);
        }finally{
          setIsLoading(false);
        }
        }
        if(query.length < 2){
          setMovies([]);
          setError("");
          return;
        }
         
        fetchMovies();
      },[query,callback]);
      
    return {movies, isLoading, error}

}