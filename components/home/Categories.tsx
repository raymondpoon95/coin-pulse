import React from "react";
import DataTable from "../DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { CategoriesFallback } from "./Fallback";
import Image from "next/image";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const columns: DataTableColumn<Category>[] = [
  {
    header: "Category",
    cellClassName: "category-cell",
    cell: (category) => {
      return <div>{category.name}</div>;
    },
  },
  {
    header: "Top Gainers",
    cellClassName: "top-gainers-cell",
    cell: (category) => category.top_3_coins.map((coin) => <Image key={coin} src={coin} alt="" width={28} height={28} />),
  },
  {
    header: "24h Change",
    cellClassName: "change-header-cell",
    cell: (category) => {
      const isTrendingUp = category.market_cap_change_24h > 0;

      return (
        <div className={cn("change-cell", isTrendingUp ? "text-green-500" : "text-red-500")}>
          <p className="flex items-center">
            {formatPercentage(category.market_cap_change_24h)}
            {isTrendingUp ? <TrendingUp width={16} height={16} /> : <TrendingDown width={16} height={16} />}
          </p>
        </div>
      );
    },
  },
  {
    header: "Market Cap",
    cellClassName: "market-cap-cell",
    cell: (category) => formatCurrency(category.market_cap),
  },
  {
    header: "24h Volume",
    cellClassName: "volume-cell",
    cell: (category) => formatCurrency(category.volume_24h),
  },
];

const Categories = async () => {
  let categories;

  try {
    categories = await fetcher<Category[]>("/coins/categories");
  } catch (error) {
    console.log("error fetching categories:", error);
    return <CategoriesFallback />;
  }

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>

      <DataTable columns={columns} data={categories?.slice(0, 10)} rowKey={(_, index) => index} tableClassName="mt-3" />
    </div>
  );
};

export default Categories;
