"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/data";

type CartLine = { product: Product; quantity: number };

type CommerceContextValue = {
  cart: CartLine[];
  wishlist: Product[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (slug: string) => boolean;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem("aurae-next-cart");
      const savedWishlist = window.localStorage.getItem("aurae-next-wishlist");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // The storefront remains usable when storage is unavailable.
    }
  }, []);

  useEffect(() => { window.localStorage.setItem("aurae-next-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { window.localStorage.setItem("aurae-next-wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.slug === product.slug);
      if (existing) return current.map((line) => line.product.slug === product.slug ? { ...line, quantity: line.quantity + quantity } : line);
      return [...current, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setCart((current) => quantity <= 0 ? current.filter((line) => line.product.slug !== slug) : current.map((line) => line.product.slug === slug ? { ...line, quantity } : line));
  }, []);

  const removeFromCart = useCallback((slug: string) => setCart((current) => current.filter((line) => line.product.slug !== slug)), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((current) => current.some((item) => item.slug === product.slug) ? current.filter((item) => item.slug !== product.slug) : [...current, product]);
  }, []);

  const value = useMemo(() => ({
    cart,
    wishlist,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    cartSubtotal: cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    isWishlisted: (slug: string) => wishlist.some((item) => item.slug === slug)
  }), [addToCart, cart, removeFromCart, toggleWishlist, updateQuantity, wishlist]);

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used inside CommerceProvider");
  return context;
}
