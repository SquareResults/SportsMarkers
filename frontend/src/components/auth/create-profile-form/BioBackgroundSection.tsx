import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

interface BioBackgroundSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
}

export function BioBackgroundSection({ form, nextTab, prevTab }: BioBackgroundSectionProps) {
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
        <CardTitle>Section 2 of 10: Bio & Background</CardTitle>
        <CardDescription>
          Use your <strong>Bio</strong> for a short intro and{" "}
          <strong>Background</strong> for more context and story. Both
          are optional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Short Bio (optional){" "}
                <span className="text-slate-500">
                  – Who are you as an athlete?
                </span>
              </FormLabel>
              <p className="text-xs text-slate-500 mb-1">
                Example: “I’m a 17-year-old point guard who loves
                high-pressure moments and leading my team on and off
                the court.”
              </p>
              <FormControl>
                <Textarea
                  className={textareaCls}
                  placeholder="Write 2–3 sentences that introduce you and your style."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Background (optional){" "}
                <span className="text-slate-500">
                  – Your story & context
                </span>
              </FormLabel>
              <p className="text-xs text-slate-500 mb-1">
                Use this to explain your journey (where you grew up,
                when you started playing, key influences, etc.).
              </p>
              <FormControl>
                <Textarea
                  className={textareaCls}
                  placeholder="Share more of your story and how you got here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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