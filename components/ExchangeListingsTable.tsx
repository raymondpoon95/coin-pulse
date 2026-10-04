"use client";

import { useGetTradeAndTickerData } from "@/hooks/useGetTradeAndTickerData";
import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./DataTable";
import Link from "next/link";

const ExchangeListingsTable = ({ coinId, poolId }: LiveDataProps) => {
  const { tickers } = useGetTradeAndTickerData({ coinId, poolId });

  const exchangeColumns: DataTableColumn<Ticker>[] = [
    {
      header: "Exchange",
      cellClassName: "exchange-name",
      cell: (ticker) => (
        <Link href={ticker.trade_url} className="relative!">
          {ticker.market.name}
        </Link>
      ),
    },
    {
      header: "Pair",
      cellClassName: "pair",
      cell: (ticker) => (
        <p>
          {ticker.base} / {ticker.target}
        </p>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (ticker) => formatCurrency(ticker.converted_last.usd),
    },
    {
      header: "Last Traded",
      cellClassName: "time-cell",
      cell: (ticker) => timeAgo(ticker.timestamp),
    },
  ];

  return (
    <section className="exchange-section">
      {exchangeColumns && (
        <>
          <h4>Exchange Listings</h4>
          <DataTable columns={exchangeColumns} data={tickers} rowKey={(_, index) => index} tableClassName="exchange-table" />
        </>
      )}
    </section>
  );
};

export default ExchangeListingsTable;
