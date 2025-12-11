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
    <h2>Bibliotheek</h2>
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
      <div class="empty">Geen boeken gevonden.</div>
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
  .library-page{padding:2.4rem;min-height:100vh;color:var(--text,#111);font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;background:linear-gradient(135deg,#f5f3f0 0%,#faf9f7 50%,#f0ebe5 100%)}

  .toolbar{display:flex;flex-direction:column;gap:.8rem;margin-bottom:1.25rem}
  .toolbar h2{margin:0;font-size:1.4rem;color:var(--cover-dark,#5a351f);letter-spacing:1px}

  .controls{display:flex;gap:1rem;align-items:center;justify-content:space-between}
  .search-wrap{position:relative;flex:1;max-width:640px}
  .search-wrap input{width:100%;padding:.8rem 2.6rem .8rem .9rem;border-radius:10px;border:1px solid rgba(107,62,43,0.2);box-shadow:0 4px 12px rgba(107,62,43,0.08);background:#fff}
  .search-wrap input::placeholder{color:#aaa}
  .search-wrap .clear{position:absolute;right:.4rem;top:50%;transform:translateY(-50%);background:transparent;border:0;padding:.35rem .6rem;border-radius:6px;cursor:pointer;color:#999;font-weight:bold}
  .search-wrap .clear:hover{color:#666}

  .filters{display:flex;gap:1rem;align-items:center}
  .chips{display:flex;gap:.5rem;flex-wrap:wrap}
  .chip{background:#fff;border:2px solid rgba(107,62,43,0.15);padding:.35rem .7rem;border-radius:20px;cursor:pointer;color:#5a351f;font-size:.9rem;transition:all .2s;font-weight:500}
  .chip:hover{border-color:rgba(214,185,106,0.4);background:rgba(214,185,106,0.05)}
  .chip.active{background:var(--gold,#d6b96a);color:#fff;border-color:transparent;box-shadow:0 6px 18px rgba(214,185,106,0.2);font-weight:600}

  .sort-wrap select{padding:.45rem .6rem;border-radius:8px;border:1px solid rgba(107,62,43,0.15);background:#fff;color:#333;font-weight:500}

  .results .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.5rem}

  .card-link{text-decoration:none;color:inherit;display:block}
  .card{background:linear-gradient(135deg,#fff 0%,#fefdfb 100%);border-radius:12px;box-shadow:0 8px 24px rgba(107,62,43,0.1);overflow:hidden;display:flex;flex-direction:column;transition:transform .22s cubic-bezier(.2,.9,.3,1),box-shadow .22s;cursor:pointer;border:1px solid rgba(214,185,106,0.1);position:relative}
  .card-link:hover .card,.card-link:focus .card{transform:translateY(-10px);box-shadow:0 16px 40px rgba(107,62,43,0.15)}

  .favorite-btn{position:absolute;top:0.5rem;right:0.5rem;width:2.2rem;height:2.2rem;border-radius:50%;background:rgba(255,255,255,0.9);border:2px solid rgba(214,185,106,0.3);color:#d6b96a;font-size:1rem;cursor:pointer;z-index:10;transition:all .2s;display:flex;align-items:center;justify-content:center}
  .favorite-btn:hover{background:rgba(214,185,106,0.1);border-color:#d6b96a}
  .favorite-btn.is-favorite{background:rgba(214,185,106,0.2);color:#d85233;border-color:#d85233}

  .cover{height:180px;background-size:cover;background-position:center;display:flex;align-items:flex-end;justify-content:flex-start;padding:1rem;background:linear-gradient(135deg,#f0ebe5 0%,#e8e0d8 100%)}
  .fake-cover{background:linear-gradient(135deg,var(--cover,#6b3e2b),var(--cover-dark,#56311f));color:var(--gold,#d6b96a);padding:.6rem .8rem;border-radius:6px;font-weight:700}

  .meta{padding:1.2rem;display:flex;flex-direction:column;gap:.4rem}
  .meta h3{margin:0;font-size:1.05rem;color:#2b2b2b;font-weight:600}
  .author{margin:0;color:#7a6f66;font-size:.92rem;font-weight:500}
  .category{font-size:.82rem;color:var(--cover-dark,#5a351f);font-weight:600;background:rgba(214,185,106,0.08);padding:.25rem .5rem;border-radius:4px;display:inline-block;width:fit-content}
  .desc{margin-top:.25rem;font-size:.9rem;color:#666;line-height:1.4}

  .empty{color:#8b7a6f;background:linear-gradient(135deg,#fff,#fefdfb);padding:2rem;border-radius:12px;text-align:center;border:2px dashed rgba(107,62,43,0.15)}

  @media (max-width:900px){
    .controls{flex-direction:column;align-items:stretch}
    .toolbar{gap:.6rem}
  }

</style>
