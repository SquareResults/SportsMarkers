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

interface EducationalBackgroundSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
}

export function EducationalBackgroundSection({ form, nextTab, prevTab }: EducationalBackgroundSectionProps) {
    const {
        fields: eduFields,
        append: addSchool,
        remove: removeSchool,
      } = useFieldArray({
        control: form.control,
        name: "educationalBackground",
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
        <CardTitle>Section 3 of 10: Educational Background</CardTitle>
        <CardDescription>
          Add each school or college you attended and your graduation
          year.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-xs text-slate-500 space-y-1">
          <p className="font-semibold">How this works</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Use one row per school or college.</li>
            <li>
              Graduation year can be left blank if you&apos;re still
              studying (you can write &quot;Present&quot; instead of a
              year).
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          {eduFields.map((fieldItem, index) => (
            <div
              key={fieldItem.id}
              className="grid gap-3 md:grid-cols-[2fr,1fr,auto] items-end"
            >
              {/* School / College Name */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.school`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      School / College Name{" "}
                      <span className="text-slate-500">
                        (required)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="e.g., California State University, Northridge"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Graduation Year */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.graduationYear`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Graduation Year{" "}
                      <span className="text-slate-500">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="e.g., 2025 or Present"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remove button */}
              <div className="flex justify-end md:justify-start">
                {eduFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => removeSchool(index)}
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
            addSchool({ school: "", graduationYear: "" })
          }
        >
          + Add Another School
        </Button>
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