"use client";

import { formatPercentage } from "@/lib/utils";
import { CommandItem } from "./ui/command";
import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ListCoinResultsProps {
  coinId: string;
  large: string;
  name: string;
  symbol: string;
  price_change_percentage_24h: number | null | undefined;
  onSelect: (coinId: string) => void;
}

const ListCoinResults = ({ coinId, large, name, symbol, price_change_percentage_24h, onSelect }: ListCoinResultsProps) => {
  const isTrendingUp = price_change_percentage_24h && price_change_percentage_24h > 0;

  return (
    <CommandItem className="flex" onSelect={() => onSelect(coinId)}>
      <Image src={large} alt={name} width={27} height={27} />
      <div className="flex flex-col ml-2 py-2">
        <span className="font-bold">{name}</span>
        <span>{symbol}</span>
      </div>

      <div className="flex flex-1 justify-end">
        {isTrendingUp ? (
          <p className="text-green-500 flex">
            <TrendingUp width={16} height={16} />
            {formatPercentage(price_change_percentage_24h)}
          </p>
        ) : (
          <p className="text-red-500 flex">
            <TrendingDown width={16} height={16} />
            {formatPercentage(price_change_percentage_24h)}
          </p>
        )}
      </div>
    </CommandItem>
  );
};

export default ListCoinResults;
