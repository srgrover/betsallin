'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";

interface Props {
    text: string;
    icon?: React.ReactNode;
    userId: string;
    followingId: string;
    variant?: "secondary" | "outline" | "link" | "default" | "ghost" | "destructive" | null | undefined;
    handleMethod: (userId: string, followingId: string) => Promise<{ ok: boolean, message?: string, followed?: any }>;
}

export const FollowButton = ({ text, icon, userId, followingId, variant = "default", handleMethod }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleFollow = async (): Promise<void> => {
        setLoading(true);
        try {
            const { ok, message } = await handleMethod(userId, followingId);
            if (!ok && message) {
                toast.error(message, {
                    position: "top-right",
                    richColors: true,
                });
            }
        } catch (error) {
            toast.error("Something went wrong", {
                position: "top-right",
                richColors: true,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant={variant}
            size="default"
            onClick={handleFollow}
            disabled={loading}
            type="button">
            {!loading ? icon : <IconLoader2 size={20} className="animate-spin" />}
            {text}
        </Button>
    )
}