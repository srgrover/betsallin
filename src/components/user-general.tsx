import { auth } from "@auth"
import ConnectedAccount from "./connect-account"
import DangerZone from "./danger-zone"
import EmailPass from "./email-password"
import PersonalInfo from "./personal-info"
import SocialUrl from "./social-url"
import { Separator } from "./ui/separator"
import { getUserByEmail, updateUserRole } from "@/actions"
import RoleSelector from "./role-selector"

export default async function UserGeneral() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return <div>User not found</div>
    }

    const { user: userDb, ok, message } = await getUserByEmail(user.email!);

    if (!ok) {
        return <div>{message}</div>
    }

    return (
        <section className='py-3'>
            <div className='mx-auto max-w-7xl'>
                {
                    userDb!.role === 'admin'.toUpperCase() && (
                        <RoleSelector selectedRole={userDb!.role} onRoleChange={updateUserRole.bind(null, userDb!.id)} />
                    )
                }
                <PersonalInfo />
                <Separator className='my-10' />
                <EmailPass />
                {/* <Separator className='my-10' />
                <ConnectedAccount /> */}
                {/* <Separator className='my-10' />
                <SocialUrl /> */}
                <Separator className='my-10' />
                <DangerZone />
            </div>
        </section>
    )
}