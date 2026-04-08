import ConnectedAccount from "./connect-account"
import DangerZone from "./danger-zone"
import EmailPass from "./email-password"
import PersonalInfo from "./personal-info"
import SocialUrl from "./social-url"
import { Separator } from "./ui/separator"

export default function UserGeneral() {
    return (
        <section className='py-3'>
            <div className='mx-auto max-w-7xl'>
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