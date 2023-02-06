<script>
import { Router, links, Route } from "svelte-routing";

import Home from "./routes/Home.svelte";
import Map from "./routes/Map.svelte";
</script>

<div use:links>
  <Router url="">
    <Route path="/" component={Home} />
    <Route path="/map" component={Map} />
    <Route let:location>
      <div>
        <h1>404</h1>
        <p>Page not found {location.pathname}</p>
      </div>
    </Route>
  </Router>
</div>
