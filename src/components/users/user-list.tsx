'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { IUser } from "@/app/interfaces/user.interface";
import Link from "next/link";
import { followUser, unfollowUser } from "@/actions";
import { toast } from "sonner";

interface Props {
    users: IUser[];
    cols?: number;
    sessionId: string;
}

export function UserList({ users, cols = 1, sessionId }: Props) {
    const handleFollow = async (followingId: string) => {
        const { ok, message } = await followUser(sessionId, followingId);

        if (!ok) {
            toast.error(message, {
                position: "top-right",
                richColors: true,
            });
            return;
        }

        users.find((user) => user.id === followingId)?.followers?.push({
            followerId: sessionId,
            followingId: followingId,
            createdAt: new Date()
        });
    }

    const handleUnfollow = async (followingId: string) => {
        const { ok, message } = await unfollowUser(sessionId, followingId);

        if (!ok) {
            toast.error(message, {
                position: "top-right",
                richColors: true,
            });
            return;
        }

        users.find((user) => user.id === followingId)?.followers?.filter((follower) => follower.followerId !== sessionId);
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
                        <ItemDescription>{person.email}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        {
                            sessionId !== person.id && !person.followers?.some((follower) => follower.followerId === sessionId) && (
                                <Button onClick={() => handleFollow(person.id)} variant="ghost" size="icon" className="rounded-full">
                                    <IconPlus />
                                </Button>
                            )
                        }
                        {
                            sessionId !== person.id && person.following?.some((following) => following.followingId === sessionId) && (
                                <Button onClick={() => handleUnfollow(person.id)} variant="ghost" size="icon" className="rounded-full">
                                    <IconTrash />
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
