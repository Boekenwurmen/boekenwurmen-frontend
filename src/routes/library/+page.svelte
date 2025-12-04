<script lang="ts">
  import books from '../../lib/books';
  import type { Book } from '../../lib/books';
  import { writable, derived } from 'svelte/store';

  const allBooks: Book[] = books;

  const search = writable('');
  const category = writable('All');
  const sort = writable('newest'); // newest or oldest

  const categories = ['All', ...Array.from(new Set(allBooks.map(b => b.category)))];

  const filtered = derived([search, category, sort], ([$search, $category, $sort]) => {
    const q = $search.trim().toLowerCase();
    let list = allBooks.filter(b => {
      const matchesQuery = q === '' || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q);
      const matchesCategory = $category === 'All' || b.category === $category;
      return matchesQuery && matchesCategory;
    });

    list = list.sort((a, b) => $sort === 'newest' ? b.year - a.year : a.year - b.year);
    return list;
  });
</script>

<main class="library-page">
  <header class="toolbar">
    <h2>Bibliotheek</h2>
    <div class="controls">
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
  .library-page{padding:2.4rem;min-height:72vh;color:var(--text,#111);font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial}

  .toolbar{display:flex;flex-direction:column;gap:.8rem;margin-bottom:1.25rem}
  .toolbar h2{margin:0;font-size:1.4rem;color:var(--cover-dark,#5a351f);letter-spacing:1px}

  .controls{display:flex;gap:1rem;align-items:center;justify-content:space-between}
  .search-wrap{position:relative;flex:1;max-width:640px}
  .search-wrap input{width:100%;padding:.8rem 2.6rem .8rem .9rem;border-radius:10px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 2px 8px rgba(6,10,20,0.04);background:linear-gradient(180deg,#fff,#fbfbfb)}
  .search-wrap .clear{position:absolute;right:.4rem;top:50%;transform:translateY(-50%);background:transparent;border:0;padding:.35rem .6rem;border-radius:6px;cursor:pointer;color:#666}

  .filters{display:flex;gap:1rem;align-items:center}
  .chips{display:flex;gap:.5rem;flex-wrap:wrap}
  .chip{background:transparent;border:1px solid rgba(0,0,0,0.06);padding:.35rem .7rem;border-radius:20px;cursor:pointer;color:#444;font-size:.9rem}
  .chip.active{background:var(--gold,#d6b96a);color:#fff;border-color:transparent;box-shadow:0 6px 18px rgba(214,185,106,0.14)}

  .sort-wrap select{padding:.45rem .6rem;border-radius:8px;border:1px solid rgba(0,0,0,0.06);background:#fff}

  .results .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}

  .card-link{text-decoration:none;color:inherit;display:block}
  .card{background:var(--page,#fff);border-radius:10px;box-shadow:0 12px 30px rgba(6,10,20,0.08);overflow:hidden;display:flex;flex-direction:column;transition:transform .22s cubic-bezier(.2,.9,.3,1),box-shadow .22s;cursor:pointer}
  .card-link:hover .card,.card-link:focus .card{transform:translateY(-8px);box-shadow:0 22px 48px rgba(6,10,20,0.12)}

  .cover{height:180px;background-size:cover;background-position:center;display:flex;align-items:flex-end;justify-content:flex-start;padding:1rem}
  .fake-cover{background:linear-gradient(135deg,var(--cover,#6b3e2b),var(--cover-dark,#56311f));color:var(--gold,#d6b96a);padding:.6rem .8rem;border-radius:6px;font-weight:700}

  .meta{padding:1rem;display:flex;flex-direction:column;gap:.4rem}
  .meta h3{margin:0;font-size:1.05rem;color:#2b2b2b}
  .author{margin:0;color:#777;font-size:.92rem}
  .category{font-size:.82rem;color:var(--cover-dark,#5a351f);font-weight:600}
  .desc{margin-top:.25rem;font-size:.9rem;color:#444}

  .empty{color:#555;background:linear-gradient(180deg,#fff,#fbfbfb);padding:1rem;border-radius:8px}

  @media (max-width:900px){
    .controls{flex-direction:column;align-items:stretch}
    .toolbar{gap:.6rem}
  }

</style>
