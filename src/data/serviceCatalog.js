/**
 * Admin service catalog: 5 top-level categories (parent: null) with child services.
 * Used by seed script and provider catalog endpoints.
 */
const SERVICE_CATALOG = [
  {
    name: "سجاد وموكيت",
    icon: "carpet",
    children: [
      { name: "غسيل سجاد", unit: "per_kg" },
      { name: "غسيل موكيت", unit: "per_kg" },
      { name: "تنظيف سجاد بالبخار", unit: "per_kg" },
    ],
  },
  {
    name: "ستائر",
    icon: "curtains",
    children: [
      { name: "غسيل ستائر", unit: "per_set" },
      { name: "كوي ستائر", unit: "per_set" },
      { name: "تنظيف ستائر", unit: "per_meter" },
    ],
  },
  {
    name: "ملابس",
    icon: "clothes",
    children: [
      { name: "غسيل ملابس", unit: "per_piece" },
      { name: "كوي", unit: "per_piece" },
      { name: "تنظيف جاف", unit: "per_piece" },
      { name: "غسيل بالبخار", unit: "per_piece" },
    ],
  },
  {
    name: "\u0645\u0641\u0631\u0648\u0634\u0627\u062a",
    icon: "furnishings",
    children: [
      { name: "غسيل بطانيات", unit: "per_piece" },
      { name: "غسيل أغطية", unit: "per_piece" },
      { name: "تنظيف كنب", unit: "per_piece" },
      { name: "غسيل مخدات", unit: "per_piece" },
    ],
  },
  {
    name: "شنط وأحذية",
    icon: "bags-shoes",
    children: [
      { name: "تنظيف شنط جلد", unit: "per_piece" },
      { name: "تنظيف شنط قماش", unit: "per_piece" },
      { name: "تنظيف أحذية", unit: "per_piece" },
    ],
  },
];

const FURNISHINGS = "\u0645\u0641\u0631\u0648\u0634\u0627\u062a";

/** Legacy flat/top-level service names → target category name */
const LEGACY_SERVICE_TO_CATEGORY = {
  "غسيل سجاد": "سجاد وموكيت",
  "غسيل موكيت": "سجاد وموكيت",
  "غسيل ستائر": "ستائر",
  "غسيل ملابس": "ملابس",
  "كوي": "ملابس",
  "تنظيف جاف": "ملابس",
  "غسيل بالبخار": "ملابس",
  "غسيل بطانيات": FURNISHINGS,
  "غسيل أغطية": FURNISHINGS,
  "تنظيف كنب": FURNISHINGS,
  "غسيل مخدات": FURNISHINGS,
  "تنظيف شنط جلد": "شنط وأحذية",
  "تنظيف شنط قماش": "شنط وأحذية",
  "تنظيف أحذية": "شنط وأحذية",
};

const CATEGORY_NAMES = SERVICE_CATALOG.map((c) => c.name);

/** English legacy categories to remove after migration */
const LEGACY_ENGLISH_CATEGORIES = ["Washing", "Dry Cleaning", "Ironing"];

module.exports = {
  SERVICE_CATALOG,
  LEGACY_SERVICE_TO_CATEGORY,
  CATEGORY_NAMES,
  LEGACY_ENGLISH_CATEGORIES,
};
