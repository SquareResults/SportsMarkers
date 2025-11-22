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
import { Upload } from "lucide-react";
import { formSchema } from "@/lib/formSchema";

interface BasicInfoSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
}

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function BasicInfoSection({ form, nextTab }: BasicInfoSectionProps) {
  const inputCls =
    "h-12 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
  const pillActive =
    "h-11 px-8 rounded-full font-semibold text-white shadow-lg " +
    "bg-gradient-to-r from-emerald-400 to-green-600 " +
    "hover:from-emerald-500 hover:to-green-700 transition";

  return (
    <Card className="border-2 border-slate-200 shadow-xl">
      <CardHeader>
        <CardTitle>Section 1 of 10: Basic Info</CardTitle>
        <CardDescription>
          Tell us who you are. * fields are required; others are{" "}
          <span className="font-semibold">(optional)</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input
                  className={inputCls}
                  placeholder="First name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (optional)</FormLabel>
              <FormControl>
                <Input
                  className={inputCls}
                  placeholder="Middle name (if any)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input
                  className={inputCls}
                  placeholder="Last name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sport You Play *{" "}
                <span className="text-slate-500">
                  (e.g., Basketball, Soccer)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  className={inputCls}
                  placeholder="Enter your primary sport"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>
                Profile Picture (optional){" "}
                <span className="text-slate-500">
                  – PNG / JPG / WEBP, clear headshot
                </span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={(e) => onChange(e.target.files)}
                    className="hidden"
                    id="profilePic"
                    {...field}
                  />
                  <label
                    htmlFor="profilePic"
                    className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                  >
                    <Upload className="mr-3 h-5 w-5 text-slate-500" />
                    <span className="text-slate-700">
                      {value?.[0]?.name || "Choose image"}
                    </span>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="button"
          onClick={nextTab}
          className={pillActive}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}