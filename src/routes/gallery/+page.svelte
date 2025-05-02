<script>
    import { marsPhotos } from '/Users/ronitkatikaneni/mars-rover/src/lib/index.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; // Import goto for navigation

    let photos = [];

    // Subscribe to the store
    const unsubscribe = marsPhotos.subscribe(value => {
        photos = value;
        console.log('Photos in gallery:', photos); // Debugging: Log photos
    });

    onMount(() => {
        return () => unsubscribe(); // Clean up subscription
    });

    function goBack() {
        goto('/'); // Navigate back to the form page
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
    }

    h1 {
        text-align: center;
        color: #333;
        margin-top: 1rem;
    }

    .gallery-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 1rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .back-button {
        display: block;
        margin: 1rem auto;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
        transition: background-color 0.3s ease;
    }

    .back-button:hover {
        background-color: #0056b3;
    }

    .photos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    .photo-card {
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background: #fff;
    }

    .photo-card img {
        width: 100%;
        height: auto;
        display: block;
    }

    .photo-card p {
        margin: 0.5rem;
        font-size: 0.9rem;
        color: #555;
    }

    .photo-card p strong {
        color: #333;
    }

    .no-photos {
        text-align: center;
        color: #666;
        font-size: 1.2rem;
        margin-top: 2rem;
    }
</style>

<h1>Mars Rover Photo Gallery</h1>

<div class="gallery-container">
    <button class="back-button" on:click={goBack}>Back to Search</button>

    {#if photos.length === 0}
        <p class="no-photos">No photos to display. Please perform a search first.</p>
    {:else}
        <div class="photos-grid">
            {#each photos as photo}
                <div class="photo-card">
                    <img src={photo.img_src} alt="Mars rover photo" />
                    <p><strong>Rover:</strong> {photo.rover.name}</p>
                    <p><strong>Camera:</strong> {photo.camera.full_name}</p>
                    <p><strong>Date:</strong> {photo.earth_date}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>
