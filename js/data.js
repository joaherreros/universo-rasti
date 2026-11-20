/**
 * UNIVERSO RASTI — Datos del Prototipo Interactivo
 * Basado en el Manual de Identidad Visual y Documento de Proyecto de Universo Rasti.
 */

window.RASTI_DATA = {
  user: {
    username: 'Lordlyburrito71',
    displayName: 'Leo',
    age: 8,
    ageGroup: '7-10', // Calculado automáticamente según la edad (4-6 o 7-10)
    level: 4,
    levelTitle: 'Constructor Estelar',
    stars: 120,
    streakDays: 5,
    kitBlocks: 400,
    kitVerified: true,
    avatarId: 1,
    gender: 'boy', // 'boy' | 'girl'
    skinTone: 2,
    eyeColor: 1,
    hairStyle: 1,
    hairColor: 1,
    topItem: 1,
    bottomItem: 1,
    specialSuit: null,
    accessory: 1,
    backpack: 5,
    parentalConsent: true,      // Consentimiento del adulto para participar en Familia Rasti
    publishingEnabled: true,    // Permiso del adulto para publicar fotos de construcciones
    sharedHistory: [
      { id: 101, title: 'Castillo Real Rasti', world: 'Reino Perdido', date: 'Ayer • 18:20', blocks: 48, img: 'assets/builds/build-castle.jpg', status: 'Aprobada por Moderador' },
      { id: 102, title: 'Supercar Amarillo', world: 'Desafíos Rasti', date: 'Hace 3 días', blocks: 34, img: 'assets/builds/build-supercar.jpg', status: 'Aprobada por Moderador' }
    ]
  },

  // 10 Perfiles de niños/as oficiales del PDF (Página 3)
  profiles: [
    { id: 1, name: 'Leo', tag: 'Explorador Curioso', gender: 'boy', img: 'assets/avatars/avatar-1.png', color: '#0051ba' },
    { id: 2, name: 'Sofi', tag: 'Creadora de Mundos', gender: 'girl', img: 'assets/avatars/avatar-2.png', color: '#ed1d24' },
    { id: 3, name: 'Mateo', tag: 'Piloto Turbo', gender: 'boy', img: 'assets/avatars/avatar-3.png', color: '#ffe600' },
    { id: 4, name: 'Mora', tag: 'Arquitecta Real', gender: 'girl', img: 'assets/avatars/avatar-4.png', color: '#00246b' },
    { id: 5, name: 'Tomi', tag: 'Maestro de Bloques', gender: 'boy', img: 'assets/avatars/avatar-5.png', color: '#ed1d24' },
    { id: 6, name: 'Emma', tag: 'Detective de la Isla', gender: 'girl', img: 'assets/avatars/avatar-6.png', color: '#ffe600' },
    { id: 7, name: 'Lucas', tag: 'Inventor Espacial', gender: 'boy', img: 'assets/avatars/avatar-7.png', color: '#0051ba' },
    { id: 8, name: 'Valen', tag: 'Capitana Submarina', gender: 'girl', img: 'assets/avatars/avatar-8.png', color: '#ed1d24' },
    { id: 9, name: 'Santi', tag: 'Guardián de la Selva', gender: 'boy', img: 'assets/avatars/avatar-9.png', color: '#8dc63f' },
    { id: 10, name: 'Cami', tag: 'Soñadora Galáctica', gender: 'girl', img: 'assets/avatars/avatar-10.png', color: '#00246b' }
  ],

  // 4 Mundos Oficiales de "Modo Aventura" (Reino Perdido 1° y Estación Espacial 3°)
  worlds: [
    {
      id: 'reino',
      name: 'Reino Perdido',
      shortTitle: 'El Reino Perdido',
      subtitle: 'Defendé castillos mágicos, torres reales y puentes levadizos',
      badgeImg: 'assets/worlds/badge-reino-perdido.png',
      islandImg: 'assets/worlds/island-reino-perdido.png',
      buildPreview: 'assets/builds/build-castle.jpg',
      palette: ['#ffcb05', '#047e48', '#8cc63e', '#00adef', '#ed1d24', '#6a220c'],
      accentColor: '#ed1d24',
      secondaryColor: '#ffcb05',
      bgGradient: 'linear-gradient(135deg, #6a220c 0%, #ed1d24 55%, #ffcb05 100%)',
      completedMissions: 0,
      totalMissions: 6,
      starsEarned: 0,
      totalStars: 60,
      difficulty: 'Inicial',
      blocksRequired: 25,
      storyAudio4to6: '¡El rey y la reina necesitan reconstruir la torre roja del castillo! ¿Nos ayudás con tus bloques?',
      storyText7to10: 'Las antiguas murallas del Reino Perdido esperan a un gran arquitecto. Reconstruí las torres reales y el emblema dorado para restaurar la magia.',
      missions: [
        { num: 1, title: 'Portón y Puente Levadizo', blocks: 25, stars: 10, status: 'current', desc: 'La entrada principal al gran castillo Rasti.' },
        { num: 2, title: 'Torre del Reloj Real', blocks: 35, stars: 15, status: 'locked', desc: 'Una torre alta con techo rojo y banderín amarillo.' },
        { num: 3, title: 'Carruaje de Cristales', blocks: 30, stars: 10, status: 'locked', desc: 'Transportá los bloques mágicos por el bosque real.' },
        { num: 4, title: 'Dragón Guardián Amigable', blocks: 48, stars: 10, status: 'locked', desc: 'Un dragón rojo y dorado que cuida la corona.' },
        { num: 5, title: 'Gran Fortaleza del Reino', blocks: 65, stars: 10, status: 'locked', desc: 'Uní las cuatro torres con murallas simétricas.' },
        { num: 6, title: 'Corona del Maestro Rasti', blocks: 40, stars: 5, status: 'locked', desc: 'El símbolo máximo de creatividad del Reino Perdido.' }
      ]
    },
    {
      id: 'isla',
      name: 'Isla Misteriosa',
      shortTitle: 'La Isla Misteriosa',
      subtitle: 'Explorá templos antiguos, cascadas y criaturas prehistóricas',
      badgeImg: 'assets/worlds/badge-isla-misteriosa.png',
      islandImg: 'assets/worlds/island-isla-misteriosa.png',
      buildPreview: 'assets/builds/build-dino.jpg',
      palette: ['#ffcb05', '#047e48', '#8cc63e', '#00adef', '#f5821f', '#6a220c'],
      accentColor: '#047e48',
      secondaryColor: '#ffcb05',
      bgGradient: 'linear-gradient(135deg, #047e48 0%, #8cc63e 55%, #f5821f 100%)',
      completedMissions: 0,
      totalMissions: 6,
      starsEarned: 0,
      totalStars: 60,
      difficulty: 'Media',
      blocksRequired: 35,
      storyAudio4to6: '¡Llegamos a la selva encantada! Construyamos juntos un puente de bloques para cruzar la gran cascada.',
      storyText7to10: 'El mapa del templo dorado está oculto detrás de la gran cascada. Superá los obstáculos naturales construyendo herramientas y criaturas aliadas.',
      missions: [
        { num: 1, title: 'Balsa de Desembarco', blocks: 16, stars: 10, status: 'locked', desc: 'Construí una balsa resistente para llegar a la playa.' },
        { num: 2, title: 'Refugio en la Casa del Árbol', blocks: 32, stars: 10, status: 'locked', desc: 'Un mirador alto entre las palmeras de la isla.' },
        { num: 3, title: 'Amigo Dino T-Rex', blocks: 38, stars: 10, status: 'locked', desc: 'Armá al guardián verde de la selva con bloques Rasti.' },
        { num: 4, title: 'Puente Colgante de la Cascada', blocks: 40, stars: 5, status: 'locked', desc: 'Conectá los dos acantilados sobre el río celeste.' },
        { num: 5, title: 'Llave del Templo Dorado', blocks: 36, stars: 10, status: 'locked', desc: 'Combiná bloques amarillos y naranjas para abrir la puerta secreta.' },
        { num: 6, title: 'Globo Aerostático de Escape', blocks: 50, stars: 15, status: 'locked', desc: 'Volá por encima de toda la isla para completar la historia.' }
      ]
    },
    {
      id: 'espacial',
      name: 'Estación Espacial',
      shortTitle: 'Misión Espacial',
      subtitle: 'Viajá entre planetas y construí naves intergalácticas',
      badgeImg: 'assets/worlds/badge-estacion-espacial.png',
      islandImg: 'assets/worlds/island-estacion-espacial.png',
      buildPreview: 'assets/builds/build-rocket.jpg',
      palette: ['#00adef', '#8879b2', '#80298f', '#0071bb', '#122551', '#ed1d24'],
      accentColor: '#80298f',
      secondaryColor: '#00adef',
      bgGradient: 'linear-gradient(135deg, #122551 0%, #80298f 60%, #0071bb 100%)',
      completedMissions: 0,
      totalMissions: 6,
      starsEarned: 0,
      totalStars: 60,
      difficulty: 'Media-Alta',
      blocksRequired: 45,
      storyAudio4to6: '¡Despegamos hacia los anillos de Saturno! Tu avatar necesita un cohete Rasti para cruzar la lluvia de meteoritos.',
      storyText7to10: 'La base orbital necesita energía solar y un transbordador de rescate. Construí los módulos con tus bloques Rasti y escanealos para activar el lanzamiento.',
      missions: [
        { num: 1, title: 'Rampa de Lanzamiento', blocks: 18, stars: 10, status: 'locked', desc: 'Construí una base firme con bloques azules y rojos.' },
        { num: 2, title: 'Cohete Explorador X-1', blocks: 28, stars: 10, status: 'locked', desc: 'Armá el cohete con punta roja y alerones blancos.' },
        { num: 3, title: 'Rover Lunar Todo Terreno', blocks: 34, stars: 10, status: 'locked', desc: 'Un vehículo espacial para recorrer cráteres.' },
        { num: 4, title: 'Satélite de Comunicaciones', blocks: 30, stars: 10, status: 'locked', desc: 'Desplegá paneles solares amarillos simétricos.' },
        { num: 5, title: 'Laboratorio Orbital', blocks: 42, stars: 5, status: 'locked', desc: 'Módulo central para experimentos en gravedad cero.' },
        { num: 6, title: 'Portal Intergaláctico', blocks: 55, stars: 15, status: 'locked', desc: '¡Misión final! Construí el gran arco estelar.' }
      ]
    },
    {
      id: 'submarina',
      name: 'Expedición Submarina',
      shortTitle: 'Expedición Submarina',
      subtitle: 'Sumergite en arrecifes de coral junto a ballenas y submarinos',
      badgeImg: 'assets/worlds/badge-expedicion-submarina.png',
      islandImg: 'assets/worlds/island-expedicion-submarina.png',
      buildPreview: 'assets/builds/build-whale.jpg',
      palette: ['#00adef', '#ed1d24', '#8879b2', '#ffcb05', '#8cc63e', '#ec008b'],
      accentColor: '#00adef',
      secondaryColor: '#ec008b',
      bgGradient: 'linear-gradient(135deg, #0051ba 0%, #00adef 55%, #ec008b 100%)',
      completedMissions: 0,
      totalMissions: 6,
      starsEarned: 0,
      totalStars: 60,
      difficulty: 'Explorador',
      blocksRequired: 40,
      storyAudio4to6: '¡Glub, glub! Vamos a nadar con la ballena azul en nuestro submarino amarillo de bloques Rasti.',
      storyText7to10: 'En las profundidades del arrecife luminoso habitan especies increíbles. Construí el submarino de exploración y ayudá a proteger el océano.',
      missions: [
        { num: 1, title: 'Submarino Amarillo Rasti', blocks: 28, stars: 15, status: 'locked', desc: 'Con periscopio y hélices para explorar el fondo del mar.' },
        { num: 2, title: 'Gran Ballena Azul', blocks: 36, stars: 10, status: 'locked', desc: 'Construí a la gigante amigable de los océanos.' },
        { num: 3, title: 'Arrecife de Corales Mágicos', blocks: 30, stars: 10, status: 'locked', desc: 'Combiná todos los colores de tu kit de 400 bloques.' },
        { num: 4, title: 'Robot Limpiador de Océanos', blocks: 42, stars: 10, status: 'locked', desc: 'Un invento ecológico para cuidar el mar.' },
        { num: 5, title: 'Ciudad Atlántida Sumergida', blocks: 55, stars: 10, status: 'locked', desc: 'Cúpulas y túneles bajo el agua cristalina.' },
        { num: 6, title: 'Cofre del Tesoro Marino', blocks: 38, stars: 5, status: 'locked', desc: 'Descubrí la perla luminosa del océano Rasti.' }
      ]
    }
  ],

  // Opciones de Personalización (Página 3 del PDF + 7 Categorías del Prompt)
  customization: {
    skinTones: [
      { id: 1, name: 'Claro Cálido', hex: '#f9d6c1', filter: 'brightness(1.06) saturate(0.95)' },
      { id: 2, name: 'Trigueño Suave', hex: '#e5b38f', filter: 'none' },
      { id: 3, name: 'Canela Dorado', hex: '#c78c62', filter: 'sepia(0.18) brightness(0.95)' },
      { id: 4, name: 'Moreno Cálido', hex: '#885636', filter: 'sepia(0.32) brightness(0.86)' },
      { id: 5, name: 'Ébano Profundo', hex: '#432515', filter: 'sepia(0.45) brightness(0.76)' }
    ],
    eyeColors: [
      { id: 1, name: 'Castaño', hex: '#633716', ring: '#9c5a25' },
      { id: 2, name: 'Verde Esmeralda', hex: '#256c38', ring: '#48b566' },
      { id: 3, name: 'Azul Cielo', hex: '#0062cc', ring: '#38bdf8' },
      { id: 4, name: 'Gris Plata', hex: '#475569', ring: '#94a3b8' },
      { id: 5, name: 'Ámbar Miel', hex: '#92400e', ring: '#f59e0b' }
    ],
    hairColors: [
      { id: 1, name: 'Castaño Oscuro', hex: '#4a2912' },
      { id: 2, name: 'Castaño Claro', hex: '#855836' },
      { id: 3, name: 'Rubio Sol', hex: '#eab308' },
      { id: 4, name: 'Pelirrojo Fuego', hex: '#b43c12' },
      { id: 5, name: 'Negro Azabache', hex: '#1e1b18' },
      { id: 6, name: 'Coral Fantasía', hex: '#f46a6a' },
      { id: 7, name: 'Azul Rasti', hex: '#1d70db' }
    ],
    hairStyles: {
      boy: [
        { id: 1, name: 'Rulos Aventureros', img: 'assets/custom/hair-boy-1.png' },
        { id: 2, name: 'Flequillo Lacio', img: 'assets/custom/hair-boy-2.png' },
        { id: 3, name: 'Rubio Despeinado', img: 'assets/custom/hair-boy-3.png' },
        { id: 4, name: 'Ondas Cobrizas', img: 'assets/custom/hair-boy-4.png' },
        { id: 5, name: 'Afro Rizado', img: 'assets/custom/hair-boy-5.png' },
        { id: 6, name: 'Peinado Clásico', img: 'assets/custom/hair-boy-6.png' },
        { id: 7, name: 'Mechas Rebeldes', img: 'assets/custom/hair-boy-7.png' },
        { id: 8, name: 'Look con Gorra', img: 'assets/custom/hair-boy-8.png' }
      ],
      girl: [
        { id: 1, name: 'Largo con Hebilla', img: 'assets/custom/hair-girl-1.png' },
        { id: 2, name: 'Rodete Alto', img: 'assets/custom/hair-girl-2.png' },
        { id: 3, name: 'Ondas Doradas', img: 'assets/custom/hair-girl-3.png' },
        { id: 4, name: 'Dos Pompones Afro', img: 'assets/custom/hair-girl-4.png' },
        { id: 5, name: 'Dos Colitas', img: 'assets/custom/hair-girl-5.png' },
        { id: 6, name: 'Melena Media', img: 'assets/custom/hair-girl-6.png' },
        { id: 7, name: 'Rulos con Lentes', img: 'assets/custom/hair-girl-7.png' },
        { id: 8, name: 'Colita Alta', img: 'assets/custom/hair-girl-8.png' }
      ]
    },
    tops: {
      boy: [
        { id: 1, name: 'Chaleco Explorador', img: 'assets/custom/top-boy-1.png', locked: false },
        { id: 2, name: 'Buzo Rojo Rasti', img: 'assets/custom/top-boy-2.png', locked: false },
        { id: 3, name: 'Remera Bloque Rasti', img: 'assets/custom/top-boy-3.png', locked: false },
        { id: 4, name: 'Campera Amarilla', img: 'assets/custom/top-boy-4.png', locked: false },
        { id: 5, name: 'Buzo Dino Azul', img: 'assets/custom/top-boy-5.png', locked: false },
        { id: 6, name: 'Parka de la Selva', img: 'assets/custom/top-boy-6.png', locked: true, cost: 15 },
        { id: 7, name: 'Hoodie Galáctico', img: 'assets/custom/top-boy-7.png', locked: true, cost: 20 }
      ],
      girl: [
        { id: 1, name: 'Buzo Pastel Rayado', img: 'assets/custom/top-girl-1.png', locked: false },
        { id: 2, name: 'Campera Rosa', img: 'assets/custom/top-girl-2.png', locked: false },
        { id: 3, name: 'Remera Flores', img: 'assets/custom/top-girl-3.png', locked: false },
        { id: 4, name: 'Sweater Estrella', img: 'assets/custom/top-girl-4.png', locked: false },
        { id: 5, name: 'Campera de Jean', img: 'assets/custom/top-girl-5.png', locked: false },
        { id: 6, name: 'Sweater Margarita', img: 'assets/custom/top-girl-6.png', locked: false },
        { id: 7, name: 'Hoodie Violeta', img: 'assets/custom/top-girl-7.png', locked: true, cost: 15 }
      ]
    },
    bottoms: {
      boy: [
        { id: 1, name: 'Cargo Arena', img: 'assets/custom/bottom-boy-1.png', locked: false },
        { id: 2, name: 'Bermuda de Jean', img: 'assets/custom/bottom-boy-2.png', locked: false },
        { id: 3, name: 'Jogger Oscuro', img: 'assets/custom/bottom-boy-3.png', locked: false },
        { id: 4, name: 'Cargo Verde Isla', img: 'assets/custom/bottom-boy-4.png', locked: false },
        { id: 5, name: 'Pantalón Montaña', img: 'assets/custom/bottom-boy-5.png', locked: false },
        { id: 6, name: 'Short Deportivo', img: 'assets/custom/bottom-boy-6.png', locked: true, cost: 10 },
        { id: 7, name: 'Pantalón Espacial', img: 'assets/custom/bottom-boy-7.png', locked: true, cost: 15 }
      ],
      girl: [
        { id: 1, name: 'Jean Cargo Corazón', img: 'assets/custom/bottom-girl-1.png', locked: false },
        { id: 2, name: 'Cargo Verde Selva', img: 'assets/custom/bottom-girl-2.png', locked: false },
        { id: 3, name: 'Pantalón Rosa Pop', img: 'assets/custom/bottom-girl-3.png', locked: false },
        { id: 4, name: 'Pollera de Jean', img: 'assets/custom/bottom-girl-4.png', locked: false },
        { id: 5, name: 'Pollera Tablas', img: 'assets/custom/bottom-girl-5.png', locked: false },
        { id: 6, name: 'Short Violeta', img: 'assets/custom/bottom-girl-6.png', locked: false },
        { id: 7, name: 'Jean Clásico', img: 'assets/custom/bottom-girl-7.png', locked: true, cost: 10 }
      ]
    },
    specialSuits: [
      { id: 1, name: 'Traje Astronauta', world: 'Estación Espacial', img: 'assets/custom/suit-1.png', locked: false },
      { id: 2, name: 'Traje Explorador', world: 'Isla Misteriosa', img: 'assets/custom/suit-2.png', locked: true, cost: 25 },
      { id: 3, name: 'Traje Submarino', world: 'Expedición Submarina', img: 'assets/custom/suit-3.png', locked: true, cost: 25 }
    ],
    accessories: [
      { id: 1, name: 'Gorra Rasti', img: 'assets/custom/acc-1.png', locked: false, type: 'accesorio' },
      { id: 2, name: 'Sombrero Safari', img: 'assets/custom/acc-2.png', locked: true, cost: 15, type: 'accesorio' },
      { id: 3, name: 'Visor Espacial', img: 'assets/custom/acc-3.png', locked: true, cost: 15, type: 'accesorio' },
      { id: 4, name: 'Auriculares Gamer', img: 'assets/custom/acc-4.png', locked: false, type: 'accesorio' },
      { id: 6, name: 'Cuello Aventurero', img: 'assets/custom/acc-6.png', locked: true, cost: 10, type: 'accesorio' }
    ],
    backpacks: [
      { id: 5, name: 'Mochila Explorador', img: 'assets/custom/acc-5.png', locked: false, desc: 'Llevá tus bloques a todas partes', color: '#0051ba' },
      { id: 101, name: 'Jetpack Espacial', img: 'assets/ui/isotipo-rasti.png', locked: false, desc: 'Propulsión con bloques Rasti', color: '#80298f' },
      { id: 102, name: 'Mochila Kit 400', img: 'assets/ui/icon-gift.png', locked: false, desc: 'Capacidad para 400 piezas', color: '#ed1d24' },
      { id: 103, name: 'Tanque Submarino', img: 'assets/ui/icon-compass.png', locked: true, cost: 20, desc: 'Oxígeno para bucear en corales', color: '#00adef' }
    ]
  },

  // 4 Modos de Juego Principales (Sección MODOS)
  gameModes: [
    {
      id: 'aventura',
      title: 'Modo Aventura',
      badge: 'EJE PRINCIPAL • 4 MUNDOS',
      badgeColor: '#ed1d24',
      ageTag: '4-6 y 7-10 años',
      heroImg: 'assets/ui/card-modo-aventura.png',
      iconImg: 'assets/ui/icon-compass.png',
      btnText: 'EXPLORAR MUNDOS',
      btnStyle: 'primary',
      description: 'Participá en 4 historias interactivas: Estación Espacial, Isla Misteriosa, Reino Perdido y Expedición Submarina. Resolvé cada nivel construyendo con tus bloques físicos Rasti, escanealos con la cámara y desbloqueá tu película animada.',
      features: ['24 misiones progresivas', 'Reconocimiento visual por cámara', 'Cuento audiovisual con tus creaciones'],
      color: '#0051ba'
    },
    {
      id: 'desafios',
      title: 'Desafíos Rasti',
      badge: 'RETOS SEMANALES',
      badgeColor: '#ffcb05',
      ageTag: 'Adaptado por edad',
      heroImg: 'assets/builds/build-supercar.jpg',
      iconImg: 'assets/ui/icon-brick.png',
      btnText: 'CONSTRUIR AHORA',
      btnStyle: 'build',
      description: 'Poné a prueba tu ingenio con desafíos de construcción por cantidad de piezas, colores o formas. Para 4 a 6 años incluye guía narrada por tu avatar; para 7 a 10 años suma acertijos de ingeniería.',
      features: ['Retos de 20, 40 y 60 bloques', 'Instrucciones narradas por voz', 'Recompensas dobles de estrellas ⭐'],
      color: '#ed1d24'
    },
    {
      id: 'libre',
      title: 'Laboratorio Libre',
      badge: '100% IMAGINACIÓN',
      badgeColor: '#8dc63f',
      ageTag: 'Todas las edades',
      heroImg: 'assets/builds/build-treehouse.jpg',
      iconImg: 'assets/ui/icon-bulb.png',
      btnText: 'CREAR LIBREMENTE',
      btnStyle: 'create',
      description: '¡Sin instrucciones ni límites! Usá las 400 piezas de tu kit físico Rasti para inventar tus propios vehículos, animales o edificios. Sacales una foto para guardarlos en tu álbum digital.',
      features: ['Álbum digital de inventos', 'Ideas disparadoras aleatorias', 'Plantillas de inspiración Rasti'],
      color: '#047e48'
    },
    {
      id: 'familia',
      title: 'Familia Rasti',
      badge: 'COMUNIDAD SEGURA +6',
      badgeColor: '#00adef',
      ageTag: '+6 años • Moderado',
      heroImg: 'assets/ui/card-familia-rasti.png',
      iconImg: 'assets/ui/icon-gift.png',
      btnText: 'ABRIR GALERÍA',
      btnStyle: 'yellow',
      description: 'Descubrí las construcciones de otros chicos, votá tus favoritas con un ❤️ y compartí fotos de tus bloques en un entorno 100% seguro: sin chat, con nombres protegidos, filtro automático y moderación humana.',
      features: ['Galería de creaciones reales', 'Filtro IA + Moderador humano', 'Control parental para adultos'],
      color: '#00246b'
    }
  ],

  // Publicaciones de la Galería "Familia Rasti" (Página 4 Pantalla 3 del PDF)
  familiaGallery: [
    {
      id: 1,
      author: '@Lordlyburrito71',
      avatar: 'assets/avatars/avatar-1.png',
      title: 'Castillo Real de las 4 Torres',
      world: 'Reino Perdido',
      img: 'assets/builds/build-castle.jpg',
      likes: 1200,
      likesDisplay: '1.2K',
      liked: true,
      saved: false,
      blocksUsed: 145,
      category: 'galería'
    },
    {
      id: 2,
      author: '@FlorPop26',
      avatar: 'assets/avatars/avatar-2.png',
      title: 'Jardín Botánico Multicolor',
      world: 'Creación Libre',
      img: 'assets/builds/build-flowers.jpg',
      likes: 852,
      likesDisplay: '852',
      liked: false,
      saved: true,
      blocksUsed: 95,
      category: 'galería'
    },
    {
      id: 3,
      author: '@LordDragoncito',
      avatar: 'assets/avatars/avatar-3.png',
      title: 'Supercar Relámpago Amarillo',
      world: 'Desafíos Rasti',
      img: 'assets/builds/build-supercar.jpg',
      likes: 974,
      likesDisplay: '974',
      liked: true,
      saved: true,
      blocksUsed: 120,
      category: 'desafíos'
    },
    {
      id: 4,
      author: '@BurritoGalactico',
      avatar: 'assets/avatars/avatar-4.png',
      title: 'Perrito Beagle Guardián',
      world: 'Amigos',
      img: 'assets/builds/build-dog.jpg',
      likes: 689,
      likesDisplay: '689',
      liked: false,
      saved: false,
      blocksUsed: 88,
      category: 'amigos'
    },
    {
      id: 5,
      author: '@DinoExplorador99',
      avatar: 'assets/avatars/avatar-5.png',
      title: 'T-Rex Rey de la Selva',
      world: 'Isla Misteriosa',
      img: 'assets/builds/build-dino.jpg',
      likes: 1500,
      likesDisplay: '1.5K',
      liked: true,
      saved: false,
      blocksUsed: 132,
      category: 'desafíos'
    },
    {
      id: 6,
      author: '@PandaEspacial',
      avatar: 'assets/avatars/avatar-6.png',
      title: 'Casa del Árbol Secreta',
      world: 'Isla Misteriosa',
      img: 'assets/builds/build-treehouse.jpg',
      likes: 1120,
      likesDisplay: '1.1K',
      liked: false,
      saved: true,
      blocksUsed: 160,
      category: 'amigos'
    },
    {
      id: 7,
      author: '@GatoEspacial7',
      avatar: 'assets/avatars/avatar-7.png',
      title: 'Cohete Despegue Lunar',
      world: 'Estación Espacial',
      img: 'assets/builds/build-rocket.jpg',
      likes: 940,
      likesDisplay: '940',
      liked: false,
      saved: false,
      blocksUsed: 110,
      category: 'galería'
    },
    {
      id: 8,
      author: '@CoralSubmarino',
      avatar: 'assets/avatars/avatar-8.png',
      title: 'Gran Ballena Azul del Arrecife',
      world: 'Expedición Submarina',
      img: 'assets/builds/build-whale.jpg',
      likes: 780,
      likesDisplay: '780',
      liked: true,
      saved: false,
      blocksUsed: 105,
      category: 'noticias'
    }
  ],

  // Datos de la sección LOGROS (Medallas, Construcciones, Desafíos Superados, Progreso)
  achievements: {
    summary: {
      starsTotal: 120,
      starsGoal: 150,
      medalsUnlocked: 6,
      medalsTotal: 8,
      buildsCompleted: 12,
      worldsExplored: 4,
      challengesPassed: 9,
      overallProgress: 68
    },
    medals: [
      { id: 1, title: 'Primer Encastre', desc: 'Completaste y escaneaste tu primera construcción física Rasti.', icon: '🧱', color: '#ed1d24', unlocked: true, date: 'Desbloqueada' },
      { id: 2, title: 'Piloto Galáctico', desc: 'Superaste 5 misiones en el mundo Estación Espacial.', icon: '🚀', color: '#80298f', unlocked: true, date: 'Desbloqueada' },
      { id: 3, title: 'Explorador de la Isla', desc: 'Construiste el Dino T-Rex y el Puente de la Cascada.', icon: '🦖', color: '#047e48', unlocked: true, date: 'Desbloqueada' },
      { id: 4, title: 'Arquitecto Real', desc: 'Levantaste las torres del Castillo en el Reino Perdido.', icon: '🏰', color: '#ffcb05', unlocked: true, date: 'Desbloqueada' },
      { id: 5, title: 'Amigo de Familia Rasti', desc: 'Compartiste una creación aprobada por moderación y diste 10 ❤️.', icon: '💝', color: '#00adef', unlocked: true, date: 'Desbloqueada' },
      { id: 6, title: 'Estilo Único', desc: 'Personalizaste tu avatar con ropa, peinado y mochila de aventura.', icon: '🎨', color: '#f5821f', unlocked: true, date: 'Desbloqueada' },
      { id: 7, title: 'Capitán de los Mares', desc: 'Completá las 6 misiones de Expedición Submarina.', icon: '🐳', color: '#0051ba', unlocked: false, date: 'Faltan 5 misiones' },
      { id: 8, title: 'Maestro 400 Bloques', desc: 'Usá las 400 piezas del kit físico en una mega construcción.', icon: '👑', color: '#ffe600', unlocked: false, date: '310 / 400 bloques' }
    ],
    completedBuilds: [
      { id: 1, name: 'Cohete Explorador X-1', world: 'Estación Espacial', img: 'assets/builds/build-rocket.jpg', blocks: 28, stars: 10, precision: '98%' },
      { id: 2, name: 'Castillo Real Rasti', world: 'Reino Perdido', img: 'assets/builds/build-castle.jpg', blocks: 65, stars: 15, precision: '96%' },
      { id: 3, name: 'Amigo Dino T-Rex', world: 'Isla Misteriosa', img: 'assets/builds/build-dino.jpg', blocks: 38, stars: 10, precision: '97%' },
      { id: 4, name: 'Supercar Amarillo', world: 'Desafíos Rasti', img: 'assets/builds/build-supercar.jpg', blocks: 54, stars: 15, precision: '95%' },
      { id: 5, name: 'Refugio Casa del Árbol', world: 'Isla Misteriosa', img: 'assets/builds/build-treehouse.jpg', blocks: 48, stars: 10, precision: '99%' },
      { id: 6, name: 'Gran Ballena Azul', world: 'Expedición Submarina', img: 'assets/builds/build-whale.jpg', blocks: 36, stars: 15, precision: '96%' }
    ],
    challenges: [
      { id: 1, title: 'Racha de Constructor: 5 días seguidos', progress: 5, total: 5, reward: 15, status: 'claimable', icon: '🔥' },
      { id: 2, title: 'Escaneá 12 construcciones físicas con la cámara', progress: 12, total: 12, reward: 20, status: 'completed', icon: '📷' },
      { id: 3, title: 'Explorá los 4 mundos de Modo Aventura', progress: 4, total: 4, reward: 25, status: 'completed', icon: '🗺️' },
      { id: 4, title: 'Completá todas las misiones de Estación Espacial', progress: 5, total: 6, reward: 30, status: 'in_progress', icon: '🛸' }
    ]
  }
};
