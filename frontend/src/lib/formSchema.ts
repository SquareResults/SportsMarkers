import { z } from "zod";

export const formSchema = z.object({
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
  videoLinks: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
  actionPhotos: z.any().optional(),
  press: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
  mediaLinks: z.array(z.object({ title: z.string(), url: z.string() })).optional(),

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
