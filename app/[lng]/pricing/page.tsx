import { useTranslation } from "@/app/i18n";
import {
  getActiveProductsWithPrices,
  getSession,
  getSubscriptions,
} from "@/app/supabase-server";
import SiteFooter from "@/components/footer";
import Pricing from "@/components/pricing";
import PricingFeatureTable from "@/components/pricing-table";

export const metadata = {
  title: "Pricing",
  description:
    "Get more information about the available plans of Synapsy Write.",
};

export default async function PricingPage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const [session, products, subscriptions] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscriptions(),
  ]);
  const { t } = await useTranslation(lng, "common");

  return (
    <>
      <main className="mt-2 min-h-full pb-16 sm:mt-16 sm:pb-0">
        <Pricing
          session={session}
          products={products}
          subscriptions={subscriptions}
          user={session?.user}
          lng={lng}
        />
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
