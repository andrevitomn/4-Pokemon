// Elementos do DOM
const form = document.getElementById('search-form');
const input = document.getElementById('pokemon-input');
const message = document.getElementById('message');
const content = document.getElementById('pokemon-content');

// Mapeamento de cores para os status
const statColors = {
    hp: '#ff5959',
    attack: '#f5ac78',
    defense: '#fae078',
    'special-attack': '#9db7f5',
    'special-defense': '#a7db8d',
    speed: '#fa92b2'
};

// Tradução dos nomes dos status
const statNames = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Atq. Especial',
    'special-defense': 'Def. Especial',
    speed: 'Velocidade'
};

// Evento de busca
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim().toLowerCase();
    if (!name) {
        showMessage('Digite o nome de um Pokémon!', 'warning');
        return;
    }
    searchPokemon(name);
});

// Função para buscar o Pokémon
async function searchPokemon(name) {
    showMessage('Carregando...', 'info');
    content.classList.add('d-none');

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }

        const data = await response.json();
        renderPokemon(data);
        clearMessage();
        content.classList.remove('d-none');
    } catch (error) {
        showMessage(`❌ "${name}" não encontrado. Verifique o nome e tente novamente.`, 'danger');
        console.error(error);
    }
}

// Função para renderizar os dados
function renderPokemon(data) {
    // Imagem
    const image = data.sprites.other['official-artwork'].front_default 
                  || data.sprites.front_default;
    document.getElementById('pokemon-image').src = image;
    document.getElementById('pokemon-image').alt = data.name;

    // Nome e ID
    document.getElementById('pokemon-name').textContent = data.name;
    document.getElementById('pokemon-id').textContent = `#${String(data.id).padStart(3, '0')}`;

    // Tipos
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = '';
    data.types.forEach(t => {
        const badge = document.createElement('span');
        badge.className = `type-badge type-${t.type.name}`;
        badge.textContent = t.type.name;
        typesContainer.appendChild(badge);
    });

    // Altura e peso
    document.getElementById('pokemon-height').textContent = `${(data.height / 10).toFixed(1)} m`;
    document.getElementById('pokemon-weight').textContent = `${(data.weight / 10).toFixed(1)} kg`;
    document.getElementById('pokemon-exp').textContent = data.base_experience || '-';

    // Habilidades
    const abilitiesContainer = document.getElementById('pokemon-abilities');
    abilitiesContainer.innerHTML = '';
    data.abilities.forEach(a => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary me-2 mb-2 text-capitalize p-2';
        badge.textContent = a.ability.name.replace('-', ' ');
        if (a.is_hidden) badge.textContent += ' (oculta)';
        abilitiesContainer.appendChild(badge);
    });

    // Status
    const statsContainer = document.getElementById('pokemon-stats');
    statsContainer.innerHTML = '';
    data.stats.forEach(s => {
        const statName = s.stat.name;
        const value = s.base_stat;
        const percent = Math.min((value / 200) * 100, 100);
        const color = statColors[statName] || '#6c757d';

        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
            <div class="stat-label">${statNames[statName] || statName}</div>
            <div class="stat-bar flex-grow-1 mx-2">
                <div class="stat-bar-fill" style="width: ${percent}%; background: ${color};"></div>
            </div>
            <div class="stat-value">${value}</div>
        `;
        statsContainer.appendChild(row);
    });
}

// Funções auxiliares
function showMessage(text, type = 'info') {
    message.innerHTML = `<div class="alert alert-${type} py-2">${text}</div>`;
}

function clearMessage() {
    message.innerHTML = '';
}

// Busca inicial (Pikachu por padrão)
window.addEventListener('DOMContentLoaded', () => {
    input.value = 'pikachu';
    searchPokemon('pikachu');
});
