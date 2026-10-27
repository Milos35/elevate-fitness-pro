import { dadBodPost } from "./dad-bod";
import { fallenOffWagonPost } from "./fallen-off-wagon";
import { fiveFoodsBodybuildingPost } from "./five-foods-bodybuilding";
import { fourMistakesArmsPost } from "./four-mistakes-training-arms";
import { healthFitnessSupplementsPost } from "./health-fitness-supplements";
import { noTimeTooTiredPost } from "./no-time-too-tired";
import { onlineVsInPersonTrainerDubaiPost } from "./online-vs-in-person-personal-trainer-dubai";
import { tipsMuscleGrowthPost } from "./tips-muscle-growth";
import type { AppLanguage } from "@/i18n/constants";
import type { BlogBlock, BlogPost } from "./types";

export type { BlogBlock, BlogPost } from "./types";

export const blogPosts: BlogPost[] = [
  onlineVsInPersonTrainerDubaiPost,
  tipsMuscleGrowthPost,
  fiveFoodsBodybuildingPost,
  fourMistakesArmsPost,
  healthFitnessSupplementsPost,
  noTimeTooTiredPost,
  fallenOffWagonPost,
  dadBodPost,
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getHomepageFeaturedPosts(limit = 3): BlogPost[] {
  return blogPosts.filter((post) => post.featuredOnHomepage).slice(0, limit);
}

export function getBlogBlocks(post: BlogPost, lang: string): BlogBlock[] {
  const locale = lang.split("-")[0] as AppLanguage;
  const localized = post.blocksByLocale?.[locale];
  if (localized && localized.length > 0) return localized;
  return post.blocks;
}

export function hasLocalizedBlogBody(post: BlogPost, lang: string): boolean {
  const locale = lang.split("-")[0] as AppLanguage;
  if (locale === "en") return true;
  return Boolean(post.blocksByLocale?.[locale]?.length);
}

export { formatBlogDate } from "@/lib/formatBlogDate";
