import { UseFormReturn } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { formSchema } from "@/lib/formSchema";

interface UploadsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  prevTab: () => void;
  loading: boolean;
  isEditMode: boolean;
}

export function UploadsSection({ form, prevTab, loading, isEditMode }: UploadsSectionProps) {
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
      <CardTitle>Section 10 of 10: Additional Uploads</CardTitle>
      <CardDescription>
        Add any extra documents or media you want us to consider.
        All of these are optional.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {[
        {
          name: "resume",
          label: "Resume",
          accept: ".pdf,.doc,.docx",
        },
        {
          name: "references",
          label: "Reference Letters",
          multiple: true,
        },
        {
          name: "certifications",
          label: "Certifications",
          multiple: true,
        },
        {
          name: "moreMedia",
          label: "Extra Photos / Media",
          multiple: true,
        },
      ].map((f) => (
        <FormField
          key={f.name}
          control={form.control}
          name={f.name as keyof z.infer<typeof formSchema>}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>{f.label} (optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept={f.accept}
                    multiple={!!f.multiple}
                    onChange={(e) => onChange(e.target.files)}
                    className="hidden"
                    id={f.name}
                    {...rest}
                  />
                  <label
                    htmlFor={f.name}
                    className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                  >
                    <Upload className="mr-3 h-5 w-5 text-slate-500" />
                    <span className="text-slate-700">
                      {(form.watch(f.name as keyof z.infer<typeof formSchema>) as unknown as FileList)?.length
                        ? `${(form.watch(f.name as keyof z.infer<typeof formSchema>) as unknown as FileList).length} file(s) selected`
                        : "Choose file(s)"}
                    </span>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <FormField
        control={form.control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Comments (optional)</FormLabel>
            <FormControl>
              <Textarea
                className={textareaCls}
                placeholder="Anything else you'd like us to know?"
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
      <Button
        type="submit"
        disabled={loading}
        className={pillActive}
      >
        {loading ? "Submitting..." : (isEditMode ? "Update Portfolio" : "Submit Portfolio")}
      </Button>
    </CardFooter>
  </Card>
  );
}