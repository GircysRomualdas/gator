import { readConfig, setUser } from "./config";

function main() {
  setUser("Romas");
  const cfg = readConfig();

  console.log(cfg);
}

main();
