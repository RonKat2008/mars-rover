// place files you want to import through the `$lib` alias in this folder.
// src/lib/stores/images.js
import { writable } from 'svelte/store';

// Initialize the marsPhotos store with an empty array or predefined photos
export const marsPhotos = writable([]);

// Example: Adding a function to update the marsPhotos store
export function setMarsPhotos(photos) {
  marsPhotos.set(photos);
}