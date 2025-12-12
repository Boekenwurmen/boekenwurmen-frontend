<script lang="ts">
  import books from '../../lib/books';
  import type { Book } from '../../lib/books';
  import { writable, derived } from 'svelte/store';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  const allBooks: Book[] = books;
  let favorites: number[] = [];

  const search = writable('');
  const category = writable('All');
  const sort = writable('newest');
  const showOnlyFavorites = writable(false);

  const categories = ['All', ...Array.from(new Set(allBooks.map(b => b.category)))];

  onMount(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      favorites = JSON.parse(saved);
    }
  });

  function logout() {
    try {
      localStorage.removeItem('auth');
    } catch {}
    goto('/login');
  }

  function toggleFavorite(bookId: number) {
    if (favorites.includes(bookId)) {
      favorites = favorites.filter(id => id !== bookId);
    } else {
      favorites = [...favorites, bookId];
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  const filtered = derived([search, category, sort, showOnlyFavorites], ([$search, $category, $sort, $showFavs]) => {
    const q = $search.trim().toLowerCase();
    let list = allBooks.filter(b => {
      const matchesQuery = q === '' || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q);
      const matchesCategory = $category === 'All' || b.category === $category;
      const matchesFav = !$showFavs || favorites.includes(b.id);
      return matchesQuery && matchesCategory && matchesFav;
    });

    list = list.sort((a, b) => $sort === 'newest' ? b.year - a.year : a.year - b.year);
    return list;
  });
</script>

<main class="library-page">
  <header class="toolbar">
    <h2>📚 Fantasie Bibliotheek</h2>
    <div class="controls">
      <button class="chip" on:click={logout} aria-label="Uitloggen">↪ Uitloggen</button>
      <div class="search-wrap">
        <input
          type="search"
          placeholder="Zoek titel, auteur of beschrijving..."
          on:input={(e) => search.set(e.currentTarget.value)}
          aria-label="Zoek boeken"
        />
        <button class="clear" on:click={() => search.set('')} aria-label="Wis zoekopdracht">✕</button>
      </div>

      <div class="filters">
        <div class="chips">
          <button class="chip { $showOnlyFavorites ? 'active' : '' }" on:click={() => showOnlyFavorites.set(!$showOnlyFavorites)}>♥ Favorieten</button>
          {#each categories as c}
            <button class="chip { $category === c ? 'active' : '' }" on:click={() => category.set(c)}>{c}</button>
          {/each}
        </div>

        <div class="sort-wrap">
          <label for="sort" class="sr-only">Sorteer</label>
          <select id="sort" on:change={(e) => sort.set((e.target as HTMLSelectElement).value)} aria-label="Sorteer">
            <option value="newest">Nieuwste eerst</option>
            <option value="oldest">Oudste eerst</option>
          </select>
        </div>
      </div>
    </div>
  </header>

  <section class="results">
    {#if $filtered.length === 0}
      <div class="empty">✨ Geen boeken gevonden in je bibliotheek...</div>
    {:else}
      <div class="grid">
        {#each $filtered as book}
          <a href="/library/{book.id}" class="card-link">
            <article class="card">
              <button class="favorite-btn" on:click|preventDefault={() => toggleFavorite(book.id)} class:is-favorite={favorites.includes(book.id)} aria-label={favorites.includes(book.id) ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}>♥</button>
              <div
                class="cover"
                role="img"
                aria-label={book.title}
                style="background-image: url('{book.cover}');"
              >
                {#if !book.cover}
                  <div class="fake-cover">{book.title}</div>
                {/if}
              </div>
            <div class="meta">
              <h3>{book.title}</h3>
              <p class="author">{book.author} <span class="year">· {book.year}</span></p>
              <p class="category">{book.category}</p>
              <p class="desc">{book.description}</p>
            </div>
            </article>
          </a>
        {/each}
      </div>
    {/if}
  </section>
</main>

<style>
  .library-page{padding:2.4rem;min-height:100vh;color:var(--text,#111);font-family:'Georgia', serif;background:linear-gradient(135deg,#2a1f1a 0%,#1a1a2e 50%,#16213e 100%);position:relative;overflow:hidden}
  
  .library-page::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background-image:radial-gradient(circle at 20% 50%, rgba(214,185,106,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(107,62,43,0.04) 0%, transparent 50%);pointer-events:none;z-index:0}

  .library-page > *{position:relative;z-index:1}

  .toolbar{display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem;background:rgba(26,26,46,0.6);padding:1.5rem;border-radius:12px;border:1px solid rgba(214,185,106,0.2);backdrop-filter:blur(10px)}
  .toolbar h2{margin:0;font-size:2rem;color:var(--gold,#d6b96a);letter-spacing:2px;text-shadow:0 2px 8px rgba(0,0,0,0.5);font-weight:700}

  .controls{display:flex;gap:1rem;align-items:center;justify-content:space-between}
  .search-wrap{position:relative;flex:1;max-width:640px}
  .search-wrap input{width:100%;padding:0.9rem 2.8rem 0.9rem 1rem;border-radius:8px;border:2px solid rgba(214,185,106,0.3);box-shadow:0 4px 12px rgba(0,0,0,0.3),inset 0 2px 4px rgba(0,0,0,0.1);background:rgba(245,243,240,0.95);color:#333;font-size:0.95rem;transition:all .2s}
  .search-wrap input:focus{border-color:var(--gold,#d6b96a);box-shadow:0 0 16px rgba(214,185,106,0.4),inset 0 2px 4px rgba(0,0,0,0.1)}
  .search-wrap input::placeholder{color:#aaa}
  .search-wrap .clear{position:absolute;right:.6rem;top:50%;transform:translateY(-50%);background:transparent;border:0;padding:.35rem .6rem;border-radius:6px;cursor:pointer;color:#999;font-weight:bold;font-size:1.2rem}
  .search-wrap .clear:hover{color:#d6b96a}

  .filters{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
  .chips{display:flex;gap:.6rem;flex-wrap:wrap}
  .chip{background:rgba(245,243,240,0.1);border:2px solid rgba(214,185,106,0.25);padding:.45rem .9rem;border-radius:24px;cursor:pointer;color:#d6b96a;font-size:.9rem;transition:all .25s;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;backdrop-filter:blur(5px)}
  .chip:hover{border-color:var(--gold,#d6b96a);background:rgba(214,185,106,0.1);box-shadow:0 0 12px rgba(214,185,106,0.2)}
  .chip.active{background:var(--gold,#d6b96a);color:#2a1f1a;border-color:transparent;box-shadow:0 8px 24px rgba(214,185,106,0.35);font-weight:700}

  .sort-wrap select{padding:.6rem .8rem;border-radius:8px;border:2px solid rgba(214,185,106,0.3);background:rgba(245,243,240,0.95);color:#333;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit}
  .sort-wrap select:focus{border-color:var(--gold,#d6b96a);box-shadow:0 0 12px rgba(214,185,106,0.3)}

  .results .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:2rem;padding:1rem 0}

  .card-link{text-decoration:none;color:inherit;display:block;perspective:1000px}
  .card{background:linear-gradient(135deg,rgba(245,243,240,0.95) 0%,rgba(250,249,247,0.95) 100%);border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.5);overflow:hidden;display:flex;flex-direction:column;transition:transform .3s cubic-bezier(0.34, 1.56, 0.64, 1),box-shadow .3s;cursor:pointer;border:1px solid rgba(214,185,106,0.2);position:relative}
  .card::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(214,185,106,0) 0%,rgba(0,0,0,0.05) 100%);pointer-events:none}
  .card-link:hover .card,.card-link:focus .card{transform:translateY(-12px) rotateX(2deg);box-shadow:0 20px 48px rgba(214,185,106,0.2),0 0 32px rgba(214,185,106,0.1),inset 0 1px 0 rgba(255,255,255,0.5)}

  .favorite-btn{position:absolute;top:0.8rem;right:0.8rem;width:2.4rem;height:2.4rem;border-radius:50%;background:linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,243,240,0.9));border:2px solid rgba(214,185,106,0.4);color:#d6b96a;font-size:1.1rem;cursor:pointer;z-index:10;transition:all .25s;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.15)}
  .favorite-btn:hover{background:linear-gradient(135deg,rgba(214,185,106,0.2),rgba(214,185,106,0.1));border-color:#d6b96a;box-shadow:0 6px 16px rgba(214,185,106,0.3)}
  .favorite-btn.is-favorite{background:linear-gradient(135deg,rgba(216,82,51,0.2),rgba(216,82,51,0.1));color:#d85233;border-color:#d85233;box-shadow:0 6px 16px rgba(216,82,51,0.2)}

  .cover{height:200px;background-size:cover;background-position:center;display:flex;align-items:flex-end;justify-content:flex-start;padding:1.2rem;background:linear-gradient(135deg,#3d2817 0%,#2a1f1a 100%);position:relative;overflow:hidden}
  .cover::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.3) 100%);pointer-events:none}
  .fake-cover{background:linear-gradient(135deg,var(--cover,#6b3e2b),var(--cover-dark,#56311f));color:var(--gold,#d6b96a);padding:.8rem 1rem;border-radius:8px;font-weight:700;font-size:0.95rem;text-align:center;position:relative;z-index:1;box-shadow:0 4px 8px rgba(0,0,0,0.2)}

  .meta{padding:1.4rem;display:flex;flex-direction:column;gap:.5rem;flex:1}
  .meta h3{margin:0;font-size:1.1rem;color:#2b2b2b;font-weight:700;line-height:1.3}
  .author{margin:0;color:#6b5d52;font-size:.95rem;font-style:italic;font-weight:500}
  .category{font-size:.8rem;color:var(--cover-dark,#5a351f);font-weight:700;background:linear-gradient(135deg,rgba(214,185,106,0.15),rgba(214,185,106,0.05));padding:.3rem .6rem;border-radius:5px;display:inline-block;width:fit-content;text-transform:uppercase;letter-spacing:0.5px}
  .desc{margin-top:.4rem;font-size:.9rem;color:#555;line-height:1.5;flex:1}

  .empty{color:#b8a896;background:linear-gradient(135deg,rgba(245,243,240,0.1),rgba(214,185,106,0.05));padding:2.5rem;border-radius:12px;text-align:center;border:2px dashed rgba(214,185,106,0.25);backdrop-filter:blur(5px);font-size:1.1rem;font-weight:500}

  @media (max-width:900px){
    .controls{flex-direction:column;align-items:stretch}
    .toolbar{gap:.8rem}
    .filters{flex-direction:column;align-items:stretch}
    .chips{width:100%}
    .results .grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.5rem}
  }

</style>
