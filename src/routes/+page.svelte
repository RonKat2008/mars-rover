<script>
   import { marsPhotos } from '/Users/ronitkatikaneni/mars-rover/src/lib/index.js';
   import { goto } from '$app/navigation'; // Correct import for goto

   const roverOptions = [
       { value: 'all', name: 'All Rovers' },
       { value: 'perseverance', name: 'Perseverance' },
       { value: 'curiosity', name: 'Curiosity' },
       { value: 'opportunity', name: 'Opportunity' },
       { value: 'spirit', name: 'Spirit' }
   ];

   const cameraOptions = [
       { value: 'all', name: 'All Cameras' },
       { value: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
       { value: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
       { value: 'MAST', name: 'Mast Camera' },
       { value: 'CHEMCAM', name: 'Chemistry and Camera Complex' },
       { value: 'MAHLI', name: 'Mars Hand Lens Imager' },
       { value: 'MARDI', name: 'Mars Descent Imager' },
       { value: 'NAVCAM', name: 'Navigation Camera' },
       { value: 'PANCAM', name: 'Panoramic Camera' },
       { value: 'MINITES', name: 'Miniature Thermal Emission Spectrometer' }
   ];

   let selectedRover = 'all';
   let selectedCamera = 'all';
   let startDate = '';
   let endDate = '';

   function getLast7Days() {
       const today = new Date();
       const lastWeek = new Date(today);
       lastWeek.setDate(today.getDate() - 6);
       return {
           start: lastWeek.toISOString().split('T')[0],
           end: today.toISOString().split('T')[0]
       };
   }

   async function fetchPhotos() {
       marsPhotos.set([]); // clear previous data

       let rovers =
           selectedRover === 'all'
               ? ['perseverance', 'curiosity', 'opportunity', 'spirit']
               : [selectedRover];

       if (!startDate && !endDate) {
           for (const rover of rovers) {
               let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${import.meta.env.VITE_NASA_API_KEY}`;
               if (selectedCamera !== 'all') {
                   url += `&camera=${selectedCamera}`;
               }
               const res = await fetch(url);
               const data = await res.json();
               console.log(`Latest photos for ${rover}:`, data.latest_photos);
               marsPhotos.update(photos => [...photos, ...data.latest_photos]);
           }
           goto('/gallery');
       }

       let { start, end } = { start: startDate, end: endDate };
       for (const rover of rovers) {
           let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${import.meta.env.VITE_NASA_API_KEY}`;
           url += `&earth_date=${end}`;
           if (selectedCamera !== 'all') {
               url += `&camera=${selectedCamera}`;
           }
           const res = await fetch(url);
           const data = await res.json();
           console.log(`Photos for ${rover} on ${end}:`, data.photos);
           marsPhotos.update(photos => [...photos, ...data.photos]);
       }
       console.log("Navigating to /gallery...");
       goto('/gallery'); // Navigate to the gallery page
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
   }

   form {
       max-width: 600px;
       margin: 2rem auto;
       padding: 1.5rem;
       background: #fff;
       border-radius: 8px;
       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }

   label {
       display: block;
       margin-bottom: 0.5rem;
       font-weight: bold;
       color: #555;
   }

   select,
   input[type="date"],
   button {
       width: 100%;
       padding: 0.5rem;
       margin-bottom: 1rem;
       border: 1px solid #ccc;
       border-radius: 4px;
       font-size: 1rem;
   }

   button {
       background-color: #007bff;
       color: white;
       border: none;
       cursor: pointer;
       transition: background-color 0.3s ease;
   }

   button:hover {
       background-color: #0056b3;
   }

   p {
       text-align: center;
       color: #666;
   }
</style>

<h1>Mars Rover Photo Search</h1>

<form on:submit|preventDefault={fetchPhotos}>
   <label>
       Rover:
       <select bind:value={selectedRover}>
           {#each roverOptions as rover}
               <option value={rover.value}>{rover.name}</option>
           {/each}
       </select>
   </label>

   <label>
       Camera:
       <select bind:value={selectedCamera}>
           {#each cameraOptions as camera}
               <option value={camera.value}>{camera.name}</option>
           {/each}
       </select>
   </label>

   <label>
       Start Date:
       <input type="date" bind:value={startDate} />
   </label>

   <label>
       End Date:
       <input type="date" bind:value={endDate} />
   </label>

   <button type="submit">Search</button>
</form>

<p>
   If you leave everything blank, you'll get the most recent photos from all rovers and all cameras
   (last 7 days).
</p>

