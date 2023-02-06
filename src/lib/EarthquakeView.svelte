<script>
import IconMagnitude from "./icons/magnitude.svelte";
import IconDepth from "./icons/depth.svelte";
import IconLocation from "./icons/location.svelte";
import IconCity from "./icons/city.svelte";
import IconSea from "./icons/sea.svelte";
import IconWorld from "./icons/world.svelte";
import IconClock from "./icons/clock.svelte";
import moment from "moment";

export let earthquake;
</script>

<div class="item">
  <div class="header">
    <h2 class="title">{earthquake.location.all.replace(/\(.+\)/g, "")}</h2>
    <div class="date">
      {moment(earthquake.date, "YYYY.MM.DD hh:mm:ss").fromNow()}
      <IconClock />
    </div>
  </div>
  <div class="details">
    <div class="detailed-item">
      <div class="info">
        <IconMagnitude />
        <div class="label">Magnitude</div>
      </div>
      <span>
        {earthquake.size.ml}
        <span class="unit">ml</span>
      </span>
    </div>
    <div class="detailed-item">
      <div class="info">
        <IconDepth />
        <div class="label">Depth</div>
      </div>
      <span>
        {earthquake.depth}
        <span class="unit">km</span>
      </span>
    </div>
    <a
      href={`https://www.google.com/maps/place/${earthquake.latitude},${earthquake.longitude}`}
      target="_"
      class="detailed-item"
    >
      <div class="info">
        <IconLocation />
        <div class="label">Location</div>
      </div>
      <span>
        {earthquake.location.name}
        <span class="unit">
          {#if earthquake.location.type === "city"}
            <IconCity />
          {:else if earthquake.location.type === "sea"}
            <IconSea />
          {:else}
            <IconWorld />
          {/if}
        </span>
      </span>
    </a>
  </div>
</div>
