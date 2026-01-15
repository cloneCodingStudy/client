"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { ProductListItem } from "@/types/product";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayImage = product.image || "/images/default-thumbnail.jpg";

  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow relative block"
    >
      <div className="relative h-44 w-full bg-gray-100">
        <Image
          src={displayImage}
          alt={product.title}
          fill
          className={`object-cover transition-opacity duration-300 ${
            product.isRented ? "opacity-60" : "opacity-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.isRented && (
          <div className="absolute top-3 left-3 bg-primary-purple text-white px-3 py-1 text-xs rounded-md z-10 font-bold">
            대여중
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2 h-10">
          {product.title}
        </h3>

        <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2">
          <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
          {product.seller?.nickname}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400 ml-1">
              ({product.reviewsCount})
            </span>
          </div>
          <span className="text-[var(--color-primary)] font-bold">
            {product.price.toLocaleString()}원
          </span>
        </div>

        <div className="text-[10px] text-gray-400 text-right mt-1">
          {new Date(product.createdAt).toLocaleDateString("ko-KR")}
        </div>
      </div>
    </Link>
  );
}
