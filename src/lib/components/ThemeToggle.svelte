<script>
  import { onMount } from 'svelte';
  let theme = $state('light');

  function applyTheme(t) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', t === 'dark');
  }

  function setTheme(t) {
    theme = t;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', t);
    }
    applyTheme(t);
  }

  function toggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  onMount(() => {
    let initial = 'light';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') initial = saved;
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) initial = 'dark';
    } catch {}
    setTheme(initial);
  });
</script>

<button class="theme-toggle" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onclick={toggle}>
  {#if theme === 'dark'}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="5" stroke="#d6b96a" stroke-width="2"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#d6b96a" stroke-width="2" stroke-linecap="round"/>
  </svg>
  {:else}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="#d6b96a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    position: fixed;
    top: 14px;
    right: 16px;
    z-index: 50;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid rgba(214,185,106,0.45);
    background: linear-gradient(180deg, var(--cover, #6b3e2b) 0%, var(--cover-dark, #56311f) 100%);
    box-shadow: 0 10px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12);
    cursor: pointer;
    transition: transform .15s ease, filter .15s ease;
  }
  .theme-toggle:hover { filter: brightness(1.05); transform: translateY(-1px); }
  .theme-toggle:active { transform: translateY(0); }
</style>
