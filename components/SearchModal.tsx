"use client";

import useSWR from "swr";
import { useState } from "react";
import { useKey } from "react-use";
import { useRouter } from "next/navigation";

import { useDebounceQuery } from "@/hooks/useDebounceQuery";
import { Command, CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import { Button } from "./ui/button";
import ListCoinResults from "./ListCoinResults";
import { Search } from "lucide-react";

import { fetcher } from "@/lib/coingecko.actions";

const SearchModal = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { debounceQuery } = useDebounceQuery<string>(searchQuery, 300);
  const router = useRouter();

  const fetchFunction = async (url: string) => {
    const fetchSearchResults: any = await fetcher(url);
    const coins = fetchSearchResults.coins.slice(0, 5);

    const coinsDataPrices = await fetcher<CoinMarketData[]>("/coins/markets", {
      vs_currency: "usd",
      ids: coins.map(({ id }: any) => id).join(","),
    });

    const marketDataById = new Map(coinsDataPrices.map((coin) => [coin.id, coin]));

    const mergedCoins = coins.map((coin: any) => ({
      ...marketDataById.get(coin.id),
      id: coin.id,
      large: coin.large,
      name: coin.name,
      symbol: coin.symbol,
    }));

    return mergedCoins;
  };

  const { data: coins, isLoading } = useSWR<any>(debounceQuery !== null ? `/search?query=${debounceQuery}` : null, fetchFunction);
  const { data: trendingCoins, isLoading: trendingCoinsLoading } = useSWR<any>("/search/trending", fetcher);

  useKey(
    (event) => event.key?.toLowerCase() === "k" && (event.metaKey || event.ctrlKey),
    (event) => {
      event.preventDefault();
      setOpen((prev) => !prev);
    },
    {},
    [setOpen],
  );

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery("");
    router.push(`/coins/${coinId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        <Search />
        Search
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton>
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search for token by name or symbol..." value={searchQuery} onValueChange={(value) => setSearchQuery(value)} />
          <CommandList>
            {debounceQuery.length > 0 && coins?.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

            {trendingCoinsLoading || (isLoading && <div className="flex w-full justify-center items-center pb-4">Searching...</div>)}

            {debounceQuery.length === 0 ? (
              <>
                {trendingCoins?.coins?.map(({ item }: any) => (
                  <ListCoinResults
                    key={item.id}
                    coinId={item.id}
                    large={item.large}
                    name={item.name}
                    symbol={item.symbol}
                    price_change_percentage_24h={item.data.price_change_percentage_24h.usd}
                    onSelect={handleSelect}
                  />
                ))}
              </>
            ) : (
              <>
                {coins?.map((coin: any) => (
                  <ListCoinResults
                    key={coin.id}
                    coinId={coin.id}
                    large={coin.large}
                    name={coin.name}
                    symbol={coin.symbol}
                    price_change_percentage_24h={coin.price_change_percentage_24h.usd}
                    onSelect={handleSelect}
                  />
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default SearchModal;
