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
import { formSchema } from "@/lib/formSchema";

interface EndorsementsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
}

export function EndorsementsSection({ form, nextTab, prevTab }: EndorsementsSectionProps) {
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
            <CardTitle>Section 8 of 10: Endorsements & Merch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <FormField
            control={form.control}
            name="endorsements"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Endorsements / Awards (optional)</FormLabel>
                <FormControl>
                    <Textarea
                    className={textareaCls}
                    placeholder="List any endorsements or awards."
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="merch"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Merch / Fan Shop (optional)</FormLabel>
                <FormControl>
                    <Textarea
                    className={textareaCls}
                    placeholder="Link to your merchandise or fan shop."
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