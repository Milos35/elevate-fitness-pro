import { Navigate, Route } from "react-router-dom";
import { ProgramContentGate } from "@/components/ProgramContentGate";
import { lazyRoute } from "@/lib/lazyRoute";
import HomePage from "@/pages/HomePage";
import { Suspense, type ReactNode } from "react";
import { RoutePageFallback } from "@/components/RoutePageFallback";

const ProgramPage = lazyRoute(() => import("@/pages/ProgramPage"));
const AppPage = lazyRoute(() => import("@/pages/AppPage"));
const TrainingPage = lazyRoute(() => import("@/pages/TrainingPage"));
const NutritionPage = lazyRoute(() => import("@/pages/NutritionPage"));
const FAQPage = lazyRoute(() => import("@/pages/FAQPage"));
const PricingPage = lazyRoute(() => import("@/pages/PricingPage"));
const CoachingApplyPage = lazyRoute(() => import("@/pages/CoachingApplyPage"));
const BlogIndexPage = lazyRoute(() => import("@/pages/BlogIndexPage"));
const BlogPostPage = lazyRoute(() => import("@/pages/BlogPostPage"));

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RoutePageFallback />}>{children}</Suspense>;
}

export function publicRouteElements() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route
        path="program"
        element={
          <Lazy>
            <ProgramPage />
          </Lazy>
        }
      />
      <Route
        path="app"
        element={
          <Lazy>
            <AppPage />
          </Lazy>
        }
      />
      <Route
        path="training"
        element={
          <Lazy>
            <ProgramContentGate>
              <TrainingPage />
            </ProgramContentGate>
          </Lazy>
        }
      />
      <Route
        path="nutrition"
        element={
          <Lazy>
            <ProgramContentGate>
              <NutritionPage />
            </ProgramContentGate>
          </Lazy>
        }
      />
      <Route path="results" element={<Navigate to="program" replace />} />
      <Route
        path="faq"
        element={
          <Lazy>
            <FAQPage />
          </Lazy>
        }
      />
      <Route
        path="pricing"
        element={
          <Lazy>
            <PricingPage />
          </Lazy>
        }
      />
      <Route
        path="coaching-apply"
        element={
          <Lazy>
            <CoachingApplyPage />
          </Lazy>
        }
      />
      <Route
        path="blog"
        element={
          <Lazy>
            <BlogIndexPage />
          </Lazy>
        }
      />
      <Route
        path="blog/:slug"
        element={
          <Lazy>
            <BlogPostPage />
          </Lazy>
        }
      />
    </>
  );
}
