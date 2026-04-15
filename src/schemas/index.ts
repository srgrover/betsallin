import z from "zod";

export const LinkSchema = z.object({
  id: z.number(),
  url: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  tagId: z.number().optional(),
});

export const CreateLinkSchema = z.object({
  url: z
    .string()
    .min(1, { message: "URL is required." })
    .url({
      message: "Please enter a valid URL. Include http:// or https://",
    })
    .regex(/^(?!.*(?:http|https):\/\/(?:slug|slugr)\.vercel\.app).*$/, {
      message: "You cannot redirect to the Slug url.",
    })
    // not contain any blank spaces
    .regex(/^\S+$/, {
      message: "URL must not contain any blank spaces.",
    }),
  slug: z
    .string()
    .min(4, {
      message: "Short link is required and must be at least 4 characters long.",
    })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message:
        "Custom short link must not contain any blank spaces or special characters.",
    })
    .regex(/^(?!.*&c$)/, {
      message: "Custom short link can't end with &c.",
    }),

  description: z
    .string()
    .max(100, { message: "The description must be less than 100 characters." }),
});

export const EditLinkSchema = z.object({
  id: z.string(),
  url: z
    .string()
    .min(1, { message: "URL is required." })
    .regex(/^(?!.*(?:http|https):\/\/(?:slug|slugr)\.vercel\.app).*$/, {
      message: "You cannot redirect to the Slug url.",
    })
    // not contain any blank spaces
    .regex(/^\S+$/, {
      message: "URL must not contain any blank spaces.",
    }),
  slug: z
    .string()
    .min(4, {
      message: "Short link is required and must be at least 4 characters long.",
    })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message: "Custom short link must not contain any blank spaces.",
    })
    .regex(/^(?!.*&c$)/, {
      message: "Custom short link can't end with &c.",
    }),
  description: z
    .string()
    .max(100, { message: "The description must be less than 100 characters." }),
});

export const DeleteLinkSchema = z.object({
  slug: z.string().min(1, { message: "Slug is required." }),
});

export const getSingleLinkSchema = z.object({
  linkId: z.number(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required." }).max(15, {
    message: "Tag name must be less than 15 characters.",
  }),
  color: z.string().min(1, { message: "Tag color is required." }),
});

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is required. Min 2 characters." })
    .max(40, { message: "Name must be less than 40 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(25, { message: "Username must be less than 25 characters." })
    .regex(/^[a-zA-Z0-9_.-]*$/, {
      message: "Username must not contain any blank spaces.",
    }),
  image: z.string().optional().nullable(),
});

export type LinkSchema = z.TypeOf<typeof LinkSchema>;
export type CreateLinkInput = z.TypeOf<typeof CreateLinkSchema>;
export type EditLinkInput = z.TypeOf<typeof EditLinkSchema>;
export type ProfileFormValues = z.infer<typeof UpdateProfileSchema>;
