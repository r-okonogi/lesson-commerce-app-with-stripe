import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AuthClientButton from '@/components/auth/AuthClientButton';

const AuthServerButton = async() => {
    const supabase = createServerComponentClient({ cookies });
    const {data: user} = await supabase.auth.getSession();
    const session = user.session;

    return <AuthClientButton session={session} />;
};

export default AuthServerButton;