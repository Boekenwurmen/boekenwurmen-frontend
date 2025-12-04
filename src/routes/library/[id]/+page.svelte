<script lang="ts">
  import books from '../../../lib/books';
  import type { Book } from '../../../lib/books';
  import { page } from '$app/stores';

  let book: Book | undefined;

  $: book = books.find(b => b.id === Number($page.params.id));

  function handleReadClick() {
    if (book?.cover) {
      window.open(book.cover, '_blank');
    }
  }

  function handleFavorite() {
    alert('Toegevoegd aan favorieten!');
  }
</script>

{#if book}
  <main class="detail-page">
    <a href="/library" class="back-link">← Terug naar bibliotheek</a>

    <article class="book-detail">
      <div class="cover-section">
        <div class="cover" style="background-image: url('{book.cover}');">
          {#if !book.cover}
            <div class="fake-cover">{book.title}</div>
          {/if}
        </div>
      </div>

      <div class="info-section">
        <h1>{book.title}</h1>
        <p class="author">{book.author}</p>
        <p class="meta">
          <span class="year">{book.year}</span>
          <span class="category">{book.category}</span>
        </p>
        <p class="description">{book.description}</p>

        <div class="actions">
          <button class="btn btn-primary" on:click={handleReadClick}>Lees nu</button>
          <button class="btn btn-secondary" on:click={handleFavorite}>Voeg toe aan favoriet</button>
        </div>
      </div>
    </article>
  </main>
{:else}
  <main class="detail-page">
    <a href="/library" class="back-link">← Terug naar bibliotheek</a>
    <p>Boek niet gevonden.</p>
  </main>
{/if}

<style>
  .detail-page {
    padding: 2.4rem;
    min-height: 100vh;
    color: var(--text, #111);
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
  }

  .back-link {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: var(--gold, #d6b96a);
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.2s;
  }

  .back-link:hover {
    transform: translateX(-4px);
  }

  .book-detail {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
    background: var(--page, #f5f3f0);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(6, 10, 20, 0.3);
  }

  .cover-section {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .cover {
    width: 100%;
    max-width: 300px;
    aspect-ratio: 3/4;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: flex-end;
    padding: 1rem;
  }

  .fake-cover {
    background: linear-gradient(135deg, var(--cover, #6b3e2b), var(--cover-dark, #56311f));
    color: var(--gold, #d6b96a);
    padding: 1rem;
    border-radius: 6px;
    font-weight: 700;
    font-size: 1.2rem;
    text-align: center;
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-section h1 {
    margin: 0;
    font-size: 2rem;
    color: #2b2b2b;
  }

  .author {
    margin: 0;
    font-size: 1.1rem;
    color: #666;
    font-style: italic;
  }

  .meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.95rem;
    color: #777;
    margin: 0.5rem 0 1rem;
  }

  .year {
    font-weight: 600;
  }

  .category {
    background: rgba(214, 185, 106, 0.15);
    padding: 0.35rem 0.8rem;
    border-radius: 6px;
    color: var(--cover-dark, #5a351f);
    font-weight: 600;
  }

  .description {
    font-size: 1.05rem;
    line-height: 1.6;
    color: #333;
    margin: 1rem 0;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .btn {
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    border: 2px solid var(--gold, #d6b96a);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }

  .btn-primary {
    background: var(--gold, #d6b96a);
    color: #fff;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(214, 185, 106, 0.3);
  }

  .btn-secondary {
    background: transparent;
    color: var(--cover-dark, #5a351f);
  }

  .btn-secondary:hover {
    background: rgba(214, 185, 106, 0.1);
  }

  @media (max-width: 900px) {
    .book-detail {
      grid-template-columns: 1fr;
    }

    .cover {
      max-width: 250px;
      margin: 0 auto;
    }

    .info-section h1 {
      font-size: 1.5rem;
    }
  }
</style>
