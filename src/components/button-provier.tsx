'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { login } from "@/actions";
import { IconLoader2 } from "@tabler/icons-react";

interface Props {
    provider: string;
    icon: React.ReactNode;
}

export const ButtonProvider = ({ provider, icon }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const tryToLogin = async () => {
        setLoading(true);
        await login(provider)
    }

    return (
        <Button
            variant="outline"
            size="default"
            onClick={ async() => { await tryToLogin() } }
            type="button">
            { !loading ? icon : <IconLoader2 size={20} className="animate-spin" /> }
            Continue with { provider.toWellFormed() }
        </Button>
    )
}