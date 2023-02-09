<script>
import { Map, View, Feature } from "ol";
import Tile from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import { Point } from "ol/geom";
import { onMount } from "svelte";
import TileJSON from "ol/source/TileJSON";
let loaded = false;

onMount(async () => {
  const source = new TileJSON({
    url: "https://api.maptiler.com/maps/basic-v2-dark/tiles.json?key=oVXfyiogVe6OCHjfhNj9",
    tileSize: 512,
    crossOrigin: "anonymous",
  });
  const map = new Map({
    target: "map",
    layers: [
      new Tile({
        source,
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 9,
    }),
  });
  // @ts-ignore
  document
    .querySelector(
      "#map > div > div.ol-overlaycontainer-stopevent > div.ol-attribution.ol-unselectable.ol-control.ol-collapsed"
    )
    .classList.remove("ol-collapsed");
  const redAndHighMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.8,
        opacity: 0.8,
        src: "markers/red.png",
      }),
    }),
  });

  const redMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.5,
        opacity: 0.6,
        src: "markers/red.png",
      }),
    }),
  });

  const yellowMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.3,
        opacity: 0.6,
        src: "markers/yellow.png",
      }),
    }),
  });

  const blueMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.12,
        opacity: 0.5,
        src: "markers/blue.png",
      }),
    }),
  });

  const aquaMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.04,
        opacity: 0.9,
        src: "markers/aqua.png",
      }),
    }),
  });

  map.addLayer(redAndHighMarkers);
  map.addLayer(redMarkers);
  map.addLayer(yellowMarkers);
  map.addLayer(blueMarkers);
  map.addLayer(aquaMarkers);

  redAndHighMarkers.setZIndex(4);
  redMarkers.setZIndex(3);
  yellowMarkers.setZIndex(2);
  blueMarkers.setZIndex(1);
  aquaMarkers.setZIndex(0);

  let data = await fetch("https://deprem-api.vercel.app/")
    .then((res) => res.json())
    .then((res) => res.earthquakes);

  data = data.map((item) => {
    item.attribute = item.size.ml ? "ml" : item.size.md ? "md" : "mw";
    return item;
  });

  const getHighestEarthquakesLocation = data
    .sort(
      (a, b) =>
        b.size[b.attribute.toLowerCase()] - a.size[a.attribute.toLowerCase()]
    )
    .slice(0, 2);

  const getAverageLocation = getHighestEarthquakesLocation.reduce(
    (acc, item) => {
      acc[0] += item.longitude;
      acc[1] += item.latitude;
      return acc;
    },
    [0, 0]
  );
  getAverageLocation[0] /= getHighestEarthquakesLocation.length;
  getAverageLocation[1] /= getHighestEarthquakesLocation.length;

  const location = [getAverageLocation[0] - 1.2, getAverageLocation[1] - 0.1];
  map.getView().setCenter(fromLonLat(location));

  data = data.filter((item) => item.size[item.attribute.toLowerCase()] >= 2);

  data.forEach((item) => {
    let marker = new Feature(
      new Point(fromLonLat([item.longitude, item.latitude]))
    );
    const size = item.size[item.attribute.toLowerCase()];
    if (size >= 7) {
      redAndHighMarkers.getSource().addFeature(marker);
    } else if (size >= 5) {
      redMarkers.getSource().addFeature(marker);
    } else if (size >= 4) {
      yellowMarkers.getSource().addFeature(marker);
    } else if (size >= 3) {
      blueMarkers.getSource().addFeature(marker);
    } else {
      aquaMarkers.getSource().addFeature(marker);
    }
  });

  loaded = true;
});
</script>

<main>
  <div id="map" />
  {#if loaded}
    <div id="loaded" />
  {:else}
    <div id="loading">
      <div class="lds-spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  {/if}
</main>

<style>
#loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: #fff;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
