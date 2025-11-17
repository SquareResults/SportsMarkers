"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabase } from "@/components/SupabaseProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* ---------- Zod Schema ---------- */
const formSchema = z.object({
  // 1 – Basic Info
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  sport: z.string().min(1, "Sport is required"),
  profilePicture: z.any().optional(), // FileList

  // 2 – Bio & Background
  bio: z.string().optional(),
  background: z.string().optional(),

  // 3 – Educational Background
  educationalBackground: z
    .array(
      z.object({
        school: z.string().min(1, "School / college name is required"),
        graduationYear: z.string().optional(),
      }),
    )
    .optional(),

  // 4 – Journey
  journeyTeams: z
    .array(
      z.object({
        team: z.string().min(1, "Team name is required"),
        position: z.string().optional(),
        explanation: z.string().optional(),
      }),
    )
    .optional(),
  journeyAchievements: z
    .array(
      z.object({
        tournament: z
          .string()
          .min(1, "Tournament / competition name is required"),
        medalsAwards: z.string().optional(),
        ranking: z.string().optional(),
      }),
    )
    .optional(),

  // 5 – Timeline (combined date fields)
  timelineTeams: z
    .array(
      z.object({
        name: z.string().min(1, "Team / position is required"),
        startDate: z.string().optional(), // "MM/YYYY"
        endDate: z.string().optional(),
      }),
    )
    .optional(),
  timelineTournaments: z
    .array(
      z.object({
        name: z.string().min(1, "Tournament / competition is required"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .optional(),

  // 6 – Skills & Media
  skills: z.string().optional(),
  videoLinks: z.string().optional(),
  actionPhotos: z.any().optional(),
  press: z.string().optional(),
  mediaLinks: z.string().optional(),

  // 7 – Goals
  goals: z.string().optional(),
  opportunities: z.enum(["", "Yes", "No", "Maybe"]),

  // 8 – Endorsements & Merch
  endorsements: z.string().optional(),
  merch: z.string().optional(),

  // 9 – Contact & Logo
  contactEmail: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  socials: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      tiktok: z.string().optional(),
      youtube: z.string().optional(),
      linkedin: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
  hasLogo: z.enum(["", "Yes", "No"]),

  logoUpload: z.any().optional(),

  // 10 – Uploads
  resume: z.any().optional(),
  references: z.any().optional(),
  certifications: z.any().optional(),
  moreMedia: z.any().optional(),
  comments: z.string().optional(),
});

/* ---------- Component ---------- */
export function CreateProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("section1");

  // UI-only structured states for skills/media
  const [skillsList, setSkillsList] = useState<string[]>([""]);
  const [videoItems, setVideoItems] = useState<{ title: string; url: string }[]>(
    [{ title: "", url: "" }],
  );
  const [pressItems, setPressItems] = useState<{ title: string; url: string }[]>(
    [{ title: "", url: "" }],
  );
  const [otherMediaItems, setOtherMediaItems] = useState<
    { title: string; url: string }[]
  >([{ title: "", url: "" }]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      sport: "",
      bio: "",
      background: "",
      educationalBackground: [{ school: "", graduationYear: "" }],

      journeyTeams: [{ team: "", position: "", explanation: "" }],
      journeyAchievements: [
        { tournament: "", medalsAwards: "", ranking: "" },
      ],

      timelineTeams: [{ name: "", startDate: "", endDate: "" }],
      timelineTournaments: [{ name: "", startDate: "", endDate: "" }],

      skills: "",
      videoLinks: "",
      press: "",
      mediaLinks: "",
      goals: "",
      opportunities: "",
      endorsements: "",
      merch: "",
      contactEmail: "",
      phone: "",
      socials: {
        instagram: "",
        twitter: "",
        tiktok: "",
        youtube: "",
        linkedin: "",
        other: "",
      },
      hasLogo: "",
      comments: "",
    },
  });

  // Field arrays
  const {
    fields: eduFields,
    append: addSchool,
    remove: removeSchool,
  } = useFieldArray({
    control: form.control,
    name: "educationalBackground",
  });

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

  /* ---------- Tabs definition ---------- */
  const tabs = [
    { value: "section1", label: "Basic Info" },
    { value: "section2", label: "Bio & Background" },
    { value: "section3", label: "Educational Background" },
    { value: "section4", label: "Journey" },
    { value: "section5", label: "Timeline" },
    { value: "section6", label: "Skills & Media" },
    { value: "section7", label: "Goals" },
    { value: "section8", label: "Endorsements" },
    { value: "section9", label: "Contact" },
    { value: "section10", label: "Uploads" },
  ];

  /* ---------- Navigation Helpers ---------- */
  const goToTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextTab = () => {
    const idx = tabs.findIndex((t) => t.value === activeTab);
    if (idx < tabs.length - 1) goToTab(tabs[idx + 1].value);
  };

  const prevTab = () => {
    const idx = tabs.findIndex((t) => t.value === activeTab);
    if (idx > 0) goToTab(tabs[idx - 1].value);
  };

  /* ---------- Helper: parse MM/YYYY or YYYY-MM ---------- */
  const parseMonthYear = (value: string | undefined | null) => {
    if (!value) return { month: "", year: "" };
    const v = value.trim();

    // Old format: YYYY-MM
    if (/^\d{4}-\d{2}$/.test(v)) {
      const [year, month] = v.split("-");
      return { month, year };
    }

    // Expected format: MM/YYYY
    if (/^\d{1,2}\/\d{4}$/.test(v)) {
      const [m, y] = v.split("/");
      const month = m.padStart(2, "0");
      return { month, year: y };
    }

    // Anything else → ignore
    return { month: "", year: "" };
  };

  /* ---------- Submit ---------- */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a portfolio.");
        return;
      }

      const uploadFileToS3 = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          return data.data[0].file_url;
        } else {
          throw new Error(data.error);
        }
      };

      const uploadMultipleFilesToS3 = async (files: FileList) => {
        const urls: string[] = [];
        for (const file of Array.from(files)) {
          const url = await uploadFileToS3(file);
          if (url) {
            urls.push(url);
          }
        }
        return urls.length > 0 ? urls : null;
      };

      const profilePictureUrl = values.profilePicture?.[0]
        ? await uploadFileToS3(values.profilePicture[0])
        : null;
      const logoUrl = values.logoUpload?.[0]
        ? await uploadFileToS3(values.logoUpload[0])
        : null;
      const actionPhotosUrls = values.actionPhotos
        ? await uploadMultipleFilesToS3(values.actionPhotos)
        : null;
      const resumeUrl = values.resume?.[0]
        ? await uploadFileToS3(values.resume[0])
        : null;
      const referencesUrl = values.references?.[0]
        ? await uploadFileToS3(values.references[0])
        : null;
      const certificationsUrl = values.certifications?.[0]
        ? await uploadFileToS3(values.certifications[0])
        : null;
      const moreMediaUrls = values.moreMedia
        ? await uploadMultipleFilesToS3(values.moreMedia)
        : null;

      // Structured skills/media from UI state
      const cleanedSkills = skillsList
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const cleanedVideos = videoItems
        .map((v) => ({
          title: v.title.trim(),
          url: v.url.trim(),
        }))
        .filter((v) => v.title || v.url);

      const cleanedPress = pressItems
        .map((p) => ({
          title: p.title.trim(),
          url: p.url.trim(),
        }))
        .filter((p) => p.title || p.url);

      const cleanedOtherMedia = otherMediaItems
        .map((m) => ({
          title: m.title.trim(),
          url: m.url.trim(),
        }))
        .filter((m) => m.title || m.url);

      // Journey → DB shapes
      const journeyTeamsDict =
        values.journeyTeams && values.journeyTeams.length
          ? Object.fromEntries(
              values.journeyTeams
                .filter((jt) => jt.team.trim())
                .map((jt) => [
                  `${jt.team.trim()}${
                    jt.position ? ` (${jt.position.trim()})` : ""
                  }`,
                  jt.explanation?.trim() || "",
                ]),
            )
          : null;

      const achievementsDict =
        values.journeyAchievements && values.journeyAchievements.length
          ? Object.fromEntries(
              values.journeyAchievements
                .filter((ja) => ja.tournament.trim())
                .map((ja) => [
                  ja.tournament.trim(),
                  [
                    ja.medalsAwards?.trim() || "",
                    ja.ranking?.trim() || "",
                  ],
                ]),
            )
          : null;

      // Timeline → DB shape { name: [startMonth, startYear, endMonth, endYear] }
      const timelineMap: Record<string, string[]> = {};

      if (values.timelineTeams) {
        values.timelineTeams.forEach((row) => {
          const key = row.name?.trim();
          if (!key) return;

          const { month: startMonth, year: startYear } = parseMonthYear(
            row.startDate,
          );
          const { month: endMonth, year: endYear } = parseMonthYear(
            row.endDate,
          );

          timelineMap[key] = [startMonth, startYear, endMonth, endYear];
        });
      }

      if (values.timelineTournaments) {
        values.timelineTournaments.forEach((row) => {
          const key = row.name?.trim();
          if (!key) return;

          const { month: startMonth, year: startYear } = parseMonthYear(
            row.startDate,
          );
          const { month: endMonth, year: endYear } = parseMonthYear(
            row.endDate,
          );

          timelineMap[key] = [startMonth, startYear, endMonth, endYear];
        });
      }

      const socialsObject = values.socials || {
        instagram: "",
        twitter: "",
        tiktok: "",
        youtube: "",
        linkedin: "",
        other: "",
      };
      const hasAnySocial =
        Object.values(socialsObject).filter(
          (v) => v && v.toString().trim().length > 0,
        ).length > 0;

      const portfolioData = {
        user_id: user.id,
        first_name: values.firstName,
        middle_name: values.middleName || null,
        last_name: values.lastName,
        sport: values.sport,
        profile_picture_url: profilePictureUrl,

        // Bio & Background
        bio: values.bio || null,
        background: values.background || null,

        // Educational Background
        educational_background:
          values.educationalBackground && values.educationalBackground.length
            ? values.educationalBackground
            : null,

        // Journey
        experience: journeyTeamsDict,
        achievements: achievementsDict,

        // Timeline
        timeline:
          Object.keys(timelineMap).length > 0 ? timelineMap : null,

        // Skills & Media
        skills: cleanedSkills.length > 0 ? cleanedSkills : null,
        video_links: cleanedVideos.length > 0 ? cleanedVideos : null,
        action_photos_urls: actionPhotosUrls,
        press: cleanedPress.length > 0 ? cleanedPress : null,
        media_links: cleanedOtherMedia.length > 0 ? cleanedOtherMedia : null,

        // Goals
        goals: values.goals || null,
        opportunities: values.opportunities || null,

        // Endorsements & Merch
        endorsements: values.endorsements || null,
        merch: values.merch || null,

        // Contact & Logo
        contact_email: values.contactEmail,
        phone: values.phone || null,
        socials: hasAnySocial ? socialsObject : null,
        has_logo: values.hasLogo === "Yes",
        logo_url: logoUrl,

        // Uploads
        resume_url: resumeUrl,
        references_url: referencesUrl,
        certifications_url: certificationsUrl,
        more_media_urls: moreMediaUrls,
        comments: values.comments || null,
      };

      const { error } = await supabase
        .from("portfolios")
        .insert([portfolioData]);
      if (error) {
        toast.error("Error creating portfolio: " + error.message);
      } else {
        toast.success("Portfolio created successfully!");
        router.push("/profile");
      }
    } catch (error: any) {
      console.error("An unexpected error occurred:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Styles ---------- */
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

  /* ---------- Helpers for dynamic lists ---------- */
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
    <div
      className={cn("mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Create Your Athlete Portfolio
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Showcase your athletic journey and achievements. Fields marked with * are
          required; all others are optional.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* ---------- TABS LIST (SCROLLABLE) ---------- */}
            <div className="-mx-4 sm:-mx-6 md:-mx-10 border-b border-slate-200">
              <div className="flex items-center justify-start overflow-x-auto px-4 sm:px-6 md:px-10 gap-2 scroll-smooth">
                <TabsList className="flex flex-nowrap gap-2 bg-transparent p-0 border-0">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="relative flex-shrink-0 flex flex-col items-center gap-1 whitespace-nowrap px-5 py-3 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors duration-200 ease-in-out focus:outline-none data-[state=active]:text-emerald-600 data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out data-[state=active]:after:scale-x-100"
                    >
                      <span className="font-bold text-base">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* ---------- SECTION 1: BASIC INFO ---------- */}
            <TabsContent value="section1">
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
            </TabsContent>

            {/* ---------- SECTION 2: BIO & BACKGROUND ---------- */}
            <TabsContent value="section2">
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
            </TabsContent>

            {/* ---------- SECTION 3: EDUCATIONAL BACKGROUND ---------- */}
            <TabsContent value="section3">
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
            </TabsContent>

            {/* ---------- SECTION 4: JOURNEY (TEAMS & ACHIEVEMENTS) ---------- */}
            <TabsContent value="section4">
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
            </TabsContent>

            {/* ---------- SECTION 5: TIMELINE ---------- */}
            <TabsContent value="section5">
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
            </TabsContent>

            {/* ---------- SECTION 6: SKILLS & MEDIA ---------- */}
            <TabsContent value="section6">
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
                    render={({ field: { onChange, ...field } }) => (
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
                              {...field}
                            />
                            <label
                              htmlFor="actionPhotos"
                              className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                            >
                              <Upload className="mr-3 h-5 w-5 text-slate-500" />
                              <span className="text-slate-700">
                                {form.watch("actionPhotos")?.length
                                  ? `${form.watch("actionPhotos").length} photo(s) selected`
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
            </TabsContent>

            {/* ---------- SECTION 7: GOALS ---------- */}
            <TabsContent value="section7">
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
            </TabsContent>

            {/* ---------- SECTION 8: ENDORSEMENTS ---------- */}
            <TabsContent value="section8">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 8 of 10: Endorsements & Merch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Endorsements */}
                  <FormField
                    control={form.control}
                    name="endorsements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Have you received any endorsements? If so, from where?
                          (optional)
                        </FormLabel>
                        <p className="text-xs text-slate-500 mb-1">
                          Example: “Local sports shop sponsorship”, “Club
                          endorsement”, etc.
                        </p>
                        <FormControl>
                          <Textarea
                            className={textareaCls}
                            placeholder="List endorsements and where they are from."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Merch / Fan Shop */}
                  <FormField
                    control={form.control}
                    name="merch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Merch / Fan Shop (optional){" "}
                          <span className="text-slate-500">
                            – add a URL link to your website
                          </span>
                        </FormLabel>
                        <p className="text-xs text-slate-500 mb-1">
                          Add a link to your merch store, fan shop, or online
                          shop if you have one.
                        </p>
                        <FormControl>
                          <Textarea
                            className={textareaCls}
                            placeholder="https://your-merch-store.com"
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
            </TabsContent>

            {/* ---------- SECTION 9: CONTACT & LOGO ---------- */}
            <TabsContent value="section9">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 9 of 10: Contact & Socials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className={inputCls}
                            placeholder="Best email to contact you"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            className={inputCls}
                            placeholder="Phone number (if you want to share it)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Social links split by platform */}
                  <div className="space-y-3">
                    <FormLabel>Social Links (optional)</FormLabel>
                    <p className="text-xs text-slate-500 mb-1">
                      Add your profile links for the major platforms you use.
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={"socials.instagram" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-600">
                              Instagram
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={inputCls}
                                placeholder="Instagram profile URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"socials.twitter" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-600">
                              Twitter / X
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={inputCls}
                                placeholder="Twitter / X profile URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"socials.tiktok" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-600">
                              TikTok
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={inputCls}
                                placeholder="TikTok profile URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"socials.youtube" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-600">
                              YouTube
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={inputCls}
                                placeholder="YouTube channel URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"socials.linkedin" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-600">
                              LinkedIn
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={inputCls}
                                placeholder="LinkedIn profile URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"socials.other" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-600">
                              Other
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={inputCls}
                                placeholder="Any other social/profile URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Logo toggle */}
                  <FormField
                    control={form.control}
                    name="hasLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you already have a personal logo?</FormLabel>
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
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Logo upload appears if user says Yes */}
                  {form.watch("hasLogo") === "Yes" && (
                    <FormField
                      control={form.control}
                      name="logoUpload"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>
                            Upload Logo (optional){" "}
                            <span className="text-slate-500">
                              – PNG / SVG / high-quality image
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="file"
                                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                onChange={(e) => onChange(e.target.files)}
                                className="hidden"
                                id="logo"
                                {...field}
                              />
                              <label
                                htmlFor="logo"
                                className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                              >
                                <Upload className="mr-3 h-5 w-5 text-slate-500" />
                                <span className="text-slate-700">
                                  {form.watch("logoUpload")?.[0]?.name ||
                                    "Choose logo file"}
                                </span>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
            </TabsContent>

            {/* ---------- SECTION 10: UPLOADS ---------- */}
            <TabsContent value="section10">
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
                      name={f.name as keyof typeof form.watch}
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>{f.label} (optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="file"
                                accept={f.accept as any}
                                multiple={!!f.multiple}
                                onChange={(e) => onChange(e.target.files)}
                                className="hidden"
                                id={f.name}
                                {...field}
                              />
                              <label
                                htmlFor={f.name}
                                className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                              >
                                <Upload className="mr-3 h-5 w-5 text-slate-500" />
                                <span className="text-slate-700">
                                  {form.watch(f.name as any)?.length
                                    ? `${form.watch(f.name as any).length} file(s) selected`
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
                    {loading ? "Submitting..." : "Submit Portfolio"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
