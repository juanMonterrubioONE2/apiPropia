const contenedorDetalle = document.getElementById('contenedor-detalle');
const botonVolver = document.getElementById('boton-volver');
const tituloPokemon = document.getElementById('titulo-pokemon');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
  contenedorDetalle.innerHTML = '<p class="error">No se encontró el Pokémon.</p>';
} else {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Pokémon no encontrado');
      return res.json();
    })
    .then(poke => {
      // Preparar datos
      const name = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
      const number = poke.id.toString().padStart(3, '0');
      const imgNormal = poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default;
      const imgShiny = poke.sprites.other['official-artwork'].front_shiny || poke.sprites.front_shiny;

      const tiposHTML = poke.types
        .map(t => {
          const tipo = t.type.name;
          return `<span class="tipo-badge" data-tipo="${tipo}">${tipo.toUpperCase()}</span>`;
        })
        .join('');

      const statsHTML = poke.stats
        .map(stat => {
          const nombre = stat.stat.name
            .replace('special-attack', 'Sp. Atk')
            .replace('special-defense', 'Sp. Def')
            .toUpperCase();
          const valor = stat.base_stat;
          const porcentaje = Math.min((valor / 255) * 100, 100);

          return `
            <div class="stat-item">
              <span class="stat-name">${nombre}</span>
              <div class="stat-bar">
                <div class="stat-fill" style="width: ${porcentaje}%;"></div>
              </div>
              <span class="stat-value">${valor}</span>
            </div>
          `;
        })
        .join('');

      const habilidadesHTML = poke.abilities
        .map(ability => {
          const esOculta = ability.is_hidden ? ' <small>(oculta)</small>' : '';
          return `<li>${ability.ability.name.replace('-', ' ')}${esOculta}</li>`;
        })
        .join('');

      // Estructura HTML
      tituloPokemon.textContent = `#${number} ${name}`;

      contenedorDetalle.innerHTML = `
        <div class="pokemon-header">
          <div class="pokemon-images">
            <img src="${imgNormal}" alt="${name}" class="pokemon-main-img" id="img-principal">
            <div class="shiny-toggle">
              <button id="toggle-shiny">Ver versión Shiny</button>
            </div>
          </div>

          <div class="pokemon-info">
            <div class="tipos-container">${tiposHTML}</div>
            
            <div class="medidas">
              <div><strong>Altura:</strong> ${poke.height / 10} m</div>
              <div><strong>Peso:</strong> ${poke.weight / 10} kg</div>
              <div><strong>Exp. base:</strong> ${poke.base_experience || '—'}</div>
            </div>

            <div class="stats-section">
              <h3>Estadísticas base</h3>
              ${statsHTML}
            </div>

            <div class="habilidades-section">
              <h3>Habilidades</h3>
              <ul>${habilidadesHTML}</ul>
            </div>

           
          </div>
        </div>
      `;

      // Toggle shiny
      const imgPrincipal = document.getElementById('img-principal');
      const btnToggle = document.getElementById('toggle-shiny');
      let esShiny = false;

      if (imgShiny) {
        btnToggle.style.display = 'inline-block';

        btnToggle.addEventListener('click', () => {
          esShiny = !esShiny;
          imgPrincipal.src = esShiny ? imgShiny : imgNormal;
          imgPrincipal.alt = esShiny ? `${name} shiny` : name;
          btnToggle.textContent = esShiny ? 'Ver versión normal' : 'Ver versión Shiny';
        });
      }
    })
    .catch(err => {
      console.error(err);
      contenedorDetalle.innerHTML = '<p class="error">Error al cargar los datos del Pokémon.</p>';
    });
}

botonVolver.addEventListener('click', () => {
  window.location.href = 'index.html';
});