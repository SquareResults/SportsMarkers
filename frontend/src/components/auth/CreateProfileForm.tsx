"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { useSupabase } from "@/components/SupabaseProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BasicInfoSection } from "./create-profile-form/BasicInfoSection";
import { BioBackgroundSection } from "./create-profile-form/BioBackgroundSection";
import { EducationalBackgroundSection } from "./create-profile-form/EducationalBackgroundSection";
import { JourneySection } from "./create-profile-form/JourneySection";
import { TimelineSection } from "./create-profile-form/TimelineSection";
import { SkillsAndMediaSection } from "./create-profile-form/SkillsAndMediaSection";
import { GoalsSection } from "./create-profile-form/GoalsSection";
import { EndorsementsSection } from "./create-profile-form/EndorsementsSection";
import { ContactSection } from "./create-profile-form/ContactSection";
import { UploadsSection } from "./create-profile-form/UploadsSection";
import { formSchema } from "@/lib/formSchema";
import { UseFormReturn } from "react-hook-form";

interface PortfolioData {
  id?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  sport?: string;
  profile_picture_url?: string;
  bio?: string;
  background?: string;
  educational_background?: Array<{ school: string; graduationYear?: string }>;
  experience?: Array<{ team: string; position?: string; explanation?: string }>;
  achievements?: Array<{ tournament: string; medalsAwards?: string; ranking?: string }>;
  timeline?: {
    teams?: Array<{ name: string; startDate?: string; endDate?: string }>;
    tournaments?: Array<{ name: string; startDate?: string; endDate?: string }>;
  };
  skills?: string[];
  video_links?: Array<{ title?: string; url?: string }>;
  action_photos_urls?: string[];
  press?: Array<{ title?: string; url?: string }>;
  media_links?: Array<{ title?: string; url?: string }>;
  goals?: string;
  opportunities?: "Yes" | "No" | "Maybe";
  endorsements?: string;
  merch?: string;
  contact_email?: string;
  phone?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
    other?: string;
  };
  has_logo?: boolean;
  logo_url?: string;
  resume_url?: string;
  references_url?: string;
  certifications_url?: string;
  more_media_urls?: string[];
  comments?: string;
}

// Helper function to safely get a string value or undefined
function getOptionalStringValue(value: string | null | undefined): string | undefined {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === "") ? undefined : value;
}

// Helper function to safely get a required string value (defaults to empty string)
function getRequiredStringValue(value: string | null | undefined): string {
  return value === null || value === undefined ? "" : value;
}


function transformPortfolioToFormData(portfolio: PortfolioData): z.infer<typeof formSchema> {
  const defaultFormValues: z.infer<typeof formSchema> = {
    firstName: "",
    middleName: undefined,
    lastName: "",
    sport: "",
    profilePicture: undefined,
    bio: undefined,
    background: undefined,
    educationalBackground: undefined,
    journeyTeams: undefined,
    journeyAchievements: undefined,
    timelineTeams: undefined,
    timelineTournaments: undefined,
    skills: undefined,
    videoLinks: undefined,
    actionPhotos: undefined,
    press: undefined,
    mediaLinks: undefined,
    goals: undefined,
    opportunities: "",
    endorsements: undefined,
    merch: undefined,
    contactEmail: "",
    phone: undefined,
    socials: undefined,
    hasLogo: "",
    logoUpload: undefined,
    resume: undefined,
    references: undefined,
    certifications: undefined,
    moreMedia: undefined,
    comments: undefined,
  };

  if (!portfolio) {
    return defaultFormValues;
  }

  const timeline = portfolio.timeline || {};

  // Parse Experience (Journey Teams)
  let journeyTeams: Array<{ team: string; position?: string; explanation?: string }> | undefined = undefined;
  if (Array.isArray(portfolio.experience)) {
    journeyTeams = portfolio.experience;
  } else if (portfolio.experience && typeof portfolio.experience === 'object') {
    // It's an object/map from DB: { "Team Name (Position)": "Explanation" }
    journeyTeams = Object.entries(portfolio.experience).map(([key, value]) => {
      // Try to extract position from "Team Name (Position)"
      const match = key.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        return {
          team: match[1].trim(),
          position: match[2].trim(),
          explanation: value as string,
        };
      }
      return {
        team: key.trim(),
        position: "",
        explanation: value as string,
      };
    });
  }

  // Parse Achievements
  let journeyAchievements: Array<{ tournament: string; medalsAwards?: string; ranking?: string }> | undefined = undefined;
  if (Array.isArray(portfolio.achievements)) {
    journeyAchievements = portfolio.achievements;
  } else if (portfolio.achievements && typeof portfolio.achievements === 'object') {
    // It's an object/map from DB: { "Tournament": ["Medal", "Ranking"] }
    journeyAchievements = Object.entries(portfolio.achievements).map(([key, value]) => {
      const details = Array.isArray(value) ? value : [];
      return {
        tournament: key.trim(),
        medalsAwards: details[0] || "",
        ranking: details[1] || "",
      };
    });
  }

  return {
    ...defaultFormValues, // Start with defaults
    firstName: getRequiredStringValue(portfolio.first_name),
    middleName: getOptionalStringValue(portfolio.middle_name),
    lastName: getRequiredStringValue(portfolio.last_name),
    sport: getRequiredStringValue(portfolio.sport),
    profilePicture: undefined,
    bio: getOptionalStringValue(portfolio.bio),
    background: getOptionalStringValue(portfolio.background),

    educationalBackground: portfolio.educational_background?.length ? portfolio.educational_background : undefined,

    journeyTeams: journeyTeams,
    journeyAchievements: journeyAchievements,

    timelineTeams: timeline.teams?.length ? timeline.teams : undefined,
    timelineTournaments: timeline.tournaments?.length ? timeline.tournaments : undefined,

    skills: getOptionalStringValue(portfolio.skills?.join(", ")),
    videoLinks: portfolio.video_links?.length ? (portfolio.video_links as Array<{ title: string; url: string }>) : undefined,
    press: portfolio.press?.length ? (portfolio.press as Array<{ title: string; url: string }>) : undefined,
    mediaLinks: portfolio.media_links?.length ? (portfolio.media_links as Array<{ title: string; url: string }>) : undefined,

    goals: getOptionalStringValue(portfolio.goals),
    opportunities: portfolio.opportunities || "",

    endorsements: getOptionalStringValue(portfolio.endorsements),
    merch: getOptionalStringValue(portfolio.merch),

    contactEmail: getRequiredStringValue(portfolio.contact_email),
    phone: getOptionalStringValue(portfolio.phone),
    socials: portfolio.socials || undefined,
    hasLogo: portfolio.has_logo === true ? "Yes" : (portfolio.has_logo === false ? "No" : ""),
    logoUpload: undefined,
    resume: undefined,
    references: undefined,
    certifications: undefined,
    moreMedia: undefined,
    comments: getOptionalStringValue(portfolio.comments),
  };
}

/* ---------- Component ---------- */
interface CreateProfileFormProps extends React.ComponentProps<"div"> {
  portfolio?: PortfolioData;
}

export function CreateProfileForm({
  className,
  portfolio,
  ...props
}: CreateProfileFormProps) {
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

  // Determine if in edit mode
  const isEditMode = !!portfolio;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: portfolio ? transformPortfolioToFormData(portfolio) : {
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
      videoLinks: [],
      press: [],
      mediaLinks: [],
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

  /* ---------- Field Mapping for Validation ---------- */
  const tabFieldMap: Record<string, (keyof z.infer<typeof formSchema>)[]> = {
    section1: ["firstName", "lastName", "sport"],
    section2: [], // Bio is optional
    section3: [], // Educational background is optional but if filled, school is required
    section4: [], // Journey is optional but if filled, team/tournament are required
    section5: [], // Timeline is optional but if filled, name is required
    section6: [], // Skills & Media are optional
    section7: [], // Goals are optional
    section8: [], // Endorsements are optional
    section9: ["contactEmail"], // Contact email is required
    section10: [], // Uploads are optional
  };

  /* ---------- Navigation Helpers ---------- */
  const goToTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const validateCurrentTab = async () => {
    const fieldsToValidate = tabFieldMap[activeTab] || [];

    if (fieldsToValidate.length === 0) {
      return true; // No required fields for this tab
    }

    // Trigger validation for the specified fields
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextTab = async () => {
    // Validate current tab before proceeding
    const isValid = await validateCurrentTab();

    if (!isValid) {
      toast.error("Please fill in all required fields before proceeding");
      return;
    }

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
                `${jt.team.trim()}${jt.position ? ` (${jt.position.trim()})` : ""
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

      // Use update if editing existing portfolio, insert if creating new
      if (isEditMode && portfolio?.id) {
        const { error } = await supabase
          .from("portfolios")
          .update(portfolioData)
          .eq("id", portfolio.id);

        if (error) {
          toast.error("Error updating portfolio: " + error.message);
        } else {
          toast.success("Portfolio updated successfully!");
          router.push("/profile");
        }
      } else {
        const { error } = await supabase
          .from("portfolios")
          .insert([portfolioData]);

        if (error) {
          toast.error("Error creating portfolio: " + error.message);
        } else {
          toast.success("Portfolio created successfully!");
          router.push("/profile");
        }
      }
    } catch (error: unknown) {
      console.error("An unexpected error occurred:", error);
      toast.error(
        (error as Error).message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn("mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          {isEditMode ? "Edit Your Athlete Portfolio" : "Create Your Athlete Portfolio"}
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

            <TabsContent value="section1">
              <BasicInfoSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} />
            </TabsContent>

            <TabsContent value="section2">
              <BioBackgroundSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} />
            </TabsContent>

            <TabsContent value="section3">
              <EducationalBackgroundSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} />
            </TabsContent>

            <TabsContent value="section4">
              <JourneySection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} />
            </TabsContent>

            <TabsContent value="section5">
              <TimelineSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} />
            </TabsContent>

            <TabsContent value="section6">
              <SkillsAndMediaSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} skillsList={skillsList} setSkillsList={setSkillsList} videoItems={videoItems} setVideoItems={setVideoItems} pressItems={pressItems} setPressItems={setPressItems} otherMediaItems={otherMediaItems} setOtherMediaItems={setOtherMediaItems} />
            </TabsContent>

            <TabsContent value="section7">
              <GoalsSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} />
            </TabsContent>

            <TabsContent value="section8">
              <EndorsementsSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} />
            </TabsContent>

            <TabsContent value="section9">
              <ContactSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} nextTab={nextTab} prevTab={prevTab} />
            </TabsContent>

            <TabsContent value="section10">
              <UploadsSection form={form as unknown as UseFormReturn<z.infer<typeof formSchema>>} prevTab={prevTab} loading={loading} isEditMode={isEditMode} />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}