# Swedish storefront coverage

## Goal
Fix every localization issue found in the theme audit while preserving English and merchant translations.

## Phases
1. Audit and inventory — complete.
2. Localize shared components and theme-owned copy — complete.
3. Validate language rendering, translation coverage, and theme syntax — complete.
4. Document Shopify-managed content limitations — complete.

## Decisions
- Use locale keys for fixed UI; translate known English setting values through a shared snippet so customized and already-translated values remain intact.
- Collection handles and destinations must remain independent of translated display names.
- Product, collection, page, menu, article, metafield and SEO content stored in Shopify is unavailable locally; do not invent replacements.

## Validation repairs
- Initial checker saw multiline Liquid literals before normalization; fixed with strip_newlines and single-line comparisons.
- Checker treats literal prefixes before append as full keys; assign completed menu translation keys before applying t.
