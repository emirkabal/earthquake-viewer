<script>
import { grabLocation } from "../functions/grabLocation";
import Pagination from "../lib/Pagination.svelte";
import EarthquakeView from "../lib/EarthquakeView.svelte";
let [earthquakes, filtered, pages, loading, search] = [
  [],
  [],
  { max: 0, current: 0, size: 3 },
  true,
  "",
];

fetch("https://deprem-api.vercel.app/")
  .then((res) => res.json())
  .then((res) => {
    earthquakes = res.earthquakes;
    earthquakes.forEach((earthquake) => {
      earthquake.location = {
        all: earthquake.location,
        ...grabLocation(earthquake.location),
      };
    });
    pages.max = Math.ceil(earthquakes.length / pages.size);
    loading = false;
  })
  .catch((err) => console.log(err));

const searchEarthquakes = () => {
  pages.current = 0;
  filtered = earthquakes.filter((earthquake) => {
    return (
      earthquake.location.name
        .toLocaleLowerCase()
        .indexOf(search.toLocaleLowerCase()) > -1
    );
  });
};
</script>

<main>
  <div class="background" />
  <div class="bubble" />
  <header>
    <div class="content">
      <div class="title">
        <div>
          <h1>Earthquakes</h1>
          <h2>Latest earthquakes in Turkey</h2>
        </div>
        <a href="/map">Show Map</a>
      </div>

      <input
        class="search"
        type="text"
        bind:value={search}
        on:input={searchEarthquakes}
        placeholder="Search..."
      />
    </div>
  </header>
  <div class="container">
    {#if loading}
      <span>Loading...</span>
    {:else}
      <div class="earthquakes">
        {#if search.trim().length > 0}
          {#each filtered.slice(pages.current * pages.size, pages.current * pages.size + pages.size) as earthquake}
            <EarthquakeView {earthquake} />
          {/each}
          {#if filtered.length === 0}
            <span style="text-align: center;">No results found.</span>
          {/if}
        {:else}
          {#each earthquakes.slice(pages.current * pages.size, pages.current * pages.size + pages.size) as earthquake}
            <EarthquakeView {earthquake} />
          {/each}
        {/if}
      </div>
      {#if search.trim().length === 0}
        <Pagination
          totalItems={earthquakes.length}
          pageSize={pages.size}
          currentPage={pages.current + 1}
          limit={1}
          showStepOptions={true}
          on:setPage={(e) => (pages.current = e.detail.page - 1)}
        />
      {:else if filtered.length > pages.size}
        <Pagination
          totalItems={filtered.length}
          pageSize={pages.size}
          currentPage={pages.current + 1}
          limit={1}
          showStepOptions={true}
          on:setPage={(e) => (pages.current = e.detail.page - 1)}
        />
      {/if}
    {/if}
  </div>
  <div
    style="display: flex; flex-direction:column; justify-content:center; margin: auto; width:100%;"
  >
    <a
      href="https://github.com/emirkabal/earthquake-viewer"
      style="opacity: .7; color:#fff; text-align: center; display: block; margin-bottom: 4px;"
    >
      Github
    </a>
    <a
      href="http://www.koeri.boun.edu.tr/scripts/lst9.asp"
      style="opacity: .7; color:#fff; text-align: center; display: block; margin-bottom: 10px;"
    >
      All earthquakes in this site are taken from Kandilli Observatory.
    </a>
  </div>
</main>
