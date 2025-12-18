<script>
    import Reader from "../../lib/components/Reader.svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import '../css/book.css';
</script>

<div class="book-content-single-page">
    <ThemeToggle />
    <div class="book-page book-page-left">
        <div class="w-sm">
            <h1 class="page-title">First Adventure!</h1>
            <Reader/>
        </div>
    </div>
</div>