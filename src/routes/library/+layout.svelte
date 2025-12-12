<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  onMount(() => {
    try {
      const raw = localStorage.getItem('auth');
      const auth = raw ? JSON.parse(raw) : null;
      if (!auth?.loggedIn || !auth?.id || !auth?.name) {
        goto('/login');
      }
    } catch {
      goto('/login');
    }
  });
</script>

<slot />
