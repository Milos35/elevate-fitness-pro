import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell, Home, Zap } from "lucide-react";
import coachTraining from "@/assets/coach-training.webp";
import type { WorkoutPlan } from "@/data/busyStrong90";
import { useMemberWorkoutsCms } from "@/hooks/useMemberWorkoutsCms";
import { PageMeta } from "@/components/seo/PageMeta";
import { usePricing } from "@/hooks/usePricing";

const WorkoutCard = ({ workout, labels }: { workout: WorkoutPlan; labels: { sets: string; reps: string; rest: string; finisher: string; warmup: string } }) => (
  <div className="glass-card overflow-hidden">
    <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 border-b border-border/50">
      <h3 className="text-xl font-black">{workout.title}</h3>
      <p className="text-sm text-primary mt-1">{workout.focus}</p>
      <p className="text-xs text-muted-foreground mt-2">
        {labels.warmup} {workout.warmup}
      </p>
    </div>
    <div className="divide-y divide-border/50">
      {workout.exercises.map((ex) => (
        <div key={ex.order} className="p-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="text-xs text-primary font-bold me-2">{String(ex.order).padStart(2, "0")}</span>
              <span className="font-semibold text-sm">{ex.name}</span>
              <span className="text-xs text-muted-foreground ms-2">— {ex.target}</span>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              {ex.sets} {labels.sets}
            </span>
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              {ex.reps} {labels.reps}
            </span>
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              {ex.rest} {labels.rest}
            </span>
          </div>
          <p className="text-xs text-muted-foreground italic">💡 {ex.tip}</p>
        </div>
      ))}
    </div>
    <div className="bg-primary/5 p-4 border-t border-border/50">
      <p className="text-xs font-medium">
        <span className="text-primary font-bold">{labels.finisher}</span> {workout.finisher}
      </p>
    </div>
  </div>
);

const TrainingPage = () => {
  const { t } = useTranslation("training");
  const pricing = usePricing();
  const { gymWorkouts, emergencyWorkouts } = useMemberWorkoutsCms();
  const gymList = [gymWorkouts.a, gymWorkouts.b, gymWorkouts.c] as WorkoutPlan[];
  const labels = {
    sets: t("labels.sets"),
    reps: t("labels.reps"),
    rest: t("labels.rest"),
    finisher: t("labels.finisher"),
    warmup: t("labels.warmup"),
  };

  return (
    <div>
      <PageMeta title={t("meta.title")} description={t("meta.description")} path="/training" noindex />
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={coachTraining}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">{t("hero.eyebrow")}</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            {t("hero.headline")} <span className="text-gradient">{t("hero.headlineHighlight")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("hero.subhead")}</p>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <div className="glass-card px-5 py-3 flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t("hero.pills.gym")}</span>
            </div>
            <div className="glass-card px-5 py-3 flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t("hero.pills.home")}</span>
            </div>
            <div className="glass-card px-5 py-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t("hero.pills.emergency")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-black">{t("gym.title")}</h2>
          </div>
          <div className="space-y-8">
            {gymList.map((w) => (
              <WorkoutCard key={w.code} workout={w} labels={labels} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Home className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-black">{t("home.title")}</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">{t("home.body")}</p>
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground mb-4">{t("home.cardBody")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup">
                <Button variant="outline" className="font-semibold">
                  {t("home.createAccount")}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="bg-primary text-primary-foreground font-semibold">
                  {t("home.viewAccess", { price: pricing.selfGuided.label })}{" "}
                  <ArrowRight className="icon-directional ms-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-black">{t("emergency.title")}</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            {t("emergency.body")}{" "}
            <strong className="text-foreground">{t("emergency.choice")}</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyWorkouts.map((w) => (
              <div key={w.id} className="glass-card p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">{w.name}</h4>
                  <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">{w.time}</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {w.rows.map((r) => (
                    <li key={r.exercise}>
                      {r.exercise} — {r.sets} × {r.reps} · {r.rest}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
