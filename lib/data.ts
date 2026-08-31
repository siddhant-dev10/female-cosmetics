export type Product = {
  slug: string;
  name: string;
  category: "Skin" | "Makeup" | "Lips" | "Sets";
  eyebrow: string;
  description: string;
  longDescription: string;
  price: number;
  compareAt: number;
  rating: number;
  reviews: number;
  badge: string;
  finish: string;
  image: string;
  color: string;
  ingredients: string[];
  shades?: string[];
};

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=88`;

export const products: Product[] = [
  {
    slug: "cloud-veil-spf-50",
    name: "Cloud Veil SPF 50",
    category: "Skin",
    eyebrow: "Sun care",
    description: "Weightless daily sun fluid",
    longDescription: "A featherlight, no-white-cast SPF 50 that disappears into skin with a soft, healthy sheen. Wear it alone or under makeup, every single day.",
    price: 1699,
    compareAt: 1899,
    rating: 4.9,
    reviews: 286,
    badge: "Bestseller",
    finish: "Dewy",
    image: image("photo-1556228720-195a672e8a03"),
    color: "#d6c6e4",
    ingredients: ["Niacinamide", "Green tea", "UVA + UVB filters"],
    shades: ["Universal veil"]
  },
  {
    slug: "dew-drop-barrier-serum",
    name: "Dew Drop Barrier Serum",
    category: "Skin",
    eyebrow: "Serums",
    description: "5% niacinamide + ceramides",
    longDescription: "A calm, cushiony serum that helps support the skin barrier while bringing tired-looking skin back to a soft, lit-from-within finish.",
    price: 1299,
    compareAt: 1499,
    rating: 4.8,
    reviews: 412,
    badge: "Skin favourite",
    finish: "Radiant",
    image: image("photo-1620916566398-39f1143ab7be"),
    color: "#e6d7ef",
    ingredients: ["5% Niacinamide", "Ceramides", "Panthenol"],
    shades: ["One nourishing formula"]
  },
  {
    slug: "soft-focus-skin-tint",
    name: "Soft Focus Skin Tint",
    category: "Makeup",
    eyebrow: "Complexion",
    description: "Buildable, breathable coverage",
    longDescription: "Your skin, with the volume turned up. A breathable tint with buildable coverage, skincare-minded ingredients and a blurred, real-skin finish.",
    price: 1499,
    compareAt: 1699,
    rating: 4.7,
    reviews: 328,
    badge: "New",
    finish: "Soft matte",
    image: image("photo-1596462502278-27bfdc403348"),
    color: "#e7c9bd",
    ingredients: ["Squalane", "Vitamin E", "Soft-focus powders"],
    shades: ["01 Porcelain", "02 Sand", "03 Honey", "04 Cocoa"]
  },
  {
    slug: "moonlight-cream-blush",
    name: "Moonlight Cream Blush",
    category: "Makeup",
    eyebrow: "Cheeks",
    description: "Melt-in colour for cheeks",
    longDescription: "A fingertip-friendly cream blush that melts into cheeks, lips and the day. Build your flush from barely-there to candlelit in a few taps.",
    price: 999,
    compareAt: 1099,
    rating: 4.8,
    reviews: 264,
    badge: "Fan favourite",
    finish: "Dewy",
    image: image("photo-1612817288484-6f916006741a"),
    color: "#ebc9d4",
    ingredients: ["Jojoba oil", "Vitamin E", "Berry pigments"],
    shades: ["Rosewater", "Mauve hour", "Apricot dusk"]
  },
  {
    slug: "plump-theory-lip-oil",
    name: "Plump Theory Lip Oil",
    category: "Lips",
    eyebrow: "Lips",
    description: "Glossy hydration, sheer tint",
    longDescription: "A juicy lip oil with a sheer veil of colour and a comfortable, glassy finish. The kind of gloss you reach for without thinking.",
    price: 799,
    compareAt: 899,
    rating: 4.9,
    reviews: 508,
    badge: "Bestseller",
    finish: "Radiant",
    image: image("photo-1586495777744-4413f21062fa"),
    color: "#d9adb9",
    ingredients: ["Hyaluronic acid", "Cherry seed oil", "Vitamin E"],
    shades: ["Glass", "Berry flush"]
  },
  {
    slug: "velvet-matte-lip-colour",
    name: "Velvet Matte Lip Colour",
    category: "Lips",
    eyebrow: "Lips",
    description: "Comfort matte in 8 shades",
    longDescription: "A modern matte that glides on, stays comfortable and leaves lips looking plush — never flat. Eight shades for every version of you.",
    price: 899,
    compareAt: 999,
    rating: 4.6,
    reviews: 197,
    badge: "8 shades",
    finish: "Soft matte",
    image: image("photo-1596462502278-27bfdc403348"),
    color: "#c58b97",
    ingredients: ["Squalane", "Meadowfoam oil", "Mineral pigments"],
    shades: ["Nude note", "Berry good", "After hours", "Rose code"]
  },
  {
    slug: "cloud-milk-cleanser",
    name: "Cloud Milk Cleanser",
    category: "Skin",
    eyebrow: "Cleansers",
    description: "A milky reset for real skin",
    longDescription: "A low-foam, milky cleanser that lifts away the day without leaving skin tight, squeaky or asking for an apology.",
    price: 899,
    compareAt: 999,
    rating: 4.8,
    reviews: 173,
    badge: "Gentle",
    finish: "Dewy",
    image: image("photo-1556229010-6c3f2c9ca5f8"),
    color: "#ded8ea",
    ingredients: ["Oat extract", "Glycerin", "Rice ferment"],
    shades: ["One gentle formula"]
  },
  {
    slug: "the-everyday-ritual-set",
    name: "The Everyday Ritual Set",
    category: "Sets",
    eyebrow: "Sets",
    description: "Three essentials, one easy ritual",
    longDescription: "Cloud Milk Cleanser, Dew Drop Barrier Serum and Cloud Veil SPF 50, wrapped together for a complete morning ritual and a little saving.",
    price: 2999,
    compareAt: 3597,
    rating: 5,
    reviews: 88,
    badge: "Save 16%",
    finish: "Radiant",
    image: image("photo-1608248543803-ba4f8c70ae0b"),
    color: "#cbc2e2",
    ingredients: ["Three full-size essentials", "Vegan formulas", "Signature violet wrap"]
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
