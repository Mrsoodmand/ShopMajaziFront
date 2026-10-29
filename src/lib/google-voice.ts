import type { GvNumber } from "@/content/google-voice-en";

// Google Voice numbers from the backend (GET /api/v1/storefront/google-voice → Numberland special numbers).
// Numberland sends only the number, so the city and state come from the US area code below.
export type ApiGvNumber = { id: number; number: string; price: number; round: number };
export type ApiGoogleVoice = { numbers: ApiGvNumber[]; unavailable: boolean; disabled?: boolean }; // disabled: switched off in admin

// A delivered (or pending) order, from POST google-voice/buy and GET google-voice/orders/{id}.
export type ApiGvOrder = {
  id: number;
  status: "delivered" | "refunded" | "unpaid" | "review";
  number: string | null;
  price: number;
  paid_with: "wallet" | "card";
  created_at: string;
  login: { number: string; email: string; password: string; recovery: string; twofa: string } | null;
};

// Area code → "City,ST". Codes not listed show as "United States".
const AREAS = Object.fromEntries(
  ("201Jersey City,NJ|202Washington,DC|203New Haven,CT|205Birmingham,AL|206Seattle,WA|207Portland,ME|208Boise,ID|209Stockton,CA|" +
    "210San Antonio,TX|212New York,NY|213Los Angeles,CA|214Dallas,TX|215Philadelphia,PA|216Cleveland,OH|217Springfield,IL|218Duluth,MN|" +
    "219Gary,IN|220Newark,OH|223Lancaster,PA|224Evanston,IL|225Baton Rouge,LA|228Gulfport,MS|229Albany,GA|231Muskegon,MI|234Akron,OH|" +
    "239Fort Myers,FL|240Bethesda,MD|248Troy,MI|251Mobile,AL|252Greenville,NC|253Tacoma,WA|254Waco,TX|256Huntsville,AL|260Fort Wayne,IN|" +
    "262Kenosha,WI|267Philadelphia,PA|269Kalamazoo,MI|270Bowling Green,KY|272Scranton,PA|276Bristol,VA|279Sacramento,CA|281Houston,TX|" +
    "301Silver Spring,MD|302Wilmington,DE|303Denver,CO|304Charleston,WV|305Miami,FL|307Cheyenne,WY|308Grand Island,NE|309Peoria,IL|" +
    "310Los Angeles,CA|312Chicago,IL|313Detroit,MI|314St. Louis,MO|315Syracuse,NY|316Wichita,KS|317Indianapolis,IN|318Shreveport,LA|" +
    "319Cedar Rapids,IA|320St. Cloud,MN|321Orlando,FL|323Los Angeles,CA|325Abilene,TX|330Akron,OH|331Aurora,IL|332New York,NY|" +
    "334Montgomery,AL|336Greensboro,NC|337Lafayette,LA|339Boston,MA|341Oakland,CA|346Houston,TX|347New York,NY|351Lowell,MA|" +
    "352Gainesville,FL|360Vancouver,WA|361Corpus Christi,TX|380Columbus,OH|385Salt Lake City,UT|386Daytona Beach,FL|401Providence,RI|" +
    "402Omaha,NE|404Atlanta,GA|405Oklahoma City,OK|406Billings,MT|407Orlando,FL|408San Jose,CA|409Beaumont,TX|410Baltimore,MD|" +
    "412Pittsburgh,PA|413Springfield,MA|414Milwaukee,WI|415San Francisco,CA|417Springfield,MO|419Toledo,OH|423Chattanooga,TN|" +
    "424Los Angeles,CA|425Bellevue,WA|430Tyler,TX|432Midland,TX|434Lynchburg,VA|435St. George,UT|440Cleveland,OH|442Oceanside,CA|" +
    "443Baltimore,MD|445Philadelphia,PA|458Eugene,OR|463Indianapolis,IN|469Dallas,TX|470Atlanta,GA|475Bridgeport,CT|478Macon,GA|" +
    "479Fort Smith,AR|480Mesa,AZ|484Allentown,PA|501Little Rock,AR|502Louisville,KY|503Portland,OR|504New Orleans,LA|505Albuquerque,NM|" +
    "507Rochester,MN|508Worcester,MA|509Spokane,WA|510Oakland,CA|512Austin,TX|513Cincinnati,OH|515Des Moines,IA|516Hempstead,NY|" +
    "517Lansing,MI|518Albany,NY|520Tucson,AZ|530Redding,CA|531Omaha,NE|539Tulsa,OK|540Roanoke,VA|541Eugene,OR|551Jersey City,NJ|" +
    "559Fresno,CA|561West Palm Beach,FL|562Long Beach,CA|563Davenport,IA|564Vancouver,WA|567Toledo,OH|570Scranton,PA|571Arlington,VA|" +
    "573Columbia,MO|574South Bend,IN|575Las Cruces,NM|580Lawton,OK|585Rochester,NY|586Warren,MI|601Jackson,MS|602Phoenix,AZ|" +
    "603Manchester,NH|605Sioux Falls,SD|606Ashland,KY|607Binghamton,NY|608Madison,WI|609Trenton,NJ|610Allentown,PA|612Minneapolis,MN|" +
    "614Columbus,OH|615Nashville,TN|616Grand Rapids,MI|617Boston,MA|618Belleville,IL|619San Diego,CA|620Dodge City,KS|623Glendale,AZ|" +
    "626Pasadena,CA|628San Francisco,CA|629Nashville,TN|630Naperville,IL|631Islip,NY|636St. Charles,MO|640Trenton,NJ|641Mason City,IA|" +
    "646New York,NY|650San Mateo,CA|651St. Paul,MN|657Anaheim,CA|659Birmingham,AL|660Sedalia,MO|661Bakersfield,CA|662Tupelo,MS|" +
    "667Baltimore,MD|669San Jose,CA|678Atlanta,GA|680Syracuse,NY|681Charleston,WV|682Fort Worth,TX|689Orlando,FL|701Fargo,ND|" +
    "702Las Vegas,NV|703Arlington,VA|704Charlotte,NC|706Augusta,GA|707Santa Rosa,CA|708Cicero,IL|712Sioux City,IA|713Houston,TX|" +
    "714Anaheim,CA|715Eau Claire,WI|716Buffalo,NY|717Harrisburg,PA|718New York,NY|719Colorado Springs,CO|720Denver,CO|724New Castle,PA|" +
    "725Las Vegas,NV|726San Antonio,TX|727St. Petersburg,FL|731Jackson,TN|732New Brunswick,NJ|734Ann Arbor,MI|737Austin,TX|" +
    "740Zanesville,OH|743Greensboro,NC|747Los Angeles,CA|754Fort Lauderdale,FL|757Virginia Beach,VA|760Oceanside,CA|762Augusta,GA|" +
    "763Brooklyn Park,MN|765Muncie,IN|769Jackson,MS|770Atlanta,GA|772Port St. Lucie,FL|773Chicago,IL|774Worcester,MA|775Reno,NV|" +
    "779Rockford,IL|781Boston,MA|785Topeka,KS|786Miami,FL|801Salt Lake City,UT|802Burlington,VT|803Columbia,SC|804Richmond,VA|" +
    "805Santa Barbara,CA|806Lubbock,TX|808Honolulu,HI|810Flint,MI|812Evansville,IN|813Tampa,FL|814Erie,PA|815Rockford,IL|" +
    "816Kansas City,MO|817Fort Worth,TX|818Los Angeles,CA|820Santa Barbara,CA|828Asheville,NC|830New Braunfels,TX|831Salinas,CA|" +
    "832Houston,TX|838Albany,NY|839Columbia,SC|840San Bernardino,CA|843Charleston,SC|845Poughkeepsie,NY|847Evanston,IL|" +
    "848New Brunswick,NJ|850Tallahassee,FL|854Charleston,SC|856Camden,NJ|857Boston,MA|858San Diego,CA|859Lexington,KY|860Hartford,CT|" +
    "862Newark,NJ|863Lakeland,FL|864Greenville,SC|865Knoxville,TN|870Jonesboro,AR|872Chicago,IL|878Pittsburgh,PA|901Memphis,TN|" +
    "903Tyler,TX|904Jacksonville,FL|906Marquette,MI|907Anchorage,AK|908Elizabeth,NJ|909San Bernardino,CA|910Fayetteville,NC|" +
    "912Savannah,GA|913Kansas City,KS|914Yonkers,NY|915El Paso,TX|916Sacramento,CA|917New York,NY|918Tulsa,OK|919Raleigh,NC|" +
    "920Green Bay,WI|925Concord,CA|928Flagstaff,AZ|929New York,NY|930Evansville,IN|931Clarksville,TN|934Islip,NY|936Conroe,TX|" +
    "937Dayton,OH|938Huntsville,AL|940Denton,TX|941Sarasota,FL|945Dallas,TX|947Troy,MI|949Irvine,CA|951Riverside,CA|952Bloomington,MN|" +
    "954Fort Lauderdale,FL|956Laredo,TX|959Hartford,CT|970Fort Collins,CO|971Portland,OR|972Dallas,TX|973Newark,NJ|978Lowell,MA|" +
    "979College Station,TX|980Charlotte,NC|984Raleigh,NC|985Houma,LA|986Boise,ID|989Saginaw,MI")
    .split("|").map((e) => [e.slice(0, 3), e.slice(3).split(",") as [string, string]]),
);

// "+1 (706) 610000 7" → "(706) 610-0007", the way every other number on the site is written.
export function formatUs(raw: string) {
  const d = raw.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : raw;
}

export function toGvNumber(n: ApiGvNumber): GvNumber {
  const number = formatUs(n.number);
  const area = number.slice(1, 4);
  const [city, state] = AREAS[area] ?? ["United States", "US"];
  // Numberland's TYPE: 1 half round, 2 fully round. Both count as easy to remember.
  return { id: String(n.id), pid: n.id, number, area, city, state, easy: n.round > 0, price: n.price };
}
