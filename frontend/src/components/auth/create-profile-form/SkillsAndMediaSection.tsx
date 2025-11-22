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
import { toast } from "sonner";
import { formSchema } from "@/lib/formSchema";

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

interface SkillsAndMediaSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
  skillsList: string[];
  setSkillsList: React.Dispatch<React.SetStateAction<string[]>>;
    videoItems: { title: string; url: string }[];
    setVideoItems: React.Dispatch<React.SetStateAction<{ title: string; url: string }[]>>;
    pressItems: { title: string; url: string }[];
    setPressItems: React.Dispatch<React.SetStateAction<{ title: string; url: string }[]>>;
    otherMediaItems: { title: string; url: string }[];
    setOtherMediaItems: React.Dispatch<React.SetStateAction<{ title: string; url: string }[]>>;
}

export function SkillsAndMediaSection({
  form,
  nextTab,
  prevTab,
  skillsList,
  setSkillsList,
    videoItems,
    setVideoItems,
    pressItems,
    setPressItems,
    otherMediaItems,
    setOtherMediaItems,
}: SkillsAndMediaSectionProps) {
    const inputCls =
    "h-12 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
  const pillActive =
    "h-11 px-8 rounded-full font-semibold text-white shadow-lg " +
    "bg-gradient-to-r from-emerald-400 to-green-600 " +
    "hover:from-emerald-500 hover:to-green-700 transition";
    const pillOutline =
    "h-11 px-6 rounded-full font-semibold border border-slate-300 " +
    "text-slate-700 hover:bg-slate-50 transition";

    const addSkillField = () => setSkillsList((prev) => [...prev, ""]);
  const updateSkillField = (index: number, value: string) =>
    setSkillsList((prev) => prev.map((s, i) => (i === index ? value : s)));

  const addMediaItem = (
    kind: "video" | "press" | "other",
    item: { title: string; url: string },
  ) => {
    if (kind === "video") setVideoItems((prev) => [...prev, item]);
    if (kind === "press") setPressItems((prev) => [...prev, item]);
    if (kind === "other") setOtherMediaItems((prev) => [...prev, item]);
  };

  const updateMediaItem = (
    kind: "video" | "press" | "other",
    index: number,
    field: "title" | "url",
    value: string,
  ) => {
    const update = (arr: { title: string; url: string }[]) =>
      arr.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      );

    if (kind === "video") setVideoItems((prev) => update(prev));
    if (kind === "press") setPressItems((prev) => update(prev));
    if (kind === "other") setOtherMediaItems((prev) => update(prev));
  };
  return (
    <Card className="border-2 border-slate-200 shadow-xl">
      <CardHeader>
        <CardTitle>Section 6 of 10: Skills & Media</CardTitle>
        <CardDescription>
          Highlight your strengths, videos, press, and other media. All
          fields here are optional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Key Skills – list of strings */}
        <div className="space-y-3">
          <FormLabel>Key Skills (optional)</FormLabel>
          <p className="text-xs text-slate-500 mb-1">
            Add one skill per field, like{" "}
            <span className="font-mono">speed</span>,{" "}
            <span className="font-mono">teamwork</span>,{" "}
            <span className="font-mono">on-court IQ</span>, etc.
          </p>
          <div className="space-y-2">
            {skillsList.map((skill, idx) => (
              <Input
                key={idx}
                className={inputCls}
                placeholder={`Skill #${idx + 1}`}
                value={skill}
                onChange={(e) =>
                  updateSkillField(idx, e.target.value)
                }
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={addSkillField}
          >
            + Add Skill
          </Button>
        </div>

        {/* Highlight Videos */}
        <div className="space-y-3">
          <FormLabel>Highlight Videos (optional)</FormLabel>
          <p className="text-xs text-slate-500 mb-1">
            For each highlight video, enter a title and a URL (YouTube
            or other).
          </p>
          <div className="space-y-3">
            {videoItems.map((item, idx) => (
              <div
                key={idx}
                className="grid gap-2 md:grid-cols-2 md:gap-4"
              >
                <Input
                  className={inputCls}
                  placeholder="Video title"
                  value={item.title}
                  onChange={(e) =>
                    updateMediaItem(
                      "video",
                      idx,
                      "title",
                      e.target.value,
                    )
                  }
                />
                <Input
                  className={inputCls}
                  placeholder="Video URL"
                  value={item.url}
                  onChange={(e) =>
                    updateMediaItem(
                      "video",
                      idx,
                      "url",
                      e.target.value,
                    )
                  }
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={() =>
              addMediaItem("video", { title: "", url: "" })
            }
          >
            + Add Video
          </Button>
        </div>

        {/* Action Photos */}
        <FormField
          control={form.control}
          name="actionPhotos"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>
                Action Photos (optional){" "}
                <span className="text-slate-500">
                  – max 4 images
                </span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      if (files.length > 4) {
                        toast.error(
                          "You can upload a maximum of 4 action photos.",
                        );
                        const dt = new DataTransfer();
                        Array.from(files)
                          .slice(0, 4)
                          .forEach((f) => dt.items.add(f));
                        onChange(dt.files);
                      } else {
                        onChange(files);
                      }
                    }}
                    className="hidden"
                    id="actionPhotos"
                    {...rest}
                  />
                  <label
                    htmlFor="actionPhotos"
                    className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                  >
                    <Upload className="mr-3 h-5 w-5 text-slate-500" />
                    <span className="text-slate-700">
                      {(form.watch("actionPhotos") ?? []).length
                        ? `${(form.watch("actionPhotos") as FileList).length} photo(s) selected`
                        : "Choose up to 4 photos"}
                    </span>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Press Mentions */}
        <div className="space-y-3">
          <FormLabel>Press Mentions (optional)</FormLabel>
          <p className="text-xs text-slate-500 mb-1">
            For each article or feature, enter a title and a URL.
          </p>
          <div className="space-y-3">
            {pressItems.map((item, idx) => (
              <div
                key={idx}
                className="grid gap-2 md:grid-cols-2 md:gap-4"
              >
                <Input
                  className={inputCls}
                  placeholder="Article title"
                  value={item.title}
                  onChange={(e) =>
                    updateMediaItem(
                      "press",
                      idx,
                      "title",
                      e.target.value,
                    )
                  }
                />
                <Input
                  className={inputCls}
                  placeholder="Article URL"
                  value={item.url}
                  onChange={(e) =>
                    updateMediaItem(
                      "press",
                      idx,
                      "url",
                      e.target.value,
                    )
                  }
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={() =>
              addMediaItem("press", { title: "", url: "" })
            }
          >
            + Add Press Mention
          </Button>
        </div>

        {/* Other Media Links */}
        <div className="space-y-3">
          <FormLabel>Other Media Links (optional)</FormLabel>
          <p className="text-xs text-slate-500 mb-1">
            For podcasts, blogs, interviews, etc., use the same
            format: title + URL.
          </p>
          <div className="space-y-3">
            {otherMediaItems.map((item, idx) => (
              <div
                key={idx}
                className="grid gap-2 md:grid-cols-2 md:gap-4"
              >
                <Input
                  className={inputCls}
                  placeholder="Media title"
                  value={item.title}
                  onChange={(e) =>
                    updateMediaItem(
                      "other",
                      idx,
                      "title",
                      e.target.value,
                    )
                  }
                />
                <Input
                  className={inputCls}
                  placeholder="Media URL"
                  value={item.url}
                  onChange={(e) =>
                    updateMediaItem(
                      "other",
                      idx,
                      "url",
                      e.target.value,
                    )
                  }
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={() =>
              addMediaItem("other", { title: "", url: "" })
            }
          >
            + Add Media Link
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