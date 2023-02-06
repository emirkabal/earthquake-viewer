<script>
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import { Point } from "ol/geom";
import { onMount } from "svelte";
let loaded = false;
onMount(async () => {
  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 9,
    }),
  });

  const redAndHighMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.7,
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
        scale: 0.4,
        opacity: 0.7,
        src: "markers/red.png",
      }),
    }),
  });
  const blueMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.3,
        opacity: 0.4,
        src: "markers/blue.png",
      }),
    }),
  });

  const yellowMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.3,
        opacity: 0.2,
        src: "markers/yellow.png",
      }),
    }),
  });

  const aquaMarkers = new Vector({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.3,
        opacity: 0.5,
        src: "markers/aqua.png",
      }),
    }),
  });

  map.addLayer(redAndHighMarkers);
  map.addLayer(redMarkers);
  map.addLayer(blueMarkers);
  map.addLayer(yellowMarkers);
  map.addLayer(aquaMarkers);

  let data = await fetch("https://deprem-api.vercel.app")
    .then((res) => res.json())
    .then((res) => res.earthquakes);
  data = data.map((item) => {
    item.attribute = item.size.ml ? "ml" : item.size.md ? "md" : "mw";
    return item;
  });
  const getHighestEarthquake = data.sort(
    (a, b) =>
      b.size[b.attribute.toLowerCase()] - a.size[a.attribute.toLowerCase()]
  )[0];
  const location = [
    getHighestEarthquake.longitude - 0.1,
    getHighestEarthquake.latitude - 0.5,
  ];
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
  {/if}
</main>

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
