import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { profile } from "console";
import initiStripe, { Stripe } from "stripe";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import SubscriptionButton from "@/components/checkout/SubscriptionButton";
import AuthServerButton from "@/components/auth/AuthServerButton";
import Link from "next/link";

interface Plan {
    id: string;
    name: string;
    price: number | null;
    interval: Stripe.Price.Recurring.Interval | null;
    currency: string;
}

const getAllPlans = async(): Promise<Plan[]> => {
    const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);
    const { data: plansList } = await stripe.plans.list();

    const plans = await Promise.all(
        plansList.map(async (plan) => {
            const product = await stripe.products.retrieve(plan.product as string);

        return {
            id: plan.id,
            name: product.name,
            price: plan.amount_decimal ? parseInt(plan.amount_decimal) : null,
            interval: plan.interval,
            currency: plan.currency,
        }
    }));

    const sortedPlans = plans.sort(
        (a, b) => a.price! - b.price!
    );
    
    return sortedPlans;
}

const getProfileData = async (
        supabase: SupabaseClient<Database>
    ) => {
    const { data : profile } = await supabase
    .from('profile')
    .select('*')
    .single(); 
    return profile;
}

const PricingPage = async () => {
    const supabase = createServerComponentClient({ cookies });
    const { data: user} = await supabase.auth.getSession();

    const [plans, profile] = await Promise.all([
        getAllPlans(),
        getProfileData(supabase),
    ]);

    const showSubscribeButton = !!user.session && !profile!.is_subscribed;
    const showCreateAccountButton = !user.session;
    const showManageSubscriptionButton = !!user.session && profile!.is_subscribed;

    return(
    <div className="w-full max-w-3xl mx-auto py16 flex justify-around">
        {plans.map((plan) => (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{plan.name} プラン</CardTitle>
                <CardDescription>{plan.interval}</CardDescription>
            </CardHeader>
            <CardContent>{plan.price}円 / {plan.interval}</CardContent>
            <CardFooter>
                {showSubscribeButton && (<SubscriptionButton planId={plan.id}/>)}
                {showCreateAccountButton && (<AuthServerButton />)}
                {showManageSubscriptionButton && (
                    <Button>
                        <Link href="/dashboard">サブスクリプションの管理</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
        ))}
    </div>
    ) 
}

export default PricingPage;