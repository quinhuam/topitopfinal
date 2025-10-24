export enum View {
  LOGIN,
  DASHBOARD,
  ORDERS,
  CATALOGS,
  PRODUCTS,
  PRIZES,
  PROFILE,
  AFFILIATE,
  CHECKOUT,
  MY_BUSINESS_CREDIT,
  MY_BUSINESS_ORDERS,
  MY_BUSINESS_PAYMENTS,
  MY_BUSINESS_CLIENTS,
  MY_BUSINESS_RETURNS,
  MY_BUSINESS_ORDER_DETAIL
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  gender: 'Mujer' | 'Hombre' | 'Niños' | 'Hogar';
  category: string;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface UserData {
  points: number;
  redeemedPrizes: { [level: number]: string };
}

export interface AppContextType {
  view: View;
  setView: (view: View) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  activeProductCategory: string | null;
  setActiveProductCategory: (category: string | null) => void;
  selectedOrder: any | null;
  setSelectedOrder: (order: any | null) => void;
  userData: UserData;
  redeemPrize: (level: number, prizeName: string, pointsCost: number) => void;
  isSliderVisible: boolean;
  toggleSliderVisibility: () => void;
}