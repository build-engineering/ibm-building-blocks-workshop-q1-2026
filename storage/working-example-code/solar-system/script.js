// Planet data
const celestialData = {
    sun: {
        name: 'The Sun',
        type: 'G-type main-sequence star (Yellow Dwarf)',
        age: '~4.6 billion years',
        diameter: '1,391,000 km (109 × Earth)',
        mass: '1.989 × 10³⁰ kg (333,000 × Earth)',
        surfaceTemp: '~5,500°C (9,932°F)',
        coreTemp: '~15 million°C',
        composition: '73% Hydrogen, 25% Helium, 2% other elements'
    },
    mercury: {
        name: 'Mercury',
        type: 'Terrestrial planet',
        diameter: '4,879 km (0.38 × Earth)',
        mass: '3.285 × 10²³ kg (0.055 × Earth)',
        orbitalPeriod: '88 Earth days',
        dayLength: '59 Earth days',
        distanceFromSun: '57.9 million km',
        surfaceTemp: '-173°C to 427°C',
        moons: 'None',
        atmosphere: 'Extremely thin (exosphere)',
        facts: 'Smallest planet, closest to the Sun, has the most eccentric orbit'
    },
    venus: {
        name: 'Venus',
        type: 'Terrestrial planet',
        diameter: '12,104 km (0.95 × Earth)',
        mass: '4.867 × 10²⁴ kg (0.815 × Earth)',
        orbitalPeriod: '225 Earth days',
        dayLength: '243 Earth days (retrograde)',
        distanceFromSun: '108.2 million km',
        surfaceTemp: '~462°C (hottest planet)',
        moons: 'None',
        atmosphere: 'Thick CO₂ atmosphere with sulfuric acid clouds',
        facts: 'Rotates backwards, brightest planet in night sky, runaway greenhouse effect'
    },
    earth: {
        name: 'Earth',
        type: 'Terrestrial planet',
        diameter: '12,742 km',
        mass: '5.972 × 10²⁴ kg',
        orbitalPeriod: '365.25 days',
        dayLength: '24 hours',
        distanceFromSun: '149.6 million km (1 AU)',
        surfaceTemp: '-88°C to 58°C (average 15°C)',
        moons: '1 (The Moon)',
        atmosphere: '78% Nitrogen, 21% Oxygen, 1% other gases',
        facts: 'Only known planet with life, 71% covered by water, has a magnetic field'
    },
    mars: {
        name: 'Mars',
        type: 'Terrestrial planet',
        diameter: '6,779 km (0.53 × Earth)',
        mass: '6.39 × 10²³ kg (0.107 × Earth)',
        orbitalPeriod: '687 Earth days',
        dayLength: '24.6 hours',
        distanceFromSun: '227.9 million km',
        surfaceTemp: '-87°C to -5°C',
        moons: '2 (Phobos and Deimos)',
        atmosphere: 'Thin, 95% CO₂',
        facts: 'Red color from iron oxide, largest volcano (Olympus Mons), deepest canyon (Valles Marineris)'
    },
    jupiter: {
        name: 'Jupiter',
        type: 'Gas giant',
        diameter: '139,820 km (11 × Earth)',
        mass: '1.898 × 10²⁷ kg (318 × Earth)',
        orbitalPeriod: '11.86 Earth years',
        dayLength: '9.9 hours (fastest rotation)',
        distanceFromSun: '778.5 million km',
        surfaceTemp: '-108°C (cloud tops)',
        moons: '95+ known moons (including Io, Europa, Ganymede, Callisto)',
        atmosphere: 'Hydrogen and helium with colorful cloud bands',
        facts: 'Largest planet, Great Red Spot storm, strong magnetic field, could fit 1,300 Earths inside'
    },
    saturn: {
        name: 'Saturn',
        type: 'Gas giant',
        diameter: '116,460 km (9.4 × Earth)',
        mass: '5.683 × 10²⁶ kg (95 × Earth)',
        orbitalPeriod: '29.46 Earth years',
        dayLength: '10.7 hours',
        distanceFromSun: '1.43 billion km',
        surfaceTemp: '-138°C (cloud tops)',
        moons: '146+ known moons (including Titan, Enceladus)',
        atmosphere: 'Hydrogen and helium',
        facts: 'Famous ring system made of ice and rock, least dense planet (would float in water), Titan has liquid methane lakes'
    },
    uranus: {
        name: 'Uranus',
        type: 'Ice giant',
        diameter: '50,724 km (4 × Earth)',
        mass: '8.681 × 10²⁵ kg (14.5 × Earth)',
        orbitalPeriod: '84 Earth years',
        dayLength: '17.2 hours (retrograde)',
        distanceFromSun: '2.87 billion km',
        surfaceTemp: '-197°C',
        moons: '27 known moons (including Titania, Oberon)',
        atmosphere: 'Hydrogen, helium, methane (gives blue-green color)',
        facts: 'Rotates on its side (98° tilt), coldest planetary atmosphere, faint ring system'
    },
    neptune: {
        name: 'Neptune',
        type: 'Ice giant',
        diameter: '49,244 km (3.9 × Earth)',
        mass: '1.024 × 10²⁶ kg (17 × Earth)',
        orbitalPeriod: '165 Earth years',
        dayLength: '16.1 hours',
        distanceFromSun: '4.5 billion km',
        surfaceTemp: '-201°C',
        moons: '14 known moons (including Triton)',
        atmosphere: 'Hydrogen, helium, methane (gives deep blue color)',
        facts: 'Strongest winds in solar system (2,100 km/h), Great Dark Spot, Triton orbits backwards'
    }
};

// Timer variables
let startTime = Date.now();
const DAYS_PER_SECOND = 365 / 5.06; // Earth takes 5.06 seconds = 365 days

// Update timer
function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    const simDays = elapsed * DAYS_PER_SECOND;
    const simYears = Math.floor(simDays / 365);
    const remainingDays = Math.floor(simDays % 365);
    
    document.getElementById('realTime').textContent = elapsed.toFixed(1) + 's';
    
    if (simYears > 0) {
        document.getElementById('simTime').textContent = 
            `${simYears} year${simYears !== 1 ? 's' : ''} ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    } else {
        document.getElementById('simTime').textContent = `${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    }
}

setInterval(updateTimer, 100);

// Show info panel and highlight selection
function showInfo(celestialBody) {
    const data = celestialData[celestialBody];
    const infoPanel = document.getElementById('infoPanel');
    const infoTitle = document.getElementById('infoTitle');
    const infoContent = document.getElementById('infoContent');
    
    // Remove previous selections
    document.querySelectorAll('.orbit.selected, .planet.selected, .sun.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to current celestial body
    const bodyElement = document.getElementById(celestialBody);
    if (bodyElement) {
        bodyElement.classList.add('selected');
        
        // Also highlight the orbit if it's a planet
        if (celestialBody !== 'sun') {
            const orbitElement = bodyElement.closest('.orbit');
            if (orbitElement) {
                orbitElement.classList.add('selected');
            }
        }
    }
    
    infoTitle.textContent = data.name;
    
    let content = '';
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'name') {
            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            content += `<p><strong>${label}:</strong> ${value}</p>`;
        }
    }
    
    infoContent.innerHTML = content;
    infoPanel.classList.add('active');
}

// Close info panel and remove selections
document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('infoPanel').classList.remove('active');
    // Remove all selections
    document.querySelectorAll('.orbit.selected, .planet.selected, .sun.selected').forEach(el => {
        el.classList.remove('selected');
    });
});

// Add click events to all celestial bodies
document.getElementById('sun').addEventListener('click', (e) => {
    e.stopPropagation();
    showInfo('sun');
});

// Add click events to orbital rings for easier interaction
const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
planets.forEach(planet => {
    const planetElement = document.getElementById(planet);
    const orbitElement = planetElement.closest('.orbit');
    
    // Add click to the orbital ring - will trigger for any click within the orbit
    orbitElement.addEventListener('click', (e) => {
        // Stop propagation to prevent outer orbits from also triggering
        e.stopPropagation();
        showInfo(planet);
    });
});

// Close panel when clicking outside and remove selections
document.addEventListener('click', (e) => {
    const infoPanel = document.getElementById('infoPanel');
    if (!infoPanel.contains(e.target) && !e.target.classList.contains('planet') &&
        !e.target.classList.contains('sun') && !e.target.classList.contains('orbit')) {
        infoPanel.classList.remove('active');
        // Remove all selections
        document.querySelectorAll('.orbit.selected, .planet.selected, .sun.selected').forEach(el => {
            el.classList.remove('selected');
        });
    }
});

// Made with Bob
