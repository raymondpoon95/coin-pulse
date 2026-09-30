import { Suspense } from "react";
import CoinOverview from "@/components/home/CoinOverview";
import { CoinOverviewFallback, CategoriesFallback, TrendingCoinsFallback } from "@/components/home/Fallback";
import Categories from "@/components/home/Categories";
import TrendingCoins from "@/components/home/TrendingCoins";

const Page = async () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
