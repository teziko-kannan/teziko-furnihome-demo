import type { Product, ProductKind, Review } from "@teziko/types";
import { hash, mulberry32 } from "./build";

type Group =
  | "seating"
  | "bed"
  | "table"
  | "storage"
  | "cooling"
  | "laundry"
  | "screen"
  | "kitchen"
  | "air"
  | "lighting"
  | "textile"
  | "wall";

const groupOf: Record<ProductKind, Group> = {
  sofa: "seating",
  sectional: "seating",
  armchair: "seating",
  "dining-chair": "seating",
  "office-chair": "seating",
  bed: "bed",
  "dining-table": "table",
  "coffee-table": "table",
  desk: "table",
  wardrobe: "storage",
  bookshelf: "storage",
  "tv-unit": "storage",
  refrigerator: "cooling",
  "air-conditioner": "cooling",
  "washing-machine": "laundry",
  dishwasher: "laundry",
  television: "screen",
  microwave: "kitchen",
  mixer: "kitchen",
  "air-purifier": "air",
  lamp: "lighting",
  rug: "textile",
  cushion: "textile",
  mirror: "wall",
  "wall-art": "wall",
  clock: "wall",
  vase: "wall",
  planter: "wall",
};

type T = [title: string, body: string];

const positive: Record<Group, T[]> = {
  seating: [
    [
      "Comfortable from day one",
      "Firm but not hard. We sit on it for hours watching cricket and nobody complains about back pain.",
    ],
    [
      "Colour matches the photos",
      "The fabric looks richer in person. Stitching is neat and the cushions kept their shape after a month.",
    ],
    [
      "Installation was quick",
      "The team assembled it in under 30 minutes and took all the packaging away.",
    ],
    [
      "Great value for the build",
      "Solid frame, no creaking. Feels more expensive than what we paid in the sale.",
    ],
    [
      "Perfect size for our flat",
      "Measured twice before ordering and it fits our living room exactly. Easy to move for cleaning.",
    ],
  ],
  bed: [
    [
      "Sturdy and silent",
      "No creaks at all, even with two kids jumping on it. Storage space is genuinely large.",
    ],
    [
      "Storage is a lifesaver",
      "All our extra quilts and suitcases fit underneath. The lift is smooth and stays open.",
    ],
    [
      "Looks premium",
      "The headboard finish is lovely and makes the bedroom look like a hotel room.",
    ],
    [
      "Good wood quality",
      "Grain looks natural and there were no rough edges. Delivery team was careful with our lift.",
    ],
  ],
  table: [
    [
      "Solid and well finished",
      "The top is smooth, no wobble on our tiled floor. Easy to wipe clean.",
    ],
    [
      "Just the right height",
      "Works perfectly with our chairs and sofa. Assembly took about 20 minutes.",
    ],
    ["Finish resists stains", "Spilled chai on day two, wiped it off with no mark. Very happy."],
    [
      "Great for working from home",
      "Plenty of space for a laptop and monitor. Cable grommet keeps it tidy.",
    ],
  ],
  storage: [
    [
      "Holds a lot",
      "More space inside than I expected. Shelves are thick and don't sag with books.",
    ],
    ["Neat doors and hinges", "Doors close softly and line up properly. The laminate looks good."],
    ["Good value", "Comparable units cost much more offline. Installation team was punctual."],
  ],
  cooling: [
    [
      "Cools quickly",
      "Room gets comfortable in about ten minutes even in May afternoons. Quiet at night.",
    ],
    [
      "Power bill went down",
      "Replaced a ten-year-old unit and the monthly bill dropped noticeably.",
    ],
    [
      "Installation was professional",
      "Technician arrived the next day and explained all the modes.",
    ],
    ["Spacious and well laid out", "Bottle rack and crisper are well designed. Ice forms fast."],
  ],
  laundry: [
    [
      "Clothes come out really clean",
      "Collars and kids' uniforms are much cleaner than with our old machine.",
    ],
    ["Very quiet", "We run it at night and can't hear it from the bedroom."],
    ["Easy to use", "Programs are clearly labelled. Quick wash is handy for daily loads."],
  ],
  screen: [
    [
      "Bright, sharp picture",
      "Colours pop in our sunny living room. 4K streaming looks excellent.",
    ],
    [
      "Smooth smart features",
      "Apps open fast and the voice remote understands Indian accents well.",
    ],
    ["Good sound for the size", "Didn't need a soundbar for everyday TV. Dialogue is clear."],
  ],
  kitchen: [
    ["Powerful motor", "Grinds idli batter smoothly and dry masalas finely. No overheating."],
    [
      "Auto menus actually work",
      "Tried the paneer tikka preset and it came out well. Easy to clean.",
    ],
    ["Solid build", "Jars feel heavy-duty and lids lock tightly. Worth the price."],
  ],
  air: [
    [
      "Noticeable difference",
      "AQI indoors drops from 180 to under 30 within half an hour. Sleep mode is silent.",
    ],
    ["Helps with allergies", "My son's morning sneezing reduced within a week."],
  ],
  lighting: [
    ["Warm, cosy light", "Makes the corner of our living room feel inviting. Sturdy base."],
    ["Beautiful in person", "The finish looks handmade in the best way. Easy to set up."],
  ],
  textile: [
    ["Lovely texture", "Soft, well made and the colours are true to the photos."],
    ["Feels handmade", "You can see the craft in it. Washes well and hasn't faded."],
    ["Great value", "Instantly made our living room look finished."],
  ],
  wall: [
    ["Statement piece", "Everyone who visits asks about it. Packaging was very secure."],
    ["Well made", "Good weight and finish. Hanging hardware was included."],
  ],
};

const mixed: T[] = [
  [
    "Good, but delivery was late",
    "Product quality is good. Delivery took three days longer than promised, though support kept me updated.",
  ],
  [
    "Nice, slightly different shade",
    "Colour is a little lighter than the photos in our light. Still happy overall.",
  ],
  [
    "Decent for the price",
    "Does what it says. A few finishing touches could be better but no real complaints.",
  ],
];

const negative: T[] = [
  [
    "Had to request a replacement",
    "One part arrived scratched. The replacement came within a week, but it was a hassle.",
  ],
];

const first = [
  "Ananya",
  "Rohit",
  "Priya",
  "Karthik",
  "Meera",
  "Arjun",
  "Sneha",
  "Vikram",
  "Divya",
  "Rahul",
  "Ishita",
  "Aditya",
  "Neha",
  "Siddharth",
  "Pooja",
  "Manish",
  "Kavya",
  "Nikhil",
  "Riya",
  "Harsh",
  "Lakshmi",
  "Farhan",
  "Tanvi",
  "Gaurav",
  "Swati",
  "Imran",
  "Nandini",
  "Varun",
];
const last = ["S.", "R.", "K.", "M.", "P.", "D.", "N.", "G.", "A.", "T.", "B.", "V."];
const cities = [
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Delhi",
  "Gurugram",
  "Noida",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Indore",
  "Chandigarh",
  "Lucknow",
  "Coimbatore",
];

function pick<X>(arr: X[], r: () => number): X {
  return arr[Math.floor(r() * arr.length)]!;
}

const NOW = Date.UTC(2026, 10, 15);

/** Generates 3 to 5 seeded demo reviews per product. All are marked `demo: true`. */
export function generateReviews(products: Pick<Product, "id" | "kind" | "listedAt">[]): Review[] {
  const out: Review[] = [];
  for (const p of products) {
    const r = mulberry32(hash(p.id));
    const count = 3 + Math.floor(r() * 3);
    const pool = positive[groupOf[p.kind]];
    const used = new Set<string>();
    const listed = Date.parse(p.listedAt);
    for (let i = 0; i < count; i++) {
      const roll = r();
      let rating: Review["rating"];
      let tpl: T;
      if (roll < 0.07) {
        rating = 2;
        tpl = pick(negative, r);
      } else if (roll < 0.25) {
        rating = (3 + Math.floor(r() * 2)) as 3 | 4;
        tpl = pick(mixed, r);
      } else {
        rating = r() < 0.65 ? 5 : 4;
        tpl = pick(pool, r);
      }
      if (used.has(tpl[0])) tpl = pool.find((t) => !used.has(t[0])) ?? tpl;
      used.add(tpl[0]);
      const span = Math.max(NOW - listed, 3 * 86400000);
      const created = new Date(listed + Math.floor(r() * span));
      out.push({
        id: `${p.id}-r${i + 1}`,
        productId: p.id,
        author: `${pick(first, r)} ${pick(last, r)}`,
        city: pick(cities, r),
        rating,
        title: tpl[0],
        body: tpl[1],
        createdAt: created.toISOString(),
        verified: r() < 0.8,
        demo: true,
        helpful: Math.floor(r() * 24),
      });
    }
  }
  return out;
}
