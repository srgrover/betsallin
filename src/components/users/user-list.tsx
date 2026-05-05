'use client'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { IUser } from "@/app/interfaces/user.interface";
import Link from "next/link";
import { followUser, unfollowUser } from "@/actions";
import { toast } from "sonner";
import { useState } from "react"

interface Props {
    users: IUser[];
    cols?: number;
    user: IUser;
}

export function UserList({ users, cols = 1, user }: Props) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleFollow = async (followingId: string): Promise<void> => {
        setLoadingId(followingId);
        const { ok, message } = await followUser(user.id!, followingId);

        if (!ok) {
            toast.error(message, {
                position: "top-right",
                richColors: true,
            });
            setLoadingId(null);
            return;
        }

        const foundUser = users.find((u) => u.id === followingId);
        if (foundUser && foundUser.followers) {
            foundUser.followers.push({
                followerId: user.id!,
                followingId: followingId,
                createdAt: new Date()
            });
        }
        setLoadingId(null);
    }

    const handleUnfollow = async (followingId: string): Promise<void> => {
        setLoadingId(followingId);
        const { ok, message } = await unfollowUser(user.id!, followingId);

        if (!ok) {
            toast.error(message, {
                position: "top-right",
                richColors: true,
            });
            setLoadingId(null);
            return;
        }

        const foundUser = users.find((u) => u.id === followingId);
        if (foundUser && foundUser.followers) {
            foundUser.followers = foundUser.followers.filter((follower) => follower.followerId !== user.id!);
        }
        setLoadingId(null);
    }

    return (
        <ItemGroup className={`max-w-sm grid grid-cols-${cols}`}>
            {users.map((person, index) => (
                <Item key={person.username} variant="outline">
                    <ItemMedia>
                        <Avatar>
                            <AvatarImage src={person.image!} />
                            <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </ItemMedia>
                    <ItemContent className="gap-1">
                        <ItemTitle>
                            <Link
                                className="cursor-pointer"
                                href={`/profile?u=${person.username}`}>
                                {person.username}
                            </Link>
                        </ItemTitle>
                        <ItemDescription className="flex gap-2 items-center">
                            <span className="bg-muted px-2 py-0.5 text-xs rounded-full">Level {person.level}</span>
                            <span className="bg-muted px-2 py-0.5 text-xs rounded-full">{person.exp} xp</span>
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        {
                            user.id !== person.id && !user.following?.some((following) => following.followingId === person.id) && (
                                <Button onClick={() => handleFollow(person.id)} variant="secondary" size="sm" disabled={loadingId === person.id}>
                                    {
                                        loadingId === person.id && <Spinner data-icon="inline-start" />
                                    }
                                    follow
                                </Button>
                            )
                        }
                        {
                            user.id !== person.id && user.following?.some((f) => f.followingId === person.id) && (
                                <Button onClick={() => handleUnfollow(person.id)} variant="destructive" size="sm" disabled={loadingId === person.id}>
                                    {
                                        loadingId === person.id && <Spinner data-icon="inline-start" />
                                    }
                                    unfollow
                                </Button>
                            )
                        }
                    </ItemActions>
                </Item>
            ))
            }
        </ItemGroup >
    )
}
