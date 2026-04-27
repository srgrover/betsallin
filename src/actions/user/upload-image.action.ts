"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_POSTGRES_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_POSTGRES_SUPABASE_ANON_KEY!, // SOLO server
);

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function assertFile(file: unknown): asserts file is File {
  if (!(file instanceof File)) throw new Error("Invalid image");
}

function extFromMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  return "webp";
}

async function getUserIdOrThrow(): Promise<{
  ok: boolean;
  id?: string;
  message?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      message: "No auth",
    };
  }
  return {
    ok: true,
    id: session.user.id,
  };
}

export async function uploadImage(_: unknown, formData: FormData) {
  const { ok, id, message } = await getUserIdOrThrow();

  if (!ok) {
    return {
      ok: false,
      message,
    };
  }

  const image = formData.get("image");
  let imagePath: string | undefined;
  let imageUrl: string | undefined;

  if (image != null && String(image) !== "") {
    assertFile(image);

    if (image.size > MAX_SIZE) {
      return {
        ok: false,
        message: "Maximum 2MB",
      };
    }
    if (!ALLOWED.has(image.type)) {
      return {
        ok: false,
        message: "Not allowed format (jpg/png/webp)",
      };
    }

    // Store the image with no extension so that we can always overwrite it regardless of format
    imagePath = `${id}`;

    const bytes = new Uint8Array(await image.arrayBuffer());
    const { error } = await supabase.storage
      .from("avatars")
      .upload(imagePath, bytes, {
        upsert: true,
        contentType: image.type,
        cacheControl: "3600",
      });

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(imagePath);
    imageUrl = `${data.publicUrl}?t=${Date.now()}`;
  }

  return {
    ok: true,
    imagePath,
    imageUrl,
    imageVersion: { increment: 1 },
  };
}
