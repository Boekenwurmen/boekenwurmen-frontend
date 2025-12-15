export type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  year: number;
  cover?: string;
  pdf?: string;
  description?: string;
};

const books: Book[] = [
  {
    id: 1,
    title: 'De Verborgen Bibliotheek',
    author: 'A. Jansen',
    category: 'Fictie',
    year: 1998,
    cover: '/static/covers/verborgen-bibliotheek.svg',
    description: 'Een mysterie dat zich afspeelt tussen de boekenplanken.'
  },
  {
    id: 2,
    title: 'Geschiedenis van Avontuur',
    author: 'B. van Dijk',
    category: 'Geschiedenis',
    year: 2005,
    cover: '/static/covers/geschiedenis-avontuur.svg',
    description: 'Een overzicht van ontdekkingsreizigers en locaties.'
  },
  {
    id: 3,
    title: 'Korte Verhalen Voor Avond',
    author: 'C. de Vries',
    category: 'Fictie',
    year: 2018,
    cover: '/static/covers/korte-verhalen.svg',
    description: 'Een bundel korte, intieme vertellingen.'
  },
  {
    id: 4,
    title: 'Programmeren in Svelte',
    author: 'D. Bakker',
    category: 'Techniek',
    year: 2023,
    cover: '/static/covers/programmeren-svelte.svg',
    description: 'Praktische gids voor moderne Svelte apps.'
  },
  {
    id: 5,
    title: 'Oude Legendes',
    author: 'E. Visser',
    category: 'Cultuur',
    year: 1975,
    cover: '/static/covers/oude-legendes.svg',
    description: 'Een collectie mythen en sagen van vroeger.'
  },
  {
    id: 6,
    title: 'The Rebel and the Rose',
    author: 'Catherine Doyle',
    category: 'Fictie',
    year: 2019,
    cover: '/static/covers/rebel-rose.svg',
    pdf: '/static/covers/the-rebel-and-the-rose.pdf',
    description: 'Een historische roman vol romance, rebellie en avontuur.'
  },
  {
    id: 7,
    title: 'De Race Tegen de Tijd',
    author: 'ChatGPT',
    category: 'Fictie',
    year: 2025,
    cover: '/static/placeholder-book.png',
    pdf: '/read?book=1',
    description: 'Een tijdreiziger wordt in de middeleeuwen gekatapulteerd met slechts één uur om een geheim document te vinden dat de toekomst kan redden. Elke keuze telt, want wanneer de timer afloopt, verdwijn je terug naar het heden.',
  }
];

export default books;
