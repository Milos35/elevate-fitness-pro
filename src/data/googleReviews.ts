/**
 * Real Google reviews of Coach Milos (copied word for word from the Google Business Profile).
 * Only add reviews that exist on Google. Name exactly as Google shows it (first name + initial is fine).
 * The reviews block on /pricing, the homepage and /start stays hidden while this list is empty.
 */
export type GoogleReview = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** e.g. "2 months ago" or "March 2026", as shown on Google */
  when?: string;
};

export const GOOGLE_REVIEWS: GoogleReview[] = [];

/** Link to the Google profile / reviews (Google Business Profile → Share). Empty = no link shown. */
export const GOOGLE_REVIEWS_URL = "https://share.google/wP5iNYDmQFWqfwKMA";
