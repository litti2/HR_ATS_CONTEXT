// =============================================================================
// College Tier List — Used for tie-breaker scoring
// =============================================================================

export interface CollegeTier {
  tier: number;
  score: number;
  keywords: string[];
}

export const COLLEGE_TIERS: CollegeTier[] = [
  {
    tier: 1,
    score: 5.0,
    keywords: [
      'iit bombay', 'iit delhi', 'iit madras', 'iit kanpur', 'iit kharagpur',
      'iit roorkee', 'iit guwahati', 'iit hyderabad', 'iit bhu', 'iit varanasi',
      'iit indore', 'iit mandi', 'iit patna', 'iit jodhpur', 'iit gandhinagar',
      'iit ropar', 'iit tirupati', 'iit dhanbad', 'iit ism',
      'iit bhilai', 'iit goa', 'iit jammu', 'iit dharwad',
      'indian institute of technology',
      'iisc', 'iisc bangalore', 'indian institute of science',
    ],
  },
  {
    tier: 2,
    score: 4.0,
    keywords: [
      // NITs
      'nit trichy', 'nit tiruchirappalli', 'nit warangal', 'nit surathkal',
      'nit karnataka', 'nit calicut', 'nit rourkela', 'nit allahabad', 'mnnit',
      'nit nagpur', 'vnit', 'nit jaipur', 'mnit', 'nit kurukshetra',
      'nit durgapur', 'nit hamirpur', 'nit silchar', 'nit srinagar',
      'nit bhopal', 'manit', 'nit patna', 'nit raipur', 'nit agartala',
      'nit meghalaya', 'nit mizoram', 'nit manipur', 'nit arunachal',
      'nit sikkim', 'nit uttarakhand', 'nit goa', 'nit delhi',
      'national institute of technology',
      // BITS
      'bits pilani', 'bits goa', 'bits hyderabad', 'birla institute of technology and science',
      // IIITs
      'iiit hyderabad', 'iiit-h', 'iiith', 'international institute of information technology hyderabad',
      'iiit delhi', 'iiit-d', 'iiitd', 'indraprastha institute of information technology',
      'iiit allahabad', 'iiit-a', 'iiita',
      'iiit bangalore', 'iiit-b', 'iiitb',
      // Delhi
      'dtu', 'delhi technological university', 'dce', 'delhi college of engineering',
      'nsut', 'netaji subhas university of technology', 'nsit', 'netaji subhas institute of technology',
      'igdtuw',
      // Others
      'coep', 'college of engineering pune', 'coep technological university',
      'iiest', 'iiest shibpur', 'indian institute of engineering science and technology',
      'jadavpur university', 'jadavpur',
      'vit', 'vit vellore', 'vellore institute of technology',
      'thapar', 'thapar university', 'thapar institute',
      'pec chandigarh', 'punjab engineering college',
      'manipal', 'manipal institute of technology', 'mit manipal',
      'srm', 'srm university', 'srm institute',
    ],
  },
  {
    tier: 3,
    score: 3.0,
    keywords: [
      // This tier catches other recognized engineering colleges
      // via fallback matching — if a college isn't in Tier 1 or 2,
      // but contains engineering/technology/institute keywords, it lands here
      'university', 'institute of technology', 'engineering college',
      'technical university', 'polytechnic',
    ],
  },
];

// Tier 4 (score 2.0) is the default for any college not matched above
export const DEFAULT_TIER_SCORE = 2.0;
export const DEFAULT_TIER = 4;
