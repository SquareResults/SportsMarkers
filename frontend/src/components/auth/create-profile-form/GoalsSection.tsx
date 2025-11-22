import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { formSchema } from "@/lib/formSchema";

interface GoalsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
}

export function GoalsSection({ form, nextTab, prevTab }: GoalsSectionProps) {
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
        <CardTitle>Section 7 of 10: Goals & Opportunities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Goals (optional)</FormLabel>
              <p className="text-xs text-slate-500 mb-1">
                What are you hoping to achieve in the next 1–3 years?
                (e.g., play in college, go pro, improve specific
                skills, etc.)
              </p>
              <FormControl>
                <Textarea
                  className={textareaCls}
                  placeholder="Share your short- and long-term goals."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="opportunities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Are you looking for sponsorships or training
                opportunities?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
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