<script>
import { Map, View, Feature } from "ol";
import { fromLonLat } from "ol/proj";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import { Point } from "ol/geom";
import { onMount } from "svelte";
import Spinner from "../lib/Spinner.svelte";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
let loaded = false;

onMount(async () => {
  const map = new Map({
    target: "map",
    pixelRatio: 1,

    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [23.99, 39],
      zoom: 8.4,
      constrainResolution: true,
    }),
  });
  // @ts-ignore
  document
    .querySelector(
      "#map > div > div.ol-overlaycontainer-stopevent > div.ol-attribution.ol-unselectable.ol-control.ol-collapsed"
    )
    .classList.remove("ol-collapsed");
  document
    .querySelector(
      "#map > div > div.ol-overlaycontainer-stopevent > div.ol-attribution.ol-unselectable.ol-control > button"
    )
    .remove();
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

  const location = [getAverageLocation[0], getAverageLocation[1]];
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
      <Spinner />
    </div>
  {/if}
</main>
