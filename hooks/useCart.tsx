"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ItemSheet } from "@/types/interface";

interface CartItem {
  product: ItemSheet;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: ItemSheet) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (productId: number) => void;
  moveToCart: (productId: number) => void;
  removeSavedItem: (productId: number) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedSaved = localStorage.getItem("savedForLater");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch {
        setItems([]);
      }
    }
    if (storedSaved) {
      try {
        setSavedItems(JSON.parse(storedSaved));
      } catch {
        setSavedItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Guardar items guardados en localStorage cuando cambia
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("savedForLater", JSON.stringify(savedItems));
    }
  }, [savedItems, isLoaded]);

  const addItem = (product: ItemSheet) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Guardar item para más tarde
  const saveForLater = (productId: number) => {
    const itemToSave = items.find((item) => item.product.id === productId);
    if (itemToSave) {
      setSavedItems((current) => {
        const existing = current.find((i) => i.product.id === productId);
        if (existing) {
          // Si ya existe, sumar cantidades
          return current.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: i.quantity + itemToSave.quantity }
              : i
          );
        }
        return [...current, itemToSave];
      });
      removeItem(productId);
    }
  };

  // Mover item guardado al carrito
  const moveToCart = (productId: number) => {
    const itemToMove = savedItems.find((item) => item.product.id === productId);
    if (itemToMove) {
      setItems((current) => {
        const existing = current.find((i) => i.product.id === productId);
        if (existing) {
          return current.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: i.quantity + itemToMove.quantity }
              : i
          );
        }
        return [...current, itemToMove];
      });
      removeSavedItem(productId);
    }
  };

  // Eliminar item guardado
  const removeSavedItem = (productId: number) => {
    setSavedItems((current) =>
      current.filter((item) => item.product.id !== productId)
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product.list_price || "0");
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        removeSavedItem,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
