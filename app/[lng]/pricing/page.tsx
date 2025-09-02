import { useTranslation } from "@/app/i18n";
import SiteFooter from "@/components/footer";
import Pricing from "@/components/pricing";
import PricingFeatureTable from "@/components/pricing-table";
import { DefaultLanguageParams } from "@/lib/languages";
import {
  getUser,
  getProducts,
  getSubscriptions,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Pricing",
  description:
    "Get more information about the available plans of Synapsy Write.",
};

export default async function PricingPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  const { lng } = await params;
  const supabase = await createClient();
  const [user, products, subscriptions] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscriptions(supabase),
  ]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, "common");

  return (
    <>
      <main className="mt-2 min-h-full pb-16 sm:pb-0">
        <section className="p-10">
          <h2 className="text-center text-xl font-bold">
            Buying a Synapsy Write Plan is no longer available for now.
          </h2>
        </section>
        {/* <Pricing
          products={products}
          subscriptions={subscriptions}
          user={user}
          lng={lng}
        /> */}
        <section className="min-h-3xl m-5 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">{t("features")}</h2>
          <p> {t("features-desc")}</p>
        </section>
        <PricingFeatureTable lng={lng} />
      </main>
      <SiteFooter params={{ lng: lng }} />
    </>
  );
}
