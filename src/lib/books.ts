export type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  year: number;
  cover?: string;
  description?: string;
};

const books: Book[] = [
  {
    id: 1,
    title: 'De Verborgen Bibliotheek',
    author: 'A. Jansen',
    category: 'Fictie',
    year: 1998,
    cover: '/static/placeholder-book.png',
    description: 'Een mysterie dat zich afspeelt tussen de boekenplanken.'
  },
  {
    id: 2,
    title: 'Geschiedenis van Avontuur',
    author: 'B. van Dijk',
    category: 'Geschiedenis',
    year: 2005,
    cover: '/static/placeholder-book.png',
    description: 'Een overzicht van ontdekkingsreizigers en locaties.'
  },
  {
    id: 3,
    title: 'Korte Verhalen Voor Avond',
    author: 'C. de Vries',
    category: 'Fictie',
    year: 2018,
    cover: '/static/placeholder-book.png',
    description: 'Een bundel korte, intieme vertellingen.'
  },
  {
    id: 4,
    title: 'Programmeren in Svelte',
    author: 'D. Bakker',
    category: 'Techniek',
    year: 2023,
    cover: '/static/placeholder-book.png',
    description: 'Praktische gids voor moderne Svelte apps.'
  },
  {
    id: 5,
    title: 'Oude Legendes',
    author: 'E. Visser',
    category: 'Cultuur',
    year: 1975,
    cover: '/static/placeholder-book.png',
    description: 'Een collectie mythen en sagen van vroeger.'
  },
  {
    id: 6,
    title: 'The Rebel and the Rose',
    author: 'Catherine Doyle',
    category: 'Fictie',
    year: 2019,
    cover: '/static/covers/rebel-rose.svg',
    description: 'Een historische roman vol romance, rebellie en avontuur.'
  }
];

export default books;
