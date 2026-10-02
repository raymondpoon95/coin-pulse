"use client";

import { useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/coingecko.actions";

// to do - remove hook or refactor as useTradeData
export const useCoinGeckoWebSocket = ({ coinId, poolId, liveInterval }: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribeRef = useRef(<Set<string>>new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

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

    getTradeData();
  }, []);

  return {
    trades,
    price,
    ohlcv,
    isConnected: false,
  };
};
