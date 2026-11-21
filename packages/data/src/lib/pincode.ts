/* Client-safe Indian PIN code helpers (approximate postal-circle mapping, good enough for a demo). */

type Range = [from: number, to: number, states: string[]];

/** 3-digit PIN prefixes → state(s). Ranges follow India Post postal circles. */
const RANGES: Range[] = [
  [110, 110, ["Delhi"]],
  [121, 136, ["Haryana"]],
  [140, 159, ["Punjab"]],
  [160, 160, ["Chandigarh", "Punjab"]],
  [171, 177, ["Himachal Pradesh"]],
  [180, 193, ["Jammu and Kashmir"]],
  [194, 194, ["Ladakh"]],
  [201, 243, ["Uttar Pradesh"]],
  [244, 263, ["Uttarakhand", "Uttar Pradesh"]],
  [270, 285, ["Uttar Pradesh"]],
  [301, 345, ["Rajasthan"]],
  [360, 396, ["Gujarat"]],
  [396, 396, ["Dadra and Nagar Haveli and Daman and Diu", "Gujarat"]],
  [400, 402, ["Maharashtra"]],
  [403, 403, ["Goa"]],
  [404, 445, ["Maharashtra"]],
  [450, 488, ["Madhya Pradesh"]],
  [490, 497, ["Chhattisgarh"]],
  [500, 509, ["Telangana"]],
  [515, 535, ["Andhra Pradesh"]],
  [560, 591, ["Karnataka"]],
  [600, 643, ["Tamil Nadu"]],
  [605, 605, ["Puducherry", "Tamil Nadu"]],
  [670, 695, ["Kerala"]],
  [682, 682, ["Lakshadweep", "Kerala"]],
  [700, 743, ["West Bengal"]],
  [737, 737, ["Sikkim"]],
  [744, 744, ["Andaman and Nicobar Islands"]],
  [751, 770, ["Odisha"]],
  [781, 788, ["Assam"]],
  [790, 792, ["Arunachal Pradesh"]],
  [793, 794, ["Meghalaya"]],
  [795, 795, ["Manipur"]],
  [796, 796, ["Mizoram"]],
  [797, 798, ["Nagaland"]],
  [799, 799, ["Tripura"]],
  [800, 813, ["Bihar"]],
  [814, 835, ["Jharkhand", "Bihar"]],
  [840, 855, ["Bihar"]],
];

/** States a PIN can belong to, or [] when the PIN is not a valid Indian PIN. */
export function statesForPincode(pin: string): string[] {
  if (!/^[1-8]\d{5}$/.test(pin)) return [];
  const p3 = Number(pin.slice(0, 3));
  // Most specific (narrowest) range first, so e.g. 737 → Sikkim before West Bengal.
  const matches = RANGES.filter(([a, b]) => p3 >= a && p3 <= b)
    .sort((x, y) => x[1] - x[0] - (y[1] - y[0]))
    .flatMap(([, , s]) => s);
  return [...new Set(matches)];
}

export function isServiceablePincode(pin: string) {
  return statesForPincode(pin).length > 0;
}

/** Major cities → state, used to catch obvious city/state mismatches. */
const CITY_STATE: Record<string, string> = {
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  nagpur: "Maharashtra",
  thane: "Maharashtra",
  "navi mumbai": "Maharashtra",
  nashik: "Maharashtra",
  delhi: "Delhi",
  "new delhi": "Delhi",
  bengaluru: "Karnataka",
  bangalore: "Karnataka",
  mysuru: "Karnataka",
  mysore: "Karnataka",
  mangaluru: "Karnataka",
  chennai: "Tamil Nadu",
  coimbatore: "Tamil Nadu",
  madurai: "Tamil Nadu",
  hyderabad: "Telangana",
  secunderabad: "Telangana",
  warangal: "Telangana",
  visakhapatnam: "Andhra Pradesh",
  vijayawada: "Andhra Pradesh",
  kolkata: "West Bengal",
  howrah: "West Bengal",
  ahmedabad: "Gujarat",
  surat: "Gujarat",
  vadodara: "Gujarat",
  rajkot: "Gujarat",
  jaipur: "Rajasthan",
  jodhpur: "Rajasthan",
  udaipur: "Rajasthan",
  lucknow: "Uttar Pradesh",
  noida: "Uttar Pradesh",
  kanpur: "Uttar Pradesh",
  varanasi: "Uttar Pradesh",
  ghaziabad: "Uttar Pradesh",
  gurugram: "Haryana",
  gurgaon: "Haryana",
  faridabad: "Haryana",
  chandigarh: "Chandigarh",
  kochi: "Kerala",
  cochin: "Kerala",
  thiruvananthapuram: "Kerala",
  trivandrum: "Kerala",
  kozhikode: "Kerala",
  bhopal: "Madhya Pradesh",
  indore: "Madhya Pradesh",
  patna: "Bihar",
  ranchi: "Jharkhand",
  bhubaneswar: "Odisha",
  guwahati: "Assam",
  raipur: "Chhattisgarh",
  dehradun: "Uttarakhand",
  shimla: "Himachal Pradesh",
  srinagar: "Jammu and Kashmir",
  panaji: "Goa",
};

export type AddressCheck =
  { ok: true } | { ok: false; field: "pincode" | "state" | "city"; message: string };

/** Cross-field address check: PIN must be valid and belong to the state; known cities must match the state. */
export function checkAddressConsistency(a: {
  pincode: string;
  state: string;
  city: string;
}): AddressCheck {
  const states = statesForPincode(a.pincode);
  if (states.length === 0)
    return {
      ok: false,
      field: "pincode",
      message: "This PIN code isn't valid or isn't serviceable",
    };
  if (a.state && !states.includes(a.state)) {
    return {
      ok: false,
      field: "state",
      message: `PIN ${a.pincode} is in ${states.join(" / ")}, not ${a.state}`,
    };
  }
  const cityState = CITY_STATE[a.city.trim().toLowerCase()];
  if (cityState && a.state && cityState !== a.state) {
    return {
      ok: false,
      field: "city",
      message: `${a.city.trim()} is in ${cityState}, not ${a.state}`,
    };
  }
  return { ok: true };
}

/** Extra transit days from the Bhiwandi (Maharashtra) warehouse, by destination state. */
const ZONE_EXTRA: Record<string, number> = {
  Maharashtra: 0,
  Goa: 1,
  Gujarat: 1,
  "Madhya Pradesh": 1,
  Karnataka: 1,
  Telangana: 1,
  "Dadra and Nagar Haveli and Daman and Diu": 1,
  Chhattisgarh: 2,
  "Andhra Pradesh": 2,
  Rajasthan: 2,
  Delhi: 2,
  Haryana: 2,
  "Tamil Nadu": 2,
  Puducherry: 2,
  Kerala: 2,
  "Uttar Pradesh": 2,
  Chandigarh: 2,
  Punjab: 3,
  Uttarakhand: 3,
  "West Bengal": 3,
  Odisha: 3,
  Bihar: 3,
  Jharkhand: 3,
  "Himachal Pradesh": 3,
  "Jammu and Kashmir": 4,
  Assam: 4,
  Sikkim: 4,
  Meghalaya: 5,
  Tripura: 5,
  Manipur: 5,
  Mizoram: 5,
  Nagaland: 5,
  "Arunachal Pradesh": 5,
  Ladakh: 6,
  Lakshadweep: 7,
  "Andaman and Nicobar Islands": 7,
};

/** Delivery window for a PIN, or null when not serviceable. */
export function deliveryEstimate(pin: string, base: [number, number]) {
  const states = statesForPincode(pin);
  if (states.length === 0) return null;
  const state = states[0]!;
  const extra = ZONE_EXTRA[state] ?? 3;
  return { state, extra, days: [base[0] + extra, base[1] + extra] as [number, number] };
}
