const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const inputBusqueda = document.getElementById('input-busqueda');
const botonBuscar = document.getElementById('boton-buscar');

let pokemonActuales = [];

const typeTranslations = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta', electric: 'Eléctrico',
  ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra', flying: 'Volador',
  psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón',
  dark: 'Siniestro', steel: 'Acero', fairy: 'Hada'
};

const typeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', grass: '#7AC74C', electric: '#F7D02C',
  ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3',
  psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
  dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD'
};

function getGeneration(id) {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchPokemonDetails(urls) {
  const promises = urls.map(url => fetch(url).then(res => res.json()));
  return Promise.all(promises);
}

async function cargarPokemon(urls) {
  try {
    const pokemons = await fetchPokemonDetails(urls);
    pokemonActuales = pokemons;
    renderTarjetas(pokemons);
  } catch (error) {
    console.error(error);
    contenedorTarjetas.innerHTML = '<p style="color:red;">Error al cargar los Pokémon</p>';
  }
}

function renderTarjetas(pokemons) {
  contenedorTarjetas.innerHTML = '';
  
  pokemons.forEach(poke => {
    const gen = getGeneration(poke.id);
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-pokemon';

    const tiposHTML = poke.types.map(t => {
      const tipoEs = typeTranslations[t.type.name] || capitalize(t.type.name);
      return `<span class="tipo" style="background-color:${typeColors[t.type.name]}">${tipoEs}</span>`;
    }).join('');

    tarjeta.innerHTML = `
      <img src="${poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default}" alt="${poke.name}">
      <h3>#${poke.id.toString().padStart(3, '0')} ${capitalize(poke.name)}</h3>
      <p class="generacion">Generación ${gen}</p>
      <div class="tipos">${tiposHTML}</div>
    `;

    tarjeta.addEventListener('click', () => {
      window.location.href = `detalle_pokemon.html?id=${poke.id}`;
    });

    contenedorTarjetas.appendChild(tarjeta);
  });
}


function crearBotonesGeneracion() {
  const container = document.getElementById('botones-generacion');
  for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.textContent = `Gen ${i}`;
    btn.onclick = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/generation/${i}`);
      const data = await res.json();
      const urls = data.pokemon_species.map(s => `https://pokeapi.co/api/v2/pokemon/${s.name}`);
      cargarPokemon(urls.slice(0,40));
    };
    container.appendChild(btn);
  }
}

function crearBotonesTipo() {
  const tipos = Object.keys(typeTranslations);
  const container = document.getElementById('botones-tipo');
  
  tipos.forEach(tipo => {
    const btn = document.createElement('button');
    btn.textContent = typeTranslations[tipo];
    btn.style.backgroundColor = typeColors[tipo];
    btn.style.color = 'white';
    btn.onclick = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
      const data = await res.json();
      const urls = data.pokemon.map(p => p.pokemon.url);
      cargarPokemon(urls.slice(0, 40));
    };
    container.appendChild(btn);
  });
}

async function cargarTodos() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=60');
  const data = await res.json();
  const urls = data.results.map(p => p.url);
  cargarPokemon(urls);
}

botonBuscar.addEventListener('click', () => {
  const texto = inputBusqueda.value.toLowerCase().trim();
  if (!texto) {
    renderTarjetas(pokemonActuales);
    return;
  }
  const filtrados = pokemonActuales.filter(p => p.name.toLowerCase().includes(texto));
  renderTarjetas(filtrados);
});

inputBusqueda.addEventListener('keypress', e => {
  if (e.key === 'Enter') botonBuscar.click();
});

crearBotonesGeneracion();
crearBotonesTipo();
cargarTodos(); 