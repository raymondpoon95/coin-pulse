import Image from "next/image";
import Link from "next/link";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { fetcher } from "@/lib/coingecko.actions";

import DataTable from "@/components/DataTable";
import CoinsPagination from "@/components/CoinsPagination";

const columns: DataTableColumn<CoinMarketData>[] = [
  {
    header: "Rank",
    cellClassName: "rank-cell",
    cell: (coin) => (
      <>
        #{coin.market_cap_rank}
        <Link href={`/coins/${coin.id}`} aria-label="View coin" />
      </>
    ),
  },
  {
    header: "Token",
    cellClassName: "token-cell",
    cell: (coin) => {
      const validUrl = ["https", "http"];
      const imageSrc = validUrl.some((target) => coin.image?.includes(target));

      return (
        <div className="token-info">
          {imageSrc && <Image src={coin.image} alt={coin.name} width={36} height={36} />}
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      );
    },
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: (coin) => formatCurrency(coin.current_price),
  },
  {
    header: "24h Change",
    cellClassName: "change-header-cell",
    cell: (coin) => {
      const isTrendingUp = coin.price_change_percentage_24h > 0;

      return (
        <span
          className={cn("change-value", {
            "text-green-600": isTrendingUp,
            "text-red-500": !isTrendingUp,
          })}
        >
          {isTrendingUp && "+"}
          {formatPercentage(coin.price_change_percentage_24h)}
        </span>
      );
    },
  },
  {
    header: "Market Cap",
    cellClassName: "market-cap-cell",
    cell: (coin) => formatCurrency(coin.market_cap),
  },
];

const Coins = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const perPage = 10;

  let coins;

  try {
    coins = await fetcher<CoinMarketData[]>("/coins/markets", {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page: currentPage,
      sparkline: "false",
      price_change_percentage: "24h",
    });
  } catch (error) {
    console.log(error);
  }

  if (!coins) return;

  const hasMorePages = coins.length === perPage;

  const estimatedTotalPages = currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable columns={columns} data={coins || []} rowKey={(coin) => coin.id} tableClassName="coins-table" />

        <CoinsPagination currentPage={currentPage} totalPages={estimatedTotalPages} hasMorePages={hasMorePages} />
      </div>
    </main>
  );
};

export default Coins;
