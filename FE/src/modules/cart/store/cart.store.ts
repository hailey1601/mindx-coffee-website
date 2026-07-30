export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

const getCartKey = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return 'coffee_cart_guest';
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return `coffee_cart_${payload.sub || 'guest'}`;
  } catch {
    return 'coffee_cart_guest';
  }
};

export const cartStore = {
  get: (): CartItem[] => {
    try {
      const data = localStorage.getItem(getCartKey());
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  set: (items: CartItem[]) => {
    localStorage.setItem(getCartKey(), JSON.stringify(items));
  },
  add: (product: { _id: string; name: string; price: number; imageUrl: string; category: string }) => {
    const items = cartStore.get();
    const existing = items.find(item => item.productId === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: 1
      });
    }
    cartStore.set(items);
    window.dispatchEvent(new Event('cart-change'));
  },
  remove: (productId: string) => {
    const items = cartStore.get().filter(item => item.productId !== productId);
    cartStore.set(items);
    window.dispatchEvent(new Event('cart-change'));
  },
  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      cartStore.remove(productId);
      return;
    }
    const items = cartStore.get();
    const item = items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    cartStore.set(items);
    window.dispatchEvent(new Event('cart-change'));
  },
  clear: () => {
    localStorage.removeItem(getCartKey());
    window.dispatchEvent(new Event('cart-change'));
  }
};
