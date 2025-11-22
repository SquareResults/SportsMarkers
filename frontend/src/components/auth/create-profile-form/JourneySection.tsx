import { UseFormReturn, useFieldArray } from "react-hook-form";
import type { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/lib/formSchema";

interface JourneySectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
}

export function JourneySection({ form, nextTab, prevTab }: JourneySectionProps) {
    const {
        fields: journeyTeamFields,
        append: addJourneyTeam,
        remove: removeJourneyTeam,
      } = useFieldArray({
        control: form.control,
        name: "journeyTeams",
      });
    
      const {
        fields: journeyAchievementFields,
        append: addJourneyAchievement,
        remove: removeJourneyAchievement,
      } = useFieldArray({
        control: form.control,
        name: "journeyAchievements",
      });

      const inputCls =
    "h-12 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
    const textareaCls =
    "min-h-[140px] rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
  const pillActive =
    "h-11 px-8 rounded-full font-semibold text-white shadow-lg " +
    "bg-gradient-to-r from-emerald-400 to-green-600 " +
    "hover:from-emerald-500 hover:to-green-700 transition";
    const pillOutline =
    "h-11 px-6 rounded-full font-semibold border border-slate-300 " +
    "text-slate-700 hover:bg-slate-50 transition";
  return (
    <Card className="border-2 border-slate-200 shadow-xl">
      <CardHeader>
        <CardTitle>Section 4 of 10: Athletic Journey</CardTitle>
        <CardDescription>
          Describe your teams, positions, and key achievements in a
          structured way.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Teams & Positions */}
        <div className="space-y-3">
          <FormLabel>Teams and Positions (optional)</FormLabel>
          <p className="text-xs text-slate-500 mb-1">
            Example format:{" "}
            <span className="font-mono">
              Tigers (Goalie): starting varsity keeper
            </span>
            .
          </p>

          <div className="space-y-4">
            {journeyTeamFields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="space-y-3 border border-slate-100 rounded-xl p-3"
              >
                <div className="grid gap-3 md:grid-cols-[1.3fr,1.1fr] items-end">
                  <FormField
                    control={form.control}
                    name={`journeyTeams.${index}.team`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Team Name{" "}
                          <span className="text-slate-500">
                            (required)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="e.g., Tigers"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`journeyTeams.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Position{" "}
                          <span className="text-slate-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="e.g., Goalie"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`journeyTeams.${index}.explanation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Explanation{" "}
                        <span className="text-slate-500">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className={textareaCls}
                          placeholder="Describe your role, impact, or key responsibilities on this team."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  {journeyTeamFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => removeJourneyTeam(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() =>
              addJourneyTeam({
                team: "",
                position: "",
                explanation: "",
              })
            }
          >
            + Add Another Team
          </Button>
        </div>

        {/* Achievements & Stats */}
        <div className="space-y-3">
          <FormLabel>Achievements &amp; Stats (optional)</FormLabel>
          <p className="text-xs text-slate-500 mb-1">
            Example:{" "}
            <span className="font-mono">
              LA Winter Classic → Gold Medal, 1st out of 16 teams
            </span>
            .
          </p>

          <div className="space-y-4">
            {journeyAchievementFields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="space-y-3 border border-slate-100 rounded-xl p-3"
              >
                <div className="grid gap-3 md:grid-cols-3 items-end">
                  <FormField
                    control={form.control}
                    name={`journeyAchievements.${index}.tournament`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Tournament / Competition{" "}
                          <span className="text-slate-500">
                            (required)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="e.g., LA Winter Classic"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`journeyAchievements.${index}.medalsAwards`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Medals &amp; Awards{" "}
                          <span className="text-slate-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="e.g., Gold Medal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`journeyAchievements.${index}.ranking`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Ranking{" "}
                          <span className="text-slate-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="e.g., 1st out of 16 teams"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  {journeyAchievementFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() =>
                        removeJourneyAchievement(index)
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() =>
              addJourneyAchievement({
                tournament: "",
                medalsAwards: "",
                ranking: "",
              })
            }
          >
            + Add Another Achievement
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevTab}
          className={pillOutline}
        >
          Back
        </Button>
        <Button onClick={nextTab} className={pillActive}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}