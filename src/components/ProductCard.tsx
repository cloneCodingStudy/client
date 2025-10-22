"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow relative"
    >
      {/* 상품 이미지 */}
      <div className="relative h-44">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className={`object-cover transition ${product.isRented ? "opacity-60" : "opacity-100"}`}
        />
        {product.isRented && (
          <div className="absolute top-3 left-3 bg-primary-purple text-white px-3 py-1 text-xs rounded-md">
            대여중
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          {product.location}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{product.rating}</span>
            <span className="text-sm text-[var(--color-text-secondary)] ml-1">
              ({product.reviews})
            </span>
          </div>
          <span className="text-[var(--color-primary)] font-bold">
            {product.price.toLocaleString()}원
          </span>
        </div>

        <div className="text-xs text-gray-400 ml-1">
          {new Date(product.createdAt).toLocaleDateString("ko-KR")}
        </div>
      </div>
    </Link>
  );
}
