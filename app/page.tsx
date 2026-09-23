import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: (coin) => {
      const item = coin.item;

      return (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      );
    },
  },
  {
    header: "24h Change",
    cellClassName: "name-cell",
    cell: (coin) => {
      const item = coin.item;
      const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

      return (
        <div
          className={cn(
            "price-change",
            isTrendingUp ? "text-green-500" : "text-red-500",
          )}
        >
          <p>
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
          </p>
        </div>
      );
    },
  },
  {
    header: "Price",
    cellClassName: "name-cell",
    cell: (coin) => `$${coin.item.data.price.toLocaleString()}`,
  },
];

const dummyCoinData = [
  {
    item: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      market_cap_rank: 1,
      thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
      large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      data: {
        price: 64320.5,
        price_change_percentage_24h: {
          usd: 2.45,
        },
      },
    },
  },
  {
    item: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      market_cap_rank: 2,
      thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
      large: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      data: {
        price: 3480.12,
        price_change_percentage_24h: {
          usd: -1.15,
        },
      },
    },
  },
  {
    item: {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      market_cap_rank: 5,
      thumb: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png",
      large: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      data: {
        price: 145.8,
        price_change_percentage_24h: {
          usd: 5.82,
        },
      },
    },
  },
];

const Page = () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <div id="coin-overview">
          <div className="header pt-2">
            <Image
              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
              alt="bitcoin"
              width={56}
              height={56}
            />
            <div className="info">
              <p>Bitcoin / BTC</p>
              <h1>$89,000</h1>
            </div>
          </div>
        </div>
        <p>Trending Coins</p>
        <DataTable
          columns={columns}
          data={dummyCoinData}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
        />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
};

export default Page;
