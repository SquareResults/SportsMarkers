import { Tables } from "@/types/database.types";
import { formSchema } from "@/lib/formSchema";
import { z } from "zod";

type PortfolioRow = Tables<"portfolios">;

interface TimelineData {
  teams?: Array<{ name: string; startDate?: string; endDate?: string }>;
  tournaments?: Array<{ name: string; startDate?: string; endDate?: string }>;
}

interface SocialsData {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  other?: string;
}

interface LinkItem {
  title: string;
  url: string;
}

interface EducationItem {
  school: string;
  graduationYear?: string;
}

// Helper function to safely get a string value or undefined
function getOptionalStringValue(value: string | null | undefined): string | undefined {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === "") ? undefined : value;
}

// Helper function to safely get a required string value (defaults to empty string)
function getRequiredStringValue(value: string | null | undefined): string {
  return value === null || value === undefined ? "" : value;
}

export function transformPortfolioToFormData(
  portfolio: PortfolioRow
): z.infer<typeof formSchema> {
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

  const timeline = (portfolio.timeline as unknown as TimelineData) || {};

  // Parse Experience (Journey Teams)
  let journeyTeams: Array<{ team: string; position?: string; explanation?: string }> | undefined = undefined;
  if (Array.isArray(portfolio.experience)) {
    journeyTeams = portfolio.experience as Array<{ team: string; position?: string; explanation?: string }>;
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
    journeyAchievements = portfolio.achievements as Array<{ tournament: string; medalsAwards?: string; ranking?: string }>;
  } else if (portfolio.achievements && typeof portfolio.achievements === 'object') {
    // It's an object/map from DB: { "Tournament": ["Medal", "Ranking"] }
    journeyAchievements = Object.entries(portfolio.achievements).map(([key, value]) => {
      const details = Array.isArray(value) ? value : [];
      return {
        tournament: key.trim(),
        medalsAwards: (details[0] as string) || "",
        ranking: (details[1] as string) || "",
      };
    });
  }

  const educationalBackground = (portfolio.educational_background as unknown as EducationItem[]) || [];
  const videoLinks = (portfolio.video_links as unknown as LinkItem[]) || [];
  const press = (portfolio.press as unknown as LinkItem[]) || [];
  const mediaLinks = (portfolio.media_links as unknown as LinkItem[]) || [];
  const socials = (portfolio.socials as unknown as SocialsData) || undefined;

  return {
    ...defaultFormValues, // Start with defaults
    firstName: getRequiredStringValue(portfolio.first_name),
    middleName: getOptionalStringValue(portfolio.middle_name),
    lastName: getRequiredStringValue(portfolio.last_name),
    sport: getRequiredStringValue(portfolio.sport),
    profilePicture: undefined,
    bio: getOptionalStringValue(portfolio.bio),
    background: getOptionalStringValue(portfolio.background),

    educationalBackground: educationalBackground.length ? educationalBackground : undefined,

    journeyTeams: journeyTeams,
    journeyAchievements: journeyAchievements,

    timelineTeams: timeline.teams?.length ? timeline.teams : undefined,
    timelineTournaments: timeline.tournaments?.length ? timeline.tournaments : undefined,

    skills: getOptionalStringValue((portfolio.skills as string[])?.join(", ")),
    videoLinks: videoLinks.length ? videoLinks : undefined,
    press: press.length ? press : undefined,
    mediaLinks: mediaLinks.length ? mediaLinks : undefined,

    goals: getOptionalStringValue(portfolio.goals),
    opportunities: (portfolio.opportunities as "Yes" | "No" | "Maybe") || "",

    endorsements: getOptionalStringValue(portfolio.endorsements),
    merch: getOptionalStringValue(portfolio.merch),

    contactEmail: getRequiredStringValue(portfolio.contact_email),
    phone: getOptionalStringValue(portfolio.phone),
    socials: socials,
    hasLogo: portfolio.has_logo === true ? "Yes" : (portfolio.has_logo === false ? "No" : ""),
    logoUpload: undefined,
    resume: undefined,
    references: undefined,
    certifications: undefined,
    moreMedia: undefined,
    comments: getOptionalStringValue(portfolio.comments),
  };
}
