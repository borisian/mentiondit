/**
 * Discovery filter data — what a candidate entity must *not* be.
 *
 * The main mechanism lives in `discovery.ts` and is corpus-derived: a proper noun
 * is virtually never written in lower case, so `isCommonNoun` kills "Food",
 * "Amazing" and "No" without anyone maintaining a list. These sets exist only for
 * the classes that mechanism provably cannot see, because they are *always*
 * capitalised. When a bad result shows up, tune the ratio first — appending a word
 * here should be the last resort, not the reflex.
 */

/** Demonyms, calendar names and jargon: real capitalised words, never the answer. */
export const NOT_A_BRAND = new Set([
  // Demonyms — describe a cuisine or origin, never the venue.
  "american", "british", "canadian", "chinese", "french", "german", "greek", "indian",
  "italian", "japanese", "korean", "mexican", "persian", "polish", "portuguese",
  "russian", "spanish", "thai", "turkish", "vietnamese", "irish", "scottish", "dutch",
  "iranian", "iraqi", "israeli", "egyptian", "filipino", "malaysian", "indonesian",
  "taiwanese", "cantonese", "sichuan", "nordic", "swedish", "danish", "norwegian",
  "brazilian", "argentine", "peruvian", "ethiopian", "lebanese", "moroccan", "asian",
  "european", "african", "latin", "caribbean", "mediterranean", "cajun", "creole",
  // Calendar.
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "january", "february", "march", "april", "may", "june", "july", "august",
  "september", "october", "november", "december",
  // Reddit and forum jargon.
  "reddit", "redditor", "redditors", "subreddit", "automod", "automoderator",
  "removed", "deleted", "tldr", "imo", "imho", "ymmv", "fwiw", "iirc", "afaik",
  "nsfw", "psa", "lol", "lmao", "wtf", "omg", "btw", "aka", "etc",
  // Generic place vocabulary — capitalised inside addresses, never a venue alone.
  "north", "south", "east", "west", "central", "downtown", "uptown", "midtown",
  "city", "town", "street", "avenue", "road", "district", "village", "area",
  // Product-line filler that attaches to a real name ("Pro", "Max") but never stands alone.
  "pro", "max", "ultra", "plus", "mini", "lite", "gen",
  // Frequent capitalised openers a small corpus may not see enough of in lower case.
  "the", "this", "that", "there", "they", "what", "when", "where", "which", "who",
  "how", "and", "but", "for", "not", "you", "your", "our", "its", "just", "also",
  "well", "yes", "yeah", "edit", "one", "two", "first", "last", "next", "even",
  "still", "because", "however", "though", "honestly", "personally", "actually",
]);

/**
 * Countries and major cities.
 *
 * KNOWN TRADE-OFF: this set is a property of the word, not of the question, so it
 * is wrong whenever a place *is* the answer — "best city to visit in Europe" has
 * every valid answer deleted before counting. It earns its place anyway because
 * the corpus-derived filters cannot reach these: for "best ramen in Paris",
 * "Tokyo" and "Japan" appear in neither the query nor the thread titles, and
 * without this set they outrank every actual ramen shop. Revisit if the product
 * ever takes place-seeking questions seriously.
 *
 * Only exact single-word candidates are matched, so a venue named "Tokyo Ramen"
 * still comes through.
 */
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

/** Words that carry no intent in a search query, used to score thread relevance. */
export const QUERY_STOPWORDS = new Set([
  "best", "top", "good", "great", "better", "worth", "cheap", "recommend",
  "recommendation", "recommendations", "any", "some", "the", "and", "for", "with",
  "what", "which", "where", "who", "how", "are", "you", "your", "guys", "near",
  "under", "over", "about", "from", "into", "this", "that", "have", "has", "there",
]);
