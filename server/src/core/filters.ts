export const NOT_A_BRAND = new Set([
  // Demonyms
  "american", "british", "canadian", "chinese", "french", "german", "greek", "indian",
  "italian", "japanese", "korean", "mexican", "persian", "polish", "portuguese",
  "russian", "spanish", "thai", "turkish", "vietnamese", "irish", "scottish", "dutch",
  "iranian", "iraqi", "israeli", "egyptian", "filipino", "malaysian", "indonesian",
  "taiwanese", "cantonese", "sichuan", "nordic", "swedish", "danish", "norwegian",
  "brazilian", "argentine", "peruvian", "ethiopian", "lebanese", "moroccan", "asian",
  "european", "african", "latin", "caribbean", "mediterranean", "cajun", "creole",
  // Calendar
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "january", "february", "march", "april", "may", "june", "july", "august",
  "september", "october", "november", "december",
  // Forum jargon
  "reddit", "redditor", "redditors", "subreddit", "automod", "automoderator",
  "removed", "deleted", "tldr", "imo", "imho", "ymmv", "fwiw", "iirc", "afaik",
  "nsfw", "psa", "lol", "lmao", "wtf", "omg", "btw", "aka", "etc",
  // Place vocabulary
  "north", "south", "east", "west", "central", "downtown", "uptown", "midtown",
  "city", "town", "street", "avenue", "road", "district", "village", "area",
  // Product variants
  "pro", "max", "ultra", "plus", "mini", "lite", "gen",
  // Sentence openers
  "the", "this", "that", "there", "they", "what", "when", "where", "which", "who",
  "how", "and", "but", "for", "not", "you", "your", "our", "its", "just", "also",
  "well", "yes", "yeah", "edit", "one", "two", "first", "last", "next", "even",
  "still", "because", "however", "though", "honestly", "personally", "actually",
]);

// Exact one-word exclusions; place answers are a known tradeoff.
export const PLACES = new Set([
  "afghanistan", "argentina", "australia", "austria", "belgium", "brazil", "britain",
  "cambodia", "canada", "chile", "china", "colombia", "croatia", "cuba", "czechia",
  "denmark", "egypt", "england", "estonia", "europe", "finland", "france", "germany",
  "greece", "hungary", "iceland", "india", "indonesia", "iran", "iraq", "ireland",
  "israel", "italy", "japan", "jordan", "kenya", "korea", "laos", "lebanon",
  "malaysia", "mexico", "morocco", "nepal", "netherlands", "norway", "pakistan",
  "peru", "philippines", "poland", "portugal", "romania", "russia", "scotland",
  "singapore", "slovakia", "slovenia", "spain", "sweden", "switzerland", "taiwan",
  "thailand", "tunisia", "turkey", "ukraine", "uruguay", "vietnam", "wales",
  "america", "asia", "africa", "california", "florida", "texas", "ontario", "quebec",
  "amsterdam", "athens", "atlanta", "austin", "bangkok", "barcelona", "beijing",
  "berlin", "boston", "brisbane", "brussels", "budapest", "cairo", "calgary",
  "chicago", "copenhagen", "dallas", "delhi", "denver", "dubai", "dublin",
  "edinburgh", "florence", "geneva", "glasgow", "hanoi", "helsinki", "houston",
  "istanbul", "jakarta", "kyoto", "lima", "lisbon", "lisboa", "london", "madrid",
  "manchester", "manila", "melbourne", "miami", "milan", "montreal", "moscow",
  "mumbai", "munich", "nagoya", "naples", "nashville", "osaka", "oslo", "ottawa",
  "paris", "philadelphia", "phoenix", "porto", "prague", "reykjavik", "rome",
  "sapporo", "seattle", "seoul", "shanghai", "sofia", "stockholm", "sydney",
  "taipei", "tokyo", "toronto", "valencia", "vancouver", "venice", "vienna",
  "warsaw", "zurich", "brooklyn", "manhattan", "queens", "bronx", "portland",
]);

export const QUERY_STOPWORDS = new Set([
  "best", "top", "good", "great", "better", "worth", "cheap", "recommend",
  "recommendation", "recommendations", "any", "some", "the", "and", "for", "with",
  "what", "which", "where", "who", "how", "are", "you", "your", "guys", "near",
  "under", "over", "about", "from", "into", "this", "that", "have", "has", "there",
]);
