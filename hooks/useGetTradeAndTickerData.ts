"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/coingecko.actions";

export const useGetTradeAndTickerData = ({ coinId, poolId }: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    const getTradeData = async () => {
      const parsedPoolId = poolId.split("_");
      const response = await fetcher<TradesResponse>(`/onchain/networks/${parsedPoolId[0]}/pools/${parsedPoolId[1]}/trades`);
      const data = response.data.slice(0, 7);

      const newData = data.map((item: TradeData) => {
        const { kind, price_to_in_usd, price_from_in_usd, volume_in_usd, block_timestamp, to_token_amount, from_token_amount } = item.attributes;

        const newTrade: Trade = {
          price: Number(kind === "buy" ? price_to_in_usd : price_from_in_usd),
          value: Number(volume_in_usd),
          timestamp: block_timestamp ?? 0,
          type: kind,
          amount: Number(kind === "buy" ? to_token_amount : from_token_amount),
        };

        return newTrade;
      });

      setTrades(newData);
    };

    const getTickerData = async () => {
      const response = await fetcher<CoinTickersResponse>(`/coins/${coinId}/tickers`);
      const tickerData = response.tickers.slice(0, 10);

      const newTickerData = tickerData.map((item) => {
        const { base, target, timestamp, trade_url, market, converted_last } = item;

        const newTicker: Ticker = {
          market,
          base,
          target,
          converted_last,
          timestamp,
          trade_url: trade_url ?? "",
        };

        return newTicker;
      });
      setTickers(newTickerData);
    };

    const fetchData = async () => {
      try {
        await Promise.all([getTickerData(), getTradeData()]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [coinId, poolId]);

  return {
    trades,
    price,
    tickers,
  };
};
