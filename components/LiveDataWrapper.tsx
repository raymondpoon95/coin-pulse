"use client";

import { Separator } from "./ui/separator";
import CandlestickChart from "./CandlestickChart";
import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./DataTable";
import { useCoinGeckoWebSocket } from "@/hooks/useCoinGeckoWebSocket";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = ({ coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const { trades, price } = useCoinGeckoWebSocket({ coinId, poolId });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>{trade.type === "buy" ? "Buy" : "Sell"}</span>,
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage={price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency}
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />
      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart coinId={coinId} data={coinOHLCData}>
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      {tradeColumns && (
        <div className="trades">
          <h4>Recent Trades</h4>

          <DataTable columns={tradeColumns} data={trades} rowKey={(_, index) => index} tableClassName="trades-table" />
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
