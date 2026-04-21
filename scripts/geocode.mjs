import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

if (!API_KEY) {
  console.error("Missing NEXT_PUBLIC_GOOGLE_MAPS_KEY — run: node --env-file=.env.local scripts/geocode.mjs");
  process.exit(1);
}

const addresses = [
  { name: "Tenfold Coffee Company", address: "101 Aurora St, Houston, TX 77008" },
  { name: "The Coffee House at West End", address: "802 Shepherd Dr, Houston TX 77007" },
  { name: "Antidote Coffee", address: "729 Studewood St, Houston TX 77007" },
  { name: "Black Hole Coffee House", address: "4504 Graustark St, Houston TX 77006" },
  { name: "The Tipping Point (in 93' Til)", address: "1601 W Main St, Houston, TX 77006" },
  { name: "New Heights Coffee Roasters", address: "825 Studewood St, Houston, TX 77007" },
  { name: "Agnes Café and Provisions", address: "2132 Bissonnet St, Houston, TX 77005" },
  { name: "Coffee Fellows", address: "4900 Bissonnet St #100, Houston, TX 77401" },
  { name: "Angela's Oven", address: "204 Aurora St, Houston, TX 77008" },
  { name: "Fifth Vessel Coffee Company", address: "104 N Main St, Houston, TX 77002" },
  { name: "Active Passion", address: "803 Usener St #100, Houston, TX 77009" },
  { name: "Boomtown Coffee Company", address: "242 W 19th St, Houston, TX 77008" },
  { name: "Bluestone Lane Coffee", address: "115 W 19th St, Houston, TX 77008" },
  { name: "Simply Coffie", address: "733 W 24th St, Houston, TX 77008" },
  { name: "Agora", address: "1712 Westheimer Rd, Houston, TX 77098" },
  { name: "Segundo Coffee Lab", address: "711 Milby St #35, Houston, TX 77023" },
  { name: "Catalina Coffee", address: "2201 Washington Ave, Houston, TX 77007" },
  { name: "Third Place (in Jūn)", address: "420 E 20th St Suite A, Houston, TX 77008" },
  { name: "Cariño Coffee (Houston Ave.)", address: "3024 Houston Ave, Houston, TX 77009" },
];

async function geocode(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.results[0]) {
    console.warn(`  ⚠ Could not geocode: ${address}`);
    return null;
  }
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

console.log("Geocoding addresses...\n");
const results = {};

for (const shop of addresses) {
  process.stdout.write(`  ${shop.name}... `);
  const coords = await geocode(shop.address);
  if (coords) {
    results[shop.name] = coords;
    console.log(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
  }
  await new Promise((r) => setTimeout(r, 100)); // be polite to the API
}

// Read and update coffeeShops.js
const filePath = join(__dirname, "../src/data/coffeeShops.js");
let src = readFileSync(filePath, "utf8");

for (const [name, { lat, lng }] of Object.entries(results)) {
  // Replace the existing lat/lng line for this shop
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  src = src.replace(
    new RegExp(`(name: "${escapedName}",[^}]*?)lat: [\\d.]+, lng: -[\\d.]+,`),
    `$1lat: ${lat}, lng: ${lng},`
  );
}

writeFileSync(filePath, src, "utf8");
console.log("\n✓ Updated src/data/coffeeShops.js with real coordinates.");
