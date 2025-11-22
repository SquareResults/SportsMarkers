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

interface TimelineSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
}

export function TimelineSection({ form, nextTab, prevTab }: TimelineSectionProps) {
    const {
        fields: timelineTeamFields,
        append: addTimelineTeam,
        remove: removeTimelineTeam,
      } = useFieldArray({
        control: form.control,
        name: "timelineTeams",
      });
    
      const {
        fields: timelineTournamentFields,
        append: addTimelineTournament,
        remove: removeTimelineTournament,
      } = useFieldArray({
        control: form.control,
        name: "timelineTournaments",
      });
      const inputCls =
    "h-12 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
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
        <CardTitle>Section 5 of 10: Timeline</CardTitle>
        <CardDescription>
          Map your journey over time. Leave the{" "}
          <span className="font-semibold">End Date</span> empty if
          you&apos;re still playing or it was a single-month event.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* Team (Position) Timeline */}
        <div className="space-y-4">
          <div className="space-y-1 text-xs text-slate-500">
            <FormLabel className="text-sm font-semibold">
              Team (Position) Timeline{" "}
              <span className="font-normal">(optional)</span>
            </FormLabel>
            <p>
              Use the same naming style as in the Journey section,
              like <span className="font-mono">Tigers (Goalie)</span>.
              Enter dates as <span className="font-mono">MM/YYYY</span>.
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>One card = one team / role.</li>
              <li>
                If you&apos;re still playing, just leave the End Date
                blank.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            {timelineTeamFields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 md:p-4"
              >
                {/* Team (Position) name */}
                <FormField
                  control={form.control}
                  name={`timelineTeams.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Team (Position){" "}
                        <span className="text-slate-500">
                          (required)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={inputCls}
                          placeholder="e.g., Tigers (Goalie)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start / End dates */}
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`timelineTeams.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Start Date{" "}
                          <span className="text-slate-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM/YYYY"
                            maxLength={7}
                            className={inputCls}
                            {...field}
                          />
                        </FormControl>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Choose the month &amp; year you joined.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`timelineTeams.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          End Date{" "}
                          <span className="text-slate-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM/YYYY"
                            maxLength={7}
                            className={inputCls}
                            {...field}
                          />
                        </FormControl>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Leave blank if you&apos;re still on this
                          team.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remove button */}
                <div className="flex justify-end">
                  {timelineTeamFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => removeTimelineTeam(index)}
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
            className="mt-1"
            onClick={() =>
              addTimelineTeam({
                name: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            + Add Another Team Timeline
          </Button>
        </div>

        {/* Tournament / Competition Timeline */}
        <div className="space-y-4">
          <div className="space-y-1 text-xs text-slate-500">
            <FormLabel className="text-sm font-semibold">
              Tournament / Competition Timeline{" "}
              <span className="font-normal">(optional)</span>
            </FormLabel>
            <p>
              Great for leagues, showcase series, or longer
              tournaments where dates matter.
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>One card = one tournament / competition.</li>
              <li>
                For single-month events, you can set the same month in
                Start and End or leave End Date blank.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            {timelineTournamentFields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 md:p-4"
              >
                {/* Tournament name */}
                <FormField
                  control={form.control}
                  name={`timelineTournaments.${index}.name`}
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

                {/* Start / End dates */}
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`timelineTournaments.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Start Date{" "}
                          <span className="text-slate-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM/YYYY"
                            maxLength={7}
                            className={inputCls}
                            {...field}
                          />
                        </FormControl>
                        <p className="mt-1 text-[11px] text-slate-500">
                          When did this tournament or league begin?
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`timelineTournaments.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          End Date{" "}
                          <span className="text-slate-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM/YYYY"
                            maxLength={7}
                            className={inputCls}
                            {...field}
                          />
                        </FormControl>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Leave blank if it&apos;s ongoing or a
                          one-month event.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remove button */}
                <div className="flex justify-end">
                  {timelineTournamentFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() =>
                        removeTimelineTournament(index)
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
            className="mt-1"
            onClick={() =>
              addTimelineTournament({
                name: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            + Add Another Tournament Timeline
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