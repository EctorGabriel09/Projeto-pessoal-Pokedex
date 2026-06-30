const API_URL = "https://pokeapi.co/api/v2/pokemon";

export async function getPokemonList(limit = 24, offset = 0) {
  const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar a lista de Pokemon.");
  }

  const data = await response.json();

  return data.results.map((pokemon) => {
    const id = pokemon.url.split("/").filter(Boolean).pop();

    return {
      id,
      name: pokemon.name,
      image: getPokemonImage(id),
    };
  });
}

export async function getPokemonDetails(nameOrId) {
  const response = await fetch(`${API_URL}/${String(nameOrId).toLowerCase()}`);

  if (!response.ok) {
    throw new Error("Pokemon nao encontrado.");
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other?.["official-artwork"]?.front_default ||
      data.sprites.front_default,
    height: data.height,
    weight: data.weight,
    types: data.types.map((item) => item.type.name),
    abilities: data.abilities.map((item) => item.ability.name),
    baseExperience: data.base_experience,
  };
}

export function getPokemonImage(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
