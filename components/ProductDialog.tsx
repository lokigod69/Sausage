"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";
import { StockBadge } from "./StockBadge";

/**
 * The enlarged view of one product: the photograph at a size you can actually
 * look at, the price, the stock, and the shop's own line about it.
 *
 * A native <dialog> rather than a div with role="dialog". showModal() gives
 * the focus trap, the Escape key, the inert background and the return of
 * focus to whatever opened it — four things that are easy to get wrong by
 * hand and that a keyboard user notices immediately when they are missing.
 */
export function ProductDialog({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (product && !el.open) el.showModal();
    if (!product && el.open) el.close();
  }, [product]);

  if (!product) return <dialog ref={ref} className="product-dialog" />;

  const price = formatPrice(product.price, product.currency);

  /*
   * Loyverse's photographs run from 206 to 853 pixels wide. Showing each at
   * its own size keeps every one of them sharp, but a 206px picture alone in
   * a dialog looks like a mistake — so the range is clamped rather than
   * free. 240 is a 1.16x stretch on the smallest, which nobody can see; 480
   * stops the largest from dominating the text beside it.
   */
  const natural = product.imageWidth ?? 360;
  const shown = Math.min(Math.max(natural, 240), 480);
  const ratio =
    product.imageWidth && product.imageHeight
      ? product.imageHeight / product.imageWidth
      : 1;

  return (
    <dialog
      ref={ref}
      className="product-dialog"
      aria-labelledby="product-dialog-name"
      onClose={onClose}
      // The backdrop is part of the dialog element, so a click lands on the
      // dialog itself only when it misses the panel inside it.
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="product-dialog__panel">
        <button
          type="button"
          onClick={onClose}
          className="product-dialog__close"
          aria-label="Close"
        >
          ×
        </button>

        {product.image && (
          <Image
            src={product.image}
            alt={`${product.productName} at The Sausage Guy Panglao`}
            width={shown}
            height={Math.round(shown * ratio)}
            sizes={`${shown}px`}
            className="product-dialog__photo"
          />
        )}

        <h2 id="product-dialog-name" className="product-dialog__name">
          {product.productName}
        </h2>

        <div className="product-dialog__facts">
          {price && <span className="product-dialog__price">{price}</span>}
          {product.unit && (
            <span className="product-dialog__unit">{product.unit}</span>
          )}
          <StockBadge product={product} />
        </div>

        {product.description && (
          <p className="product-dialog__text">{product.description}</p>
        )}
      </div>
    </dialog>
  );
}
