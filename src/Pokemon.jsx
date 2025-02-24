import { useState, useEffect } from "react";


export const Pokemon = ()=>{
  const API = "https://pokeapi.co/api/v2/pokemon?limit=30";

  const [pokemonList, setPokemonList] = useState([]); // Store all 30 Pokémon
  const [displayPokemon, setDisplayPokemon] = useState([]); // Store 10 Pokémon at a time
  const [clickedPokemon, setClickedPokemon] = useState(new Set()); // Track clicked Pokémon
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);


  const fetchPokemon = async()=>{
    try {
        const res = await fetch(API);
        const data = await res.json();
    
        const pokemonDetails = await Promise.all(
          data.results.map(async (currPokemon) => {
            const res = await fetch(currPokemon.url);
            const data = await res.json();
            return {
              id: data.id, 
              name: data.name, 
              image: data.sprites.other["official-artwork"].front_default, // High-quality image
            };
          })
        );
    
        setPokemonList(pokemonDetails);
        shuffleAndSetDisplay(pokemonDetails); 
    } catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchPokemon();
  },[]);

  const shuffleAndSetDisplay = (pokemonList) => {
    let unclickedPokemon = pokemonList.filter((pokemon) => !clickedPokemon.has(pokemon.id));

    if (unclickedPokemon.length === 0) {
      setGameWon(true); // If all Pokémon are clicked, player wins
      return;
    }

        const newPokemon = unclickedPokemon[Math.floor(Math.random() * unclickedPokemon.length)];
        let remainingPokemon = [...pokemonList].sort(() => Math.random() - 0.5);
        remainingPokemon = remainingPokemon.filter((p) => p.id !== newPokemon.id);
        setDisplayPokemon([newPokemon, ...remainingPokemon.slice(0, 9)]);
    };

    const handleCardClick = (id) => {
        if (clickedPokemon.has(id)) {
        setScore(0); // Reset score
        setClickedPokemon(new Set()); // Clear clicked Pokémon set
        setGameWon(false); // Reset win state
        } else {
        const newClicked = new Set(clickedPokemon);
        newClicked.add(id);
        setClickedPokemon(newClicked);
        setScore((prev) => prev + 1);
        if (score + 1 > highScore) {
            setHighScore(score + 1);
        }
        }
        shuffleAndSetDisplay(pokemonList);
    };

  return (
    <div>
      <h1>Pokemon Memory Game</h1>
      <h2>Score: {score}</h2>
      <h2>High Score: {highScore}</h2>

      {gameWon ? (
        <h2>🎉 You Win! 🎉</h2>
      ) : (
        <div className="pokemon-container">
          {displayPokemon.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card" onClick={() => handleCardClick(pokemon.id)}>
              <img src={pokemon.image} alt={pokemon.name} />
              <p>{pokemon.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
