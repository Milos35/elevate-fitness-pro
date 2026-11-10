import { creatineAfter40Post } from "./creatine-after-40";
import { dadBodPost } from "./dad-bod";
import { deadliftSafelyAfter40Post } from "./how-to-deadlift-safely-after-40";
import { fallenOffWagonPost } from "./fallen-off-wagon";
import { fiveFoodsBodybuildingPost } from "./five-foods-bodybuilding";
import { fourMistakesArmsPost } from "./four-mistakes-training-arms";
import { loseWeightWithoutCountingCaloriesPost } from "./lose-weight-without-counting-calories-after-40";
import { howMuchProteinAfter40Post } from "./how-much-protein-per-day-after-40";
import { strengthTrainingWomenOver40Post } from "./strength-training-for-women-over-40";
import { hotelRoomWorkoutPost } from "./hotel-room-workout-no-equipment";
import { healthFitnessSupplementsPost } from "./health-fitness-supplements";
import { increaseTestosteroneNaturallyPost } from "./increase-testosterone-naturally-after-40";
import { noTimeTooTiredPost } from "./no-time-too-tired";
import { personalTrainerDubaiCostPost } from "./personal-trainer-dubai-cost";
import { onlineVsInPersonTrainerDubaiPost } from "./online-vs-in-person-personal-trainer-dubai";
import { vitaminDDeficiencyDubaiPost } from "./vitamin-d-deficiency-dubai";
import { tipsMuscleGrowthPost } from "./tips-muscle-growth";
import type { AppLanguage } from "@/i18n/constants";
import { loseBellyFatAfter35Post } from "./how-to-lose-belly-fat-after-35";
import { twentyTwoMinuteWorkoutBuildMusclePost } from "./22-minute-workout-build-muscle";
import { workoutInDubaiHeatPost } from "./workout-in-dubai-heat";
import { squatSafelyAfter40Post } from "./how-to-squat-safely-after-40";
import type { BlogBlock, BlogPost } from "./types";

export type { BlogBlock, BlogPost } from "./types";

export const blogPosts: BlogPost[] = [
  squatSafelyAfter40Post,
  workoutInDubaiHeatPost,
  twentyTwoMinuteWorkoutBuildMusclePost,
  loseBellyFatAfter35Post,
  creatineAfter40Post,
  strengthTrainingWomenOver40Post,
  howMuchProteinAfter40Post,
  personalTrainerDubaiCostPost,
  hotelRoomWorkoutPost,
  deadliftSafelyAfter40Post,
  vitaminDDeficiencyDubaiPost,
  increaseTestosteroneNaturallyPost,
  loseWeightWithoutCountingCaloriesPost,
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
