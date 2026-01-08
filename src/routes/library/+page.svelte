<script lang="ts">
  import books from '../../lib/books';
  import type { Book } from '../../lib/books';
  import { writable, derived } from 'svelte/store';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Book3d from "../../lib/components/book3d.svelte";

  const allBooks: Book[] = books;
  let favorites: number[] = [];
  let showFilters = $state(false);
  let menuOpen = false;
  let currentPage = $state(1);
  const itemsPerPage = 12;

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

  const paginatedBooks = derived(filtered, ($filtered) => {
    currentPage = 1;
    const start = (currentPage - 1) * itemsPerPage;
    return $filtered.slice(start, start + itemsPerPage);
  });

  const totalPages = derived(filtered, ($filtered) => Math.ceil($filtered.length / itemsPerPage));

  function nextPage() {
    const pages = Math.ceil($filtered.length / itemsPerPage);
    if (currentPage < pages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  const displayBooks = $derived.by(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const allFiltered = $filtered;
    return allFiltered.slice(start, end);
  });
</script>

<main class="library-page">
  <header class="toolbar">
    <div class="toolbar-top">
      <h2>📚 Fantasie Bibliotheek</h2>
      <button class="chip" onclick={logout} aria-label="Uitloggen">↪ Uitloggen</button>
    </div>

    <div class="controls">
      <button class="chip filter-toggle" onclick={() => showFilters = !showFilters} aria-label="Filters tonen">
        🔍 Filters {showFilters ? '✕' : '▼'}
      </button>

      <div class="search-wrap">
        <input
          type="search"
          placeholder="Zoek titel, auteur of beschrijving..."
          oninput={(e) => search.set(e.currentTarget.value)}
          aria-label="Zoek boeken"
        />
        <button class="clear" onclick={() => search.set('')} aria-label="Wis zoekopdracht">✕</button>
      </div>

      <div class="filters {showFilters ? 'show' : ''}">
        {#if showFilters}
          <div class="filter-overlay" role="button" tabindex="0" onclick={() => showFilters = false} onkeydown={(e) => (e.key === 'Escape' || e.key === 'Enter') && (showFilters = false)}></div>
        {/if}

        <div class="filter-content">
          <div class="filter-header">
            <h3>Filters</h3>
            <button class="close-filters" onclick={() => showFilters = false} aria-label="Sluit filters">✕</button>
          </div>

          <div class="chips">
            <button class="chip { $showOnlyFavorites ? 'active' : '' }" onclick={() => showOnlyFavorites.set(!$showOnlyFavorites)}>♥ Favorieten</button>
            {#each categories as c}
              <button class="chip { $category === c ? 'active' : '' }" onclick={() => category.set(c)}>{c}</button>
            {/each}
          </div>

          <div class="sort-wrap">
            <label for="sort" class="sr-only">Sorteer</label>
            <select id="sort" onchange={(e) => sort.set((e.target as HTMLSelectElement).value)} aria-label="Sorteer">
              <option value="newest">Nieuwste eerst</option>
              <option value="oldest">Oudste eerst</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="results">
    {#if $filtered.length === 0}
      <div class="empty">Geen boeken gevonden.</div>
    {:else}
      <div class="grid">
        {#each displayBooks as book}

        
        
        <a href="/library/{book.id}" class="card-link">
          <article class="card">
            {#if !book.cover}
              <div class="fake-cover">{book.title}</div>
            {:else}
              <!-- '/static/covers/test.svg' -->
              <Book3d image={book.cover} url={`/library/${book.id}`}/>
            {/if}
              <!-- <div
                class="cover"
                role="img"
                aria-label={book.title}
                style="background-image: url('{book.cover}');"
              >
                {#if !book.cover}
                  <div class="fake-cover">{book.title}</div>
                {/if}
              </div> -->
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

      <div class="pagination">
        <button class="pag-btn" onclick={prevPage} disabled={currentPage === 1}>← Vorige</button>
        <span class="page-info">Pagina {currentPage} van {$totalPages}</span>
        <button class="pag-btn" onclick={nextPage} disabled={currentPage === $totalPages}>Volgende →</button>
      </div>
    {/if}
  </section>
</main>

<style>
  .library-page{padding:2.4rem;min-height:100vh;color:var(--text,#111);font-family:'Georgia', serif;background:linear-gradient(135deg,#2a1f1a 0%,#1a1a2e 50%,#16213e 100%);position:relative;overflow:hidden;width:100%;max-width:100vw;overflow-x:hidden}
  
  .library-page::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background-image:radial-gradient(circle at 20% 50%, rgba(214,185,106,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(107,62,43,0.04) 0%, transparent 50%);pointer-events:none;z-index:0}

  .library-page::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background-image:radial-gradient(circle at 20% 50%, rgba(214,185,106,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(107,62,43,0.04) 0%, transparent 50%);pointer-events:none;z-index:0}
  .library-page > *{position:relative;z-index:1}

  .toolbar{display:flex;flex-direction:column;gap:0;margin-bottom:0;background:#fff;padding:0;border-radius:0;width:100%;position:relative;z-index:50}
  
  .header-top{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2rem;border-bottom:1px solid #e0e4e8}
  .header-top h2{margin:0;font-size:2.2rem;color:#1a202c;letter-spacing:0;font-weight:700}
  
  .toolbar h2{margin:0;font-size:2.2rem;color:#1a202c;letter-spacing:0;font-weight:700}

  .controls{display:flex;gap:1.5rem;align-items:center;justify-content:flex-end;padding:1.5rem 2rem;background:#f8f9fa;border-top:0;order:2;position:relative}
  
  .filter-btn{display:flex;width:2.4rem;height:2.4rem;background:transparent;border:none;padding:0;cursor:pointer;align-items:center;justify-content:center;color:#2c5282;transition:all .2s;order:2}
  .filter-btn:hover{color:#1a202c;opacity:0.8}

  .logout-btn{padding:.6rem 1.2rem;font-size:0.9rem;background:#2c5282;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:500;transition:all .2s}
  .logout-btn:hover{background:#1a202c;box-shadow:0 2px 8px rgba(44,82,130,0.3)}

  .search-wrap{position:relative;flex:1;max-width:none;order:1}
  .search-wrap input{width:100%;padding:1rem 2.6rem 1rem 1.2rem;border-radius:6px;border:1px solid #cbd5e0;box-shadow:0 1px 3px rgba(0,0,0,0.05);background:#fff;color:#2c3e50;font-size:1rem;transition:all .2s}
  .search-wrap input:focus{border-color:#2c5282;box-shadow:0 0 0 3px rgba(44,82,130,0.1)}
  .search-wrap input::placeholder{color:#a0aec0}
  .search-wrap .clear{position:absolute;right:.8rem;top:50%;transform:translateY(-50%);background:transparent;border:0;padding:.4rem .6rem;border-radius:4px;cursor:pointer;color:#cbd5e0;font-weight:600;font-size:1.2rem}
  .search-wrap .clear:hover{color:#2c3e50}

  .filter-menu{position:absolute;top:100%;right:2rem;left:auto;background:#fff;border:1px solid #e0e4e8;border-top:none;padding:0;animation:slideDown .2s ease;min-width:400px;max-width:90vw;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:100;border-radius:0 0 8px 8px;max-height:calc(100vh - 300px);overflow-y:auto}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}

  .filters{display:flex;flex-direction:column;gap:0}
  .filters-group{padding:1.2rem;border-bottom:1px solid #e0e4e8}
  .filters-group:last-child{border-bottom:none}
  .filter-title{margin:0 0 0.8rem 0;font-size:0.85rem;font-weight:700;color:#1a202c;text-transform:uppercase;letter-spacing:0.5px}
  
  .chips{display:flex;gap:.6rem;flex-wrap:wrap}
  .chip{background:#fff;border:1px solid #cbd5e0;padding:.6rem 1rem;border-radius:6px;cursor:pointer;color:#4a5568;font-size:0.9rem;transition:all .2s;font-weight:500;white-space:nowrap}
  .chip:hover{background:#f7fafc;border-color:#a0aec0}
  .chip.active{background:#2c5282;color:#fff;border-color:#2c5282;font-weight:600}

  #sort{width:100%;padding:.7rem;border-radius:6px;border:1px solid #cbd5e0;background:#fff;color:#2c3e50;font-weight:500;cursor:pointer;transition:all .2s;font-size:0.9rem}
  #sort:focus{border-color:#2c5282;box-shadow:0 0 0 3px rgba(44,82,130,0.1)}

  .results .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;padding:2rem 2rem}

  .card-link{text-decoration:none;color:inherit;display:block}
  .card{background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s, box-shadow .2s;cursor:pointer;border:1px solid #e0e4e8;height:100%;min-height:450px}
  .card-link:hover .card,.card-link:focus .card{transform:translateY(-4px);box-shadow:0 8px 16px rgba(0,0,0,0.12);border-color:#cbd5e0}

  .cover{height:250px;background-size:contain;background-repeat:no-repeat;background-position:center;display:flex;align-items:center;justify-content:center;padding:1.5rem;background-color:#f0f4f8;position:relative;overflow:hidden;flex-shrink:0;border-bottom:1px solid #e0e4e8}
  .fake-cover{background:linear-gradient(135deg,#2c5282,#1a365d);color:#e2e8f0;padding:1.5rem 1rem;border-radius:4px;font-weight:600;font-size:0.65rem;text-align:center;position:relative;z-index:1;width:90%;max-height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;line-height:1.3;word-spacing:0.05em}

  .meta{padding:1.2rem;display:flex;flex-direction:column;gap:.4rem;flex:1;overflow:hidden}
  .meta h3{margin:0;font-size:0.85rem;color:#1a202c;font-weight:600;line-height:1.3}
  .author{margin:0;color:#718096;font-size:0.9rem;font-weight:500}
  .category{font-size:.8rem;color:#2c5282;font-weight:600;background:#ebf4ff;padding:.25rem .5rem;border-radius:4px;display:inline-block;width:fit-content}
  .desc{margin-top:.4rem;font-size:0.85rem;color:#4a5568;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

  .empty{color:#718096;background:#f7fafc;padding:2rem;border-radius:8px;text-align:center;border:1px solid #e0e4e8;font-size:1rem;font-weight:500;margin:2rem}

  .pagination{display:flex;gap:1rem;align-items:center;justify-content:center;padding:2rem;margin-top:2rem}
  .pag-btn{background:#fff;border:1px solid #cbd5e0;padding:0.7rem 1.5rem;border-radius:6px;cursor:pointer;color:#4a5568;font-weight:500;transition:all .2s}
  .pag-btn:hover:not(:disabled){background:#f7fafc;border-color:#a0aec0}
  .pag-btn:disabled{opacity:0.4;cursor:not-allowed;background:#f0f4f8;border-color:#e0e4e8;color:#cbd5e0}
  .page-info{color:#4a5568;font-weight:500;font-size:0.95rem}

  .toolbar-top{display:flex;justify-content:space-between;align-items:center;width:100%}

  .filter-toggle{display:none}
  .filter-header{display:none}
  .filter-overlay{display:none}

  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}

  @media (max-width:900px){
    .controls{flex-direction:column;align-items:stretch}
    .toolbar{gap:.8rem}

    .toolbar-top{margin-bottom:1rem}

    .filter-toggle{display:block;width:100%;margin-bottom:0.5rem;text-align:left;padding:0.6rem 1rem;font-size:1rem}

    .filters{position:fixed;top:0;left:0;right:0;bottom:0;z-index:1001;display:none}

    .filters.show{display:block}

    .filter-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:1}

    .filter-content{position:relative;z-index:2;background:rgba(26,26,46,0.98);backdrop-filter:blur(10px);padding:2rem;height:100%;overflow-y:auto;display:flex;flex-direction:column;gap:1.5rem}

    .filter-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}

    .filter-header h3{margin:0;color:var(--gold,#d6b96a);font-size:1.5rem}

    .close-filters{background:transparent;border:2px solid var(--gold,#d6b96a);color:var(--gold,#d6b96a);font-size:1.5rem;width:2.5rem;height:2.5rem;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}

    .chips{width:100%;flex-direction:column}
    .chip{width:100%;text-align:left;justify-content:flex-start;cursor:pointer}
    .sort-wrap{width:100%}
    .sort-wrap select{width:100%}
    .results .grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.5rem}
  }

  @media (max-width:600px){
    .library-page{padding:1.5rem}
    .toolbar{padding:1rem;margin-bottom:1.5rem}
    .toolbar h2{font-size:1.5rem;letter-spacing:1px}
    .search-wrap input{font-size:16px;padding:0.75rem 2.5rem 0.75rem 0.75rem}
    .chip{font-size:0.85rem;padding:0.4rem 0.75rem}
    .results .grid{grid-template-columns:1fr;gap:1.25rem}
    .card{box-shadow:0 8px 20px rgba(0,0,0,0.25)}
    .meta h3{font-size:1rem}
    .author{font-size:0.9rem}
    .desc{font-size:0.85rem}
  }

  @media (max-width:400px){
    .library-page{padding:1rem}
    .toolbar{padding:0.75rem;margin-bottom:1rem}
    .toolbar h2{font-size:1.35rem}
    .search-wrap input{font-size:16px;padding:0.65rem 2.25rem 0.65rem 0.65rem}
    .chip{font-size:0.8rem;padding:0.35rem 0.65rem}
    .results .grid{gap:1rem}
    .card{padding:0}
    .meta{padding:1rem}
    .meta h3{font-size:0.95rem}
    .author{font-size:0.85rem}
    .category{font-size:0.75rem;padding:0.25rem 0.5rem}
    .desc{font-size:0.8rem}
    .cover{height:180px}
    .favorite-btn{width:2rem;height:2rem;font-size:1rem;top:0.6rem;right:0.6rem}
  }

</style>
