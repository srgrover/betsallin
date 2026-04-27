"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconChevronCompactRight,
  IconCircleDashedCheck,
  IconImageGeneration,
  IconLoader2,
  IconMail,
  IconShieldExclamation,
  IconTrash,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { IUser } from "@/app/interfaces/user.interface";
import { getUserByEmail, getUserByUsername, updateUser, uploadImage } from "@/actions";
import type { z } from "zod";
import { UpdateProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const PersonalInfo = () => {
  const { data: session } = useSession({
    required: true,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    reset,
    getValues,
  } = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: userData?.name,
      username: userData?.username,
      image: userData?.image || null,
    },
  });

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      const { user, ok, message } = await getUserByEmail(session.user.email);
      if (ok && user) {
        setUserData(user);
        reset({
          name: user.name,
          username: user.username,
          image: user.image || null,
        });
      }
    };
    fetchUserData();
    setLoading(false);
  }, [session?.user?.email, reset]);

  useEffect(() => {
    if (!file) {
      const t = window.setTimeout(() => setPreview(null), 0);
      return () => clearTimeout(t);
    }

    const url = URL.createObjectURL(file);
    const t = window.setTimeout(() => setPreview(url), 0);

    return () => {
      clearTimeout(t);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];

    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file", {
        position: "top-right",
        richColors: true,
      });
      e.currentTarget.value = "";

      return;
    }

    if (f.size > 1024 * 1024) {
      toast.error("File must be smaller than 1MB", {
        position: "top-right",
        richColors: true,
      });
      e.currentTarget.value = "";

      return;
    }

    setFile(f);
  };

  const openPicker = () => inputRef.current?.click();

  const remove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = async (data: z.infer<typeof UpdateProfileSchema>) => {
    setLoading(true);
    let newImageUrl = data.image ?? null;

    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const { ok, message, imageUrl } = await uploadImage(null, formData);
      if (ok) {
        if (imageUrl) newImageUrl = imageUrl;
      } else {
        toast.error(message, {
          position: "top-right",
          richColors: true,
        });
        setLoading(false);
        return;
      }
    }
    const newUser: IUser = {
      ...userData!,
      name: data.name,
      username: data.username,
      image: newImageUrl,
    };

    const { ok, message } = await updateUser(newUser);
    if (ok) {
      toast.success("User updated successfully", {
        position: "top-right",
        richColors: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(message, {
        position: "top-right",
        richColors: true,
      });
      setLoading(false);
    }
  };

  const checkUsername = async (username: string) => {
    if (userData?.username === username) {
      toast.info("This is your current username", {
        position: "top-right",
        richColors: true,
      });
      return;
    }

    setLoading(true);
    const { ok, user, message } = await getUserByUsername(username);
    if (!ok) {
      toast.error(message);
    } else {
      if (user && user?.id !== userData?.id) {
        toast.error("Username is already taken", {
          position: "top-right",
          richColors: true,
        });
      } else {
        toast.success("Username is available", {
          position: "top-right",
          richColors: true,
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Personal Information</h3>
        <p className="text-muted-foreground text-sm">
          Manage your personal information and role.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 w-full space-y-2">
            <Label>Your Avatar</Label>
            <div className="flex items-center gap-4">
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload your avatar"
                onClick={openPicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPicker();
                  }
                }}
                className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed hover:opacity-95"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : userData?.image && userData?.image !== "" ? (
                  <img
                    src={userData.image}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <IconImageGeneration />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={openPicker}
                  className="flex items-center gap-2"
                >
                  <IconUpload />
                  Upload avatar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={remove}
                  disabled={!file}
                  className="text-destructive"
                >
                  <IconTrash />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Pick a photo up to 2MB.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
            <div className="flex flex-col items-start gap-2 w-full">
              <Label htmlFor="multi-step-personal-info-mobile">
                Email
                <Badge
                  variant={userData?.emailVerified ? "default" : "destructive"}
                >
                  {userData?.emailVerified ? (
                    <IconCircleDashedCheck className="size-5" />
                  ) : (
                    <IconShieldExclamation className="size-5" />
                  )}
                  {userData?.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </Label>

              <div className="relative w-full">
                <Input
                  id="multi-step-personal-info-mobile"
                  type="email"
                  placeholder="[EMAIL_ADDRESS]"
                  value={userData?.email || ""}
                  disabled
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
                  <IconMail className="size-4" />
                  <span className="sr-only">Email</span>
                </div>
              </div>
              {userData?.emailVerified ? (
                <Item variant="muted" size="sm">
                  <ItemMedia>
                    <IconCircleDashedCheck
                      color="var(--chart-4)"
                      className="size-5"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-[var(--chart-4)]">
                      Your profile has been verified.
                    </ItemTitle>
                  </ItemContent>
                </Item>
              ) : (
                <Item variant="muted" size="sm">
                  <ItemMedia variant="icon">
                    <IconShieldExclamation color="var(--destructive)" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Action required</ItemTitle>
                    <ItemDescription>
                      Your email is not verified. Please verify your email to
                      continue.
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="sm" variant="outline" color="var(--chart-4)">
                      Verify email
                    </Button>
                  </ItemActions>
                </Item>
              )}
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-first-name">
                Your name
              </Label>
              <Input
                id="multi-step-personal-info-first-name"
                placeholder="Enter your name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-last-name">
                Username
              </Label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <IconUser />
                </InputGroupAddon>
                <InputGroupInput
                  id="multi-step-personal-info-last-name"
                  placeholder="ej: bet-seller"
                  {...register("username")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => checkUsername(getValues("username"))}
                    variant="secondary"
                  >
                    Check
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {errors.username && (
                <p className="text-sm font-medium text-destructive">
                  {errors.username.message}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                The username must be unique.
              </p>
            </div>
          </div>
        </form>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="max-sm:w-full"
            disabled={!isValid || loading}
          >
            {loading && <IconLoader2 className="size-5 animate-spin" />}
            Save personal info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
