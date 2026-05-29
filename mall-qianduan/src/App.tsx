/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Wallet,
  Coins,
  Monitor,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  Scissors,
  BookOpen,
  Baby,
  ShoppingBasket,
  Star,
  LogOut,
  MapPin,
  Settings,
  Package,
  Loader2,
  AlertCircle,
  Edit,
  XCircle,
  Truck,
  Clock,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, View } from './types';
import * as userApi from './api/user';
import * as productApi from './api/product';
import * as cartApi from './api/cart';
import * as orderApi from './api/order';
import * as paymentApi from './api/payment';
import * as addressApi from './api/address';
import * as stockApi from './api/stock';
import {
  DISCOUNT_RATE,
  DEFAULT_STOCK,
  LOW_STOCK_THRESHOLD,
  PRODUCT_PAGE_SIZE,
  ORDER_PAGE_SIZE,
  PRODUCTS_PER_PAGE,
  PAYMENT_REDIRECT_DELAY,
} from './constants';
import { isSuccessResponse, getStatusText } from './utils/helpers';
import Pagination from './components/Pagination';
import EmptyState from './components/EmptyState';
import BackButton from './components/BackButton';

// --- Types ---

interface User {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  email: string;
}

interface Order {
  id: number;
  orderSn: string;
  totalAmount: number;
  status: number;
  createTime: string;
  payTime?: string;
}

// --- Constants & Data ---

const CATEGORIES = [
  { name: '手机数码', icon: Monitor, id: 1 },
  { name: '电脑办公', icon: Shirt, id: 2 },
  { name: '家用电器', icon: HomeIcon, id: 3 },
  { name: '手机', icon: Dumbbell, id: 4 },
  { name: '平板', icon: Scissors, id: 5 },
  { name: '笔记本', icon: BookOpen, id: 6 },
  { name: '配件', icon: Baby, id: 7 },
  { name: '生鲜超市', icon: ShoppingBasket, id: 8 },
];

// --- Components ---

const Header = ({
  view,
  cartCount,
  user,
  onNavigate,
  searchKeyword,
  onSearch,
}: {
  view: View;
  cartCount: number;
  user: any;
  onNavigate: (view: View) => void;
  searchKeyword: string;
  onSearch: (keyword: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(searchKeyword);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
    if (view !== 'home') {
      onNavigate('home');
    }
  };

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50 h-16">
      <div className="container-max h-full flex items-center justify-between">
        <div
          className="text-2xl font-bold text-primary-container cursor-pointer flex items-center gap-2"
          onClick={() => {
            onSearch('');
            setInputValue('');
            onNavigate('home');
          }}
        >
          RetailPrime
        </div>

        <nav className="hidden md:flex items-center gap-8 ml-8">
          {['home', 'shop', 'offers', 'support'].map((link) => (
            <button
              key={link}
              onClick={() => {
                if (link === 'home') {
                  onSearch('');
                  setInputValue('');
                  onNavigate('home');
                }
              }}
              className={`text-sm font-medium transition-colors hover:text-primary-container ${
                view === 'home' && link === 'home'
                  ? 'text-primary-container border-b-2 border-primary-container pb-1'
                  : 'text-on-surface-variant'
              }`}
            >
              {link === 'home' ? '首页' : link === 'shop' ? '商城' : link === 'offers' ? '特惠' : '支持'}
            </button>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 relative hidden md:block">
          <input
            type="text"
            placeholder="搜索全球好物..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary-container transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            className="relative p-2 hover:bg-surface-container rounded-full transition-colors"
            onClick={() => onNavigate('cart')}
          >
            <ShoppingCart className="w-5 h-5 text-primary-container" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors hidden sm:block">
            <Bell className="w-5 h-5 text-primary-container" />
          </button>
          <div
            className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-container/20 transition-all"
            onClick={() => (user ? onNavigate('profile') : onNavigate('login'))}
          >
            <img
              src="https://picsum.photos/200/200?random=300"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-surface-container-lowest border-t border-outline-variant mt-16 py-12">
    <div className="container-max grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <div className="text-xl font-bold">RetailPrime</div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          为您提供高效、可靠、现代的功能化购物体验。您的信任是我们的基石。
        </p>
        <div className="flex gap-4">
          <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
            <Star className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-4">公司</h4>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          <li><button className="hover:text-primary-container transition-colors">关于我们</button></li>
          <li><button className="hover:text-primary-container transition-colors">招贤纳士</button></li>
          <li><button className="hover:text-primary-container transition-colors">隐私政策</button></li>
          <li><button className="hover:text-primary-container transition-colors">使用条款</button></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">支持</h4>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          <li><button className="hover:text-primary-container transition-colors">客户服务</button></li>
          <li><button className="hover:text-primary-container transition-colors">帮助中心</button></li>
          <li><button className="hover:text-primary-container transition-colors">退货政策</button></li>
          <li><button className="hover:text-primary-container transition-colors">联系我们</button></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">保持联系</h4>
        <p className="text-sm text-on-surface-variant mb-4">订阅我们的简报以获取最新优惠和动态。</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="电子邮件地址"
            className="flex-1 h-10 px-4 rounded-lg bg-surface-container-low border border-outline-variant focus:ring-1 focus:ring-primary-container outline-none text-sm"
          />
          <button className="bg-primary-container text-white px-4 h-10 rounded-lg hover:opacity-90 transition-opacity">
            加入
          </button>
        </div>
      </div>
    </div>
    <div className="container-max border-t border-outline-variant mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
      <div>© 2024 RetailPrime Inc. 版权所有。</div>
      <div className="flex gap-6">
        <CreditCard className="w-5 h-5 opacity-50" />
        <Wallet className="w-5 h-5 opacity-50" />
        <Coins className="w-5 h-5 opacity-50" />
      </div>
    </div>
  </footer>
);

const ProductCard: React.FC<{
  product: Product;
  onNavigate: (view: View, p?: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}> = ({ product, onNavigate, onAddToCart }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden group hover:shadow-xl transition-all duration-300"
  >
    <div
      className="aspect-square relative overflow-hidden bg-surface-container-low cursor-pointer"
      onClick={() => onNavigate('product', product)}
    >
      <img
        src={product.mainImage}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {product.badge && (
        <span className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold ${product.badgeColor || 'bg-primary-container text-white'}`}>
          {product.badge}
        </span>
      )}
      <button
        className="absolute bottom-3 right-3 w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
    <div className="p-4 space-y-2">
      <h3
        className="font-semibold text-on-surface line-clamp-1 hover:text-primary-container cursor-pointer transition-colors"
        onClick={() => onNavigate('product', product)}
      >
        {product.name}
      </h3>
      <p className="text-xs text-on-surface-variant line-clamp-1">{product.description}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-lg font-bold text-primary-container">¥{product.price.toFixed(2)}</span>
        <span className="text-[10px] text-on-surface-variant uppercase font-medium">已售 {product.sales}+</span>
      </div>
    </div>
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary-container" />
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <AlertCircle className="w-12 h-12 text-error" />
    <p className="text-on-surface-variant">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
      >
        重试
      </button>
    )}
  </div>
);

// --- Profile View (外部组件，避免输入框状态丢失) ---

interface ProfileViewComponentProps {
  user: any;
  isEditingProfile: boolean;
  setIsEditingProfile: (v: boolean) => void;
  profileForm: { nickname: string; email: string; phone: string };
  setProfileForm: (v: { nickname: string; email: string; phone: string }) => void;
  profileLoading: boolean;
  handleUpdateUserInfo: () => void;
  navigateTo: (v: View) => void;
  handleLogout: () => void;
}

const ProfileViewComponent: React.FC<ProfileViewComponentProps> = ({
  user,
  isEditingProfile,
  setIsEditingProfile,
  profileForm,
  setProfileForm,
  profileLoading,
  handleUpdateUserInfo,
  navigateTo,
  handleLogout,
}) => {
  if (!user) return null;

  return (
    <div className="py-12 space-y-12">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-32 h-32 rounded-3xl border-4 border-primary-container p-1 overflow-hidden">
          <img src="https://picsum.photos/200/200?random=200" className="w-full h-full object-cover rounded-2xl" alt="profile" />
        </div>
        <div className="flex-grow space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-bold">{user.nickname || user.username}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">高级会员</span>
            <span className="text-on-surface-variant text-sm font-medium">{user.username}</span>
          </div>
          {user.email && <p className="text-on-surface-variant text-sm">{user.email}</p>}
          {user.phone && <p className="text-on-surface-variant text-sm">{user.phone}</p>}
        </div>
        <button
          className="px-6 h-12 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          onClick={() => {
            setProfileForm({
              nickname: user.nickname || '',
              email: user.email || '',
              phone: user.phone || '',
            });
            setIsEditingProfile(true);
          }}
        >
          <Edit className="w-4 h-4" />
          编辑资料
        </button>
      </section>

      {isEditingProfile && (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">编辑个人信息</h3>
            <button
              className="p-2 hover:bg-surface-container rounded-full transition-colors"
              onClick={() => setIsEditingProfile(false)}
            >
              <XCircle className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">昵称</label>
              <input
                type="text"
                value={profileForm.nickname}
                onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                placeholder="请输入昵称"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">邮箱</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                placeholder="请输入邮箱"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">电话</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                placeholder="请输入电话"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="px-8 h-12 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
              onClick={handleUpdateUserInfo}
              disabled={profileLoading}
            >
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              保存
            </button>
            <button
              className="px-8 h-12 border border-outline-variant rounded-xl font-bold hover:bg-surface-container transition-colors"
              onClick={() => setIsEditingProfile(false)}
            >
              取消
            </button>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className="bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl text-center space-y-3 cursor-pointer hover:border-primary-container transition-colors shadow-sm group"
          onClick={() => navigateTo('orders')}
        >
          <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl mx-auto group-hover:bg-primary-container/10 transition-colors">
            <Package className="w-6 h-6 text-primary-container" />
          </div>
          <h4 className="font-bold">全部订单</h4>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">查看您的购物记录</p>
        </div>
        <div
          className="bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl text-center space-y-3 cursor-pointer hover:border-primary-container transition-colors shadow-sm group"
          onClick={() => navigateTo('address')}
        >
          <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl mx-auto group-hover:bg-primary-container/10 transition-colors">
            <MapPin className="w-6 h-6 text-primary-container" />
          </div>
          <h4 className="font-bold">收货地址</h4>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">管理您的配送信息</p>
        </div>
        <div
          className="bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl text-center space-y-3 cursor-pointer hover:border-primary-container transition-colors shadow-sm group"
          onClick={() => navigateTo('profile')}
        >
          <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl mx-auto group-hover:bg-primary-container/10 transition-colors">
            <Settings className="w-6 h-6 text-primary-container" />
          </div>
          <h4 className="font-bold">账号设置</h4>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">安全与个人偏好</p>
        </div>
        <div
          className="bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl text-center space-y-3 cursor-pointer hover:bg-error/5 hover:border-error group transition-all shadow-sm"
          onClick={handleLogout}
        >
          <div className="w-12 h-12 bg-error/10 flex items-center justify-center rounded-2xl mx-auto group-hover:bg-error transition-colors">
            <LogOut className="w-6 h-6 text-error group-hover:text-white" />
          </div>
          <h4 className="font-bold text-error">退出登录</h4>
          <p className="text-[10px] uppercase font-bold text-error/60 tracking-widest">结束当前会话</p>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<addressApi.Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<addressApi.Address | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = PRODUCTS_PER_PAGE;
  // NEW: Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ nickname: '', email: '', phone: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  // NEW: Order action loading
  const [orderActionLoading, setOrderActionLoading] = useState<number | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Load cart when user logs in
  const loadCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const res = await cartApi.getCartList();
      if (isSuccessResponse(res)) {
        setCart(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Load addresses
  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    try {
      const res = await addressApi.getAddressList();
      if (isSuccessResponse(res)) {
        const addrList = res.data || [];
        setAddresses(addrList);
        // Auto-select default address
        const defaultAddr = addrList.find((a: addressApi.Address) => a.isDefault === 1);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        } else if (addrList.length > 0) {
          setSelectedAddress(addrList[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    }
  }, [user]);

  useEffect(() => {
    if (view === 'checkout' || view === 'address') {
      loadAddresses();
    }
  }, [view, loadAddresses]);

  // Load products
  const loadProducts = useCallback(async (keyword?: string, categoryId?: number | null) => {
    setLoading(true);
    setError(null);
    try {
      const params: { pageNum: number; pageSize: number; keyword?: string; categoryId?: number } = {
        pageNum: 1,
        pageSize: PRODUCT_PAGE_SIZE,
      };
      if (keyword && keyword.trim()) {
        params.keyword = keyword.trim();
      }
      if (categoryId) {
        params.categoryId = categoryId;
      }
      const res = await productApi.getProductList(params);
      if (isSuccessResponse(res)) {
        const data = res.data as { records?: Product[] };
        setProducts(data.records || (res.data as Product[]) || []);
      }
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError('加载商品失败，请稍后重试');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'home') {
      loadProducts(searchKeyword, selectedCategoryId);
    }
  }, [view, loadProducts, searchKeyword, selectedCategoryId]);

  // --- Actions ---

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) {
      setView('login');
      return;
    }
    try {
      const res = await cartApi.addToCart({
        productId: product.id as unknown as number,
        skuId: product.id as unknown as number,
        skuName: product.name,
        skuImage: product.mainImage,
        price: product.price,
        quantity,
      });
      if (isSuccessResponse(res)) {
        await loadCart();
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('添加购物车失败');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const res = await cartApi.removeFromCart(Number(id));
      if (isSuccessResponse(res)) {
        await loadCart();
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const updateCartQuantity = async (id: string, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    try {
      const res = await cartApi.updateCartItem(Number(id), newQty);
      if (isSuccessResponse(res)) {
        await loadCart();
      }
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const toggleCartItemCheck = async (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    try {
      const res = await cartApi.checkCartItem(id, item.checked !== 1);
      if (isSuccessResponse(res)) {
        await loadCart();
      }
    } catch (err) {
      console.error('Failed to toggle cart item:', err);
    }
  };

  const toggleAllCartCheck = async () => {
    const allChecked = cart.every((item) => item.checked === 1);
    try {
      const res = await cartApi.checkAllCart(!allChecked);
      if (isSuccessResponse(res)) {
        await loadCart();
      }
    } catch (err) {
      console.error('Failed to toggle all cart items:', err);
    }
  };

  const navigateTo = (newView: View, product?: Product) => {
    if (product) setSelectedProduct(product);
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.login({ username, password });
      if (isSuccessResponse(res)) {
        const token = res.data?.token || res.data;
        if (token) {
          localStorage.setItem('token', typeof token === 'string' ? token : token.token);
        }
        // Load user info
        const userRes = await userApi.getUserInfo();
        if (userRes.code === 200 || userRes.code === 0) {
          const userData = userRes.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        navigateTo('home');
      } else {
        setError(res.message || '登录失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.register({ username, password, nickname: username });
      if (isSuccessResponse(res)) {
        navigateTo('login');
        alert('注册成功，请登录');
      } else {
        setError(res.message || '注册失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    navigateTo('home');
  };

  // NEW: Update user info
  const handleUpdateUserInfo = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const res = await userApi.updateUserInfo(profileForm);
      if (isSuccessResponse(res)) {
        const updatedUser = { ...user, ...profileForm };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        alert('个人信息更新成功');
      } else {
        alert(res.message || '更新失败');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || '更新失败，请稍后重试');
    } finally {
      setProfileLoading(false);
    }
  };

  // NEW: Cancel order
  const handleCancelOrder = async (id: number) => {
    if (!confirm('确定要取消这个订单吗？')) return;
    setOrderActionLoading(id);
    try {
      const res = await orderApi.cancelOrder(id);
      if (isSuccessResponse(res)) {
        await loadOrders();
        alert('订单已取消');
      } else {
        alert(res.message || '取消订单失败');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || '取消订单失败');
    } finally {
      setOrderActionLoading(null);
    }
  };

  // NEW: Confirm order receipt
  const handleConfirmOrder = async (id: number) => {
    if (!confirm('确认已收到货物？')) return;
    setOrderActionLoading(id);
    try {
      const res = await orderApi.confirmOrder(id);
      if (isSuccessResponse(res)) {
        await loadOrders();
        alert('已确认收货');
      } else {
        alert(res.message || '确认收货失败');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || '确认收货失败');
    } finally {
      setOrderActionLoading(null);
    }
  };

  const loadOrders = async () => {
    if (!user) {
      navigateTo('login');
      return;
    }
    try {
      const res = await orderApi.getOrderList({ pageNum: 1, pageSize: ORDER_PAGE_SIZE });
      if (isSuccessResponse(res)) {
        setOrders(res.data?.records || res.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      if (err.response?.status !== 401) {
        console.error('加载订单列表失败');
      }
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm('确定要删除这个订单吗？')) return;
    try {
      const res = await orderApi.deleteOrder(id);
      if (isSuccessResponse(res)) {
        await loadOrders();
      }
    } catch (err: any) {
      console.error('Failed to delete order:', err);
      alert(err.response?.data?.message || '删除订单失败');
    }
  };

  const loadOrderDetail = async (id: number) => {
    if (!user) {
      navigateTo('login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getOrderDetail(id);
      if (isSuccessResponse(res)) {
        setSelectedOrder(res.data);
      } else {
        setError(res.message || '加载订单详情失败');
      }
    } catch (err: any) {
      console.error('Failed to load order detail:', err);
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || '加载订单详情失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'orders') {
      loadOrders();
    }
  }, [view]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setSelectedCategoryId(null);
    setCurrentPage(1);
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSearchKeyword('');
    setCurrentPage(1);
  };

  const HomeView = () => (
    <div className="space-y-12 py-8">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
        <div className="relative group rounded-3xl overflow-hidden shadow-sm border border-outline-variant">
          <img
            src="https://picsum.photos/800/400?random=100"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Hero 1"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="bg-primary-container px-3 py-1 rounded-full text-[10px] font-bold w-fit mb-3">新品上市</span>
            <h2 className="text-3xl font-bold mb-2">现代生活，格调升级</h2>
            <p className="text-sm opacity-90">探索精选智能家居与厨房必备单品</p>
          </div>
        </div>
        <div className="relative group rounded-3xl overflow-hidden shadow-sm border border-outline-variant">
          <img
            src="https://picsum.photos/800/400?random=101"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Hero 2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="bg-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold w-fit mb-3">限时秒杀</span>
            <h2 className="text-3xl font-bold mb-2">数码潮流前哨站</h2>
            <p className="text-sm opacity-90">高效工作，畅快娱乐，一站式数码方案</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">全部分类</h3>
          <button
            className="text-sm font-medium text-primary-container hover:underline"
            onClick={() => {
              setSelectedCategoryId(null);
              setSearchKeyword('');
            }}
          >
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <div
                key={cat.name}
                className={`flex flex-col items-center gap-3 group cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-110' : ''
                }`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary-container border-primary-container shadow-lg'
                    : 'bg-surface-container border-outline-variant group-hover:border-primary-container group-hover:shadow-lg'
                }`}>
                  <cat.icon className={`w-7 h-7 ${
                    isSelected ? 'text-white' : 'text-primary-container'
                  }`} />
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  isSelected ? 'text-primary-container font-bold' : 'text-on-surface-variant group-hover:text-primary-container'
                }`}>{cat.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hot Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold">
              {searchKeyword
                ? `"${searchKeyword}" 的搜索结果`
                : selectedCategoryId
                ? `${CATEGORIES.find(c => c.id === selectedCategoryId)?.name || ''} 分类商品`
                : '热门爆款'
              }
            </h3>
            {(searchKeyword || selectedCategoryId) && (
              <button
                className="text-sm text-primary-container hover:underline"
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedCategoryId(null);
                  setCurrentPage(1);
                }}
              >
                清除筛选
              </button>
            )}
          </div>
          {products.length > productsPerPage && (
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
              </button>
              <span className="text-sm text-on-surface-variant font-medium px-2">
                {currentPage} / {Math.ceil(products.length / productsPerPage)}
              </span>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / productsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(products.length / productsPerPage)}
              >
                <ChevronRight className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
          )}
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadProducts} />
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">暂无商品</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products
                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                .map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={navigateTo} onAddToCart={addToCart} />
                ))}
            </div>
            {products.length > productsPerPage && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
                </button>
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => i + 1)
                  .filter(page => {
                    const totalPages = Math.ceil(products.length / productsPerPage);
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                  })
                  .reduce<(number | string)[]>((acc, page, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && page - (arr[idx - 1] as number) > 1) {
                      acc.push('...');
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((page, idx) => (
                    typeof page === 'number' ? (
                      <button
                        key={idx}
                        className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shadow-sm font-medium ${
                          currentPage === page
                            ? 'bg-primary-container text-white border-primary-container'
                            : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={idx} className="px-2 text-on-surface-variant">...</span>
                    )
                  ))}
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / productsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(products.length / productsPerPage)}
                >
                  <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );

  const ProductDetailView = () => {
    // NEW: 库存状态
    const [stock, setStock] = useState<number | null>(null);

    // NEW: 加载库存数据
    useEffect(() => {
      if (selectedProduct) {
        const loadStock = async () => {
          try {
            const res = await stockApi.getStock(selectedProduct.id as number);
            if (isSuccessResponse(res)) {
              setStock((res.data as { quantity: number }).quantity);
            } else {
              setStock(DEFAULT_STOCK); // API 返回失败时显示默认库存
            }
          } catch {
            setStock(DEFAULT_STOCK); // API 调用失败时显示默认库存
          }
        };
        loadStock();
      }
    }, [selectedProduct]);

    if (!selectedProduct) return null;
    return (
      <div className="py-8 space-y-8">
        {/* 返回按钮 */}
        <BackButton onClick={() => navigateTo('home')} label="返回首页" />

        {/* 商品主图和信息 */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 左侧：商品图片 */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-low">
                <img src={selectedProduct.mainImage} className="w-full h-full object-cover" alt={selectedProduct.name} />
              </div>
            </div>

            {/* 右侧：商品信息 */}
            <div className="space-y-6">
              {/* 标题和标签 */}
              <div className="space-y-3">
                {selectedProduct.badge && (
                  <span className="inline-block bg-primary-container/10 text-primary-container px-3 py-1 rounded-full text-xs font-bold">{selectedProduct.badge}</span>
                )}
                <h1 className="text-2xl font-bold leading-tight">{selectedProduct.name}</h1>
                <p className="text-on-surface-variant text-sm">{selectedProduct.description}</p>
              </div>

              {/* 价格和销量 */}
              <div className="bg-surface-container rounded-2xl p-5 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary-container">¥{selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span>5.0 好评</span>
                  </div>
                  <div className="w-px h-4 bg-outline-variant"></div>
                  <span>已售 {selectedProduct.sales} 件</span>
                </div>
                {/* 库存显示 */}
                {stock !== null && (
                  <div className={`flex items-center gap-2 text-sm font-medium ${stock <= LOW_STOCK_THRESHOLD ? 'text-error' : 'text-secondary'}`}>
                    {stock <= LOW_STOCK_THRESHOLD && <AlertCircle className="w-4 h-4" />}
                    <span>库存: {stock} 件</span>
                    {stock <= LOW_STOCK_THRESHOLD && stock > 0 && <span className="text-xs bg-error/10 px-2 py-0.5 rounded-full">库存紧张</span>}
                    {stock === 0 && <span className="text-xs bg-error/10 px-2 py-0.5 rounded-full">已售罄</span>}
                  </div>
                )}
              </div>

              {/* 商品分类 */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant">分类:</span>
                <span className="px-3 py-1 bg-surface-container rounded-lg text-sm font-medium border border-outline-variant">{selectedProduct.category}</span>
              </div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  className={`h-14 rounded-2xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${stock === 0 ? 'border-outline-variant text-on-surface-variant cursor-not-allowed opacity-50' : 'border-primary-container text-primary-container hover:bg-primary-container/5'}`}
                  onClick={() => addToCart(selectedProduct)}
                  disabled={stock === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {stock === 0 ? '已售罄' : '加入购物车'}
                </button>
                <button
                  className={`h-14 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${stock === 0 ? 'bg-on-surface-variant text-white cursor-not-allowed opacity-50' : 'bg-primary-container text-white hover:opacity-90'}`}
                  onClick={() => {
                    addToCart(selectedProduct);
                    navigateTo('cart');
                  }}
                  disabled={stock === 0}
                >
                  {stock === 0 ? '已售罄' : '立即购买'}
                </button>
              </div>

              {/* 服务保障 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Package className="w-4 h-4 text-primary-container" />
                  <span>极速发货</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <ShieldCheck className="w-4 h-4 text-primary-container" />
                  <span>正品保障</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Truck className="w-4 h-4 text-primary-container" />
                  <span>免费配送</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <CheckCircle2 className="w-4 h-4 text-primary-container" />
                  <span>7天退换</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 商品详情 */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-primary-container rounded-full"></div>
            商品详情
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-surface-container rounded-xl p-5">
                <h4 className="font-bold mb-3 text-sm">商品信息</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">商品名称</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">商品分类</span>
                    <span className="font-medium">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">累计销量</span>
                    <span className="font-medium">{selectedProduct.sales} 件</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container rounded-xl p-5">
                <h4 className="font-bold mb-3 text-sm">服务保障</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>正品保证</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>极速退款</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>七天退换</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>免费配送</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const CartView = () => {
    const allChecked = cart.length > 0 && cart.every((item) => item.checked === 1);
    const checkedTotal = cart
      .filter((item) => item.checked === 1)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    const checkedCount = cart.filter((item) => item.checked === 1).length;

    return (
    <div className="py-8 space-y-8">
      <div className="flex items-baseline gap-4">
        <h1 className="text-3xl font-bold">购物车</h1>
        <span className="text-on-surface-variant text-sm font-medium">({cart.length} 件商品)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              message="您的购物车空空如也"
              actionLabel="去逛逛"
              onAction={() => navigateTo('home')}
            />
          ) : (
            <>
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={allChecked}
                  className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container"
                  onChange={toggleAllCartCheck}
                />
                <span className="text-sm font-medium">全选</span>
              </div>
              {cart.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 flex items-center gap-6 shadow-sm hover:border-primary-container/30 transition-colors">
                <input
                  type="checkbox"
                  checked={item.checked === 1}
                  className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container"
                  onChange={() => toggleCartItemCheck(item.id)}
                />
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container border border-outline-variant flex-shrink-0">
                  <img src={item.skuImage || 'https://via.placeholder.com/96'} className="w-full h-full object-cover" alt={item.skuName} />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold">{item.skuName}</h3>
                    <button
                      className="text-on-surface-variant hover:text-error transition-colors"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden h-9">
                      <button className="px-3 hover:bg-surface-container transition-colors font-bold" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                      <span className="w-10 text-center text-sm font-bold bg-transparent">{item.quantity}</span>
                      <button className="px-3 hover:bg-surface-container transition-colors font-bold" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                    </div>
                    <span className="text-xl font-bold text-primary-container">¥{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
            </>
          )}
        </div>

        <aside className="space-y-6 sticky top-24">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">订单摘要</h2>
            <div className="space-y-4 border-b border-outline-variant pb-6 mb-6">
              <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                <span>已选商品 ({checkedCount}件)</span>
                <span className="text-on-surface">¥{checkedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                <span>预估运费</span>
                <span className="text-secondary font-bold">免费</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-8">
              <span className="text-lg font-bold">应付总额</span>
              <span className="text-3xl font-bold text-primary-container">¥{(checkedTotal * DISCOUNT_RATE).toFixed(2)}</span>
            </div>
            <button
              className="w-full h-14 bg-primary-container text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
              onClick={() => navigateTo('checkout')}
              disabled={checkedCount === 0}
            >
              去结算
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-on-surface-variant font-bold justify-center grayscale opacity-60">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>安全支付保障</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
    );
  };

  const AuthView = ({ isLogin }: { isLogin: boolean }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant shadow-xl text-center space-y-8"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-container tracking-tight">RetailPrime</div>
            <h1 className="text-2xl font-bold text-on-surface">{isLogin ? '登录' : '注册账号'}</h1>
            <p className="text-sm text-on-surface-variant">{isLogin ? '欢迎回来' : '开启您的智慧购物之旅'}</p>
          </div>

          {error && (
            <div className="p-3 bg-error/10 text-error rounded-xl text-sm">{error}</div>
          )}

          <form
            className="space-y-6 text-left"
            onSubmit={(e) => {
              e.preventDefault();
              if (isLogin) {
                handleLogin(username, password);
              } else {
                handleRegister(username, password);
              }
            }}
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                placeholder="输入您的用户名"
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">密码</label>
                {isLogin && <button type="button" className="text-xs font-bold text-primary-container hover:underline">忘记密码?</button>}
              </div>
              <input
                type="password"
                title="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full h-14 bg-primary-container text-white rounded-2xl font-bold hover:opacity-95 active:scale-[0.98] transition-all shadow-lg mt-4 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? '登录' : '立即注册'}
            </button>
          </form>

          <div className="pt-6 border-t border-outline-variant text-sm">
            <p className="text-on-surface-variant">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button className="text-primary-container font-bold ml-1 hover:underline" onClick={() => { setError(null); navigateTo(isLogin ? 'register' : 'login'); }}>
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  };

  const CheckoutView = () => {
    const [submitting, setSubmitting] = useState(false);
    const checkedItems = cart.filter((item) => item.checked === 1);
    const checkedTotal = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
      if (!user) {
        navigateTo('login');
        return;
      }
      if (!selectedAddress) {
        alert('请选择收货地址');
        return;
      }
      setSubmitting(true);
      try {
        const res = await orderApi.createOrder({
          addressId: selectedAddress.id,
          receiverName: selectedAddress.name,
          receiverPhone: selectedAddress.phone,
          receiverAddress: `${selectedAddress.province}${selectedAddress.city}${selectedAddress.district}${selectedAddress.detailAddress}`,
          remark: '',
        });
        if (isSuccessResponse(res)) {
          // NEW: 跳转到支付页面，而不是直接完成支付
          const order = res.data as Order;
          setSelectedOrder(order);
          setCart([]);
          navigateTo('payment');
        } else {
          alert(res.message || '下单失败');
        }
      } catch (err: any) {
        alert(err.response?.data?.message || '下单失败，请稍后重试');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="py-8 space-y-12">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-secondary" />
          核对订单信息
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-container" />
                  收货地址
                </h3>
                <button
                  className="text-sm font-bold text-primary-container hover:underline"
                  onClick={() => navigateTo('address')}
                >
                  管理地址
                </button>
              </div>
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant">
                  <p>暂无收货地址</p>
                  <button
                    className="mt-4 text-primary-container font-bold hover:underline"
                    onClick={() => navigateTo('address')}
                  >
                    添加新地址
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-6 rounded-2xl border transition-colors cursor-pointer ${
                        selectedAddress?.id === addr.id
                          ? 'border-primary-container bg-primary-container/5'
                          : 'border-outline-variant hover:border-primary-container bg-surface-container-low/50'
                      }`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold">{addr.name}</h4>
                            <span className="text-sm text-on-surface-variant">{addr.phone}</span>
                            {addr.isDefault === 1 && (
                              <span className="bg-primary-container/10 text-primary-container px-2 py-0.5 rounded text-[10px] font-bold">默认</span>
                            )}
                          </div>
                          <p className="text-sm text-on-surface-variant mt-2">
                            {addr.province}{addr.city}{addr.district}{addr.detailAddress}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAddress?.id === addr.id ? 'border-primary-container' : 'border-outline-variant'
                        }`}>
                          {selectedAddress?.id === addr.id && (
                            <div className="w-3 h-3 rounded-full bg-primary-container" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-container" />
                商品清单 ({checkedItems.length})
              </h3>
              <div className="space-y-4">
                {checkedItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-outline-variant last:border-0 items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant flex-shrink-0">
                      <img src={item.skuImage || 'https://via.placeholder.com/64'} className="w-full h-full object-cover" alt="item" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm">{item.skuName}</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-tight">数量: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm">¥{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm sticky top-24 space-y-8">
              <h2 className="text-xl font-bold">费用详情</h2>
              <div className="space-y-4 border-b border-outline-variant pb-6">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>小计 ({checkedItems.length}件商品)</span>
                  <span className="text-on-surface font-medium">¥{checkedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>运费</span>
                  <span className="text-secondary font-bold">¥0.00</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">总计</span>
                <span className="text-4xl font-bold text-primary-container">¥{(checkedTotal * DISCOUNT_RATE).toFixed(2)}</span>
              </div>
              <button
                className="w-full h-14 bg-primary-container text-white rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center"
                onClick={handleCheckout}
                disabled={submitting || checkedItems.length === 0}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '提交订单'}
              </button>
              <div className="flex justify-center gap-6 opacity-40 grayscale">
                <CheckCircle2 className="w-6 h-6" />
                <ShieldCheck className="w-6 h-6" />
                <div className="w-6 h-6 bg-current rounded-full" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  const ProfileView = () => (
    <ProfileViewComponent
      user={user}
      isEditingProfile={isEditingProfile}
      setIsEditingProfile={setIsEditingProfile}
      profileForm={profileForm}
      setProfileForm={setProfileForm}
      profileLoading={profileLoading}
      handleUpdateUserInfo={handleUpdateUserInfo}
      navigateTo={navigateTo}
      handleLogout={handleLogout}
    />
  );

  const OrdersView = () => {
    return (
      <div className="py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">订单管理</h1>
          <p className="text-on-surface-variant text-sm">查看、管理及回顾您的订单。</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {orders.length === 0 ? (
            <EmptyState
              icon={Package}
              message="暂无订单"
              actionLabel="去购物"
              onAction={() => navigateTo('home')}
            />
          ) : (
            orders.map((order) => {
              const status = getStatusText(order.status);
              return (
                <div key={order.id} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">订单编号</span>
                        <p className="font-bold">{order.orderSn}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">下单时间</span>
                        <p className="font-bold">{new Date(order.createTime).toLocaleDateString('zh-CN')}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">总金额</span>
                        <p className="font-bold text-primary-container">¥{order.totalAmount.toFixed(2)}</p>
                      </div>
                      <span className={`${status.color} px-3 py-1 rounded-full text-xs font-bold h-fit mt-1`}>{status.text}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      className="flex-1 md:flex-none px-6 h-12 rounded-xl border border-outline-variant font-bold hover:bg-surface-container transition-all"
                      onClick={() => {
                        setSelectedOrder(null);
                        loadOrderDetail(order.id);
                        navigateTo('orderDetail');
                      }}
                    >
                      订单详情
                    </button>
                    {/* NEW: Order action buttons based on status */}
                    {order.status === 0 && (
                      <>
                        <button
                          className="flex-1 md:flex-none px-6 h-12 rounded-xl bg-primary-container text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                          onClick={() => {
                            setSelectedOrder(order);
                            navigateTo('payment');
                          }}
                          disabled={orderActionLoading === order.id}
                        >
                          <CreditCard className="w-4 h-4" />
                          去支付
                        </button>
                        <button
                          className="flex-1 md:flex-none px-6 h-12 rounded-xl border border-error text-error font-bold hover:bg-error/5 transition-all flex items-center justify-center gap-2"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={orderActionLoading === order.id}
                        >
                          {orderActionLoading === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          取消
                        </button>
                      </>
                    )}
                    {order.status === 2 && (
                      <button
                        className="flex-1 md:flex-none px-6 h-12 rounded-xl bg-secondary text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        onClick={() => handleConfirmOrder(order.id)}
                        disabled={orderActionLoading === order.id}
                      >
                        {orderActionLoading === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                        确认收货
                      </button>
                    )}
                    {(order.status === 1 || order.status === 3 || order.status === 4) && (
                      <button
                        className="flex-1 md:flex-none px-6 h-12 rounded-xl border border-error text-error font-bold hover:bg-error/5 transition-all flex items-center justify-center gap-2"
                        onClick={() => deleteOrder(order.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const OrderDetailView = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={() => navigateTo('orders')} />;
    if (!selectedOrder) return <ErrorMessage message="订单信息加载失败" onRetry={() => navigateTo('orders')} />;

    const status = getStatusText(selectedOrder.status);

    return (
      <div className="py-8 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton onClick={() => navigateTo('orders')} />
          <h1 className="text-3xl font-bold">订单详情</h1>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant shadow-sm space-y-8">
          {/* 订单状态 */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">订单状态</h2>
              <span className={`${status.color} px-4 py-2 rounded-full text-sm font-bold`}>{status.text}</span>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-on-surface-variant">订单编号</p>
              <p className="font-bold">{selectedOrder.orderSn}</p>
            </div>
          </div>

          {/* 订单信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-outline-variant pb-2">基本信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">下单时间</span>
                  <span className="font-medium">{new Date(selectedOrder.createTime).toLocaleString('zh-CN')}</span>
                </div>
                {selectedOrder.payTime && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">支付时间</span>
                    <span className="font-medium">{new Date(selectedOrder.payTime).toLocaleString('zh-CN')}</span>
                  </div>
                )}
                {selectedOrder.shipTime && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">发货时间</span>
                    <span className="font-medium">{new Date(selectedOrder.shipTime).toLocaleString('zh-CN')}</span>
                  </div>
                )}
                {selectedOrder.finishTime && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">完成时间</span>
                    <span className="font-medium">{new Date(selectedOrder.finishTime).toLocaleString('zh-CN')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-outline-variant pb-2">收货信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">收货人</span>
                  <span className="font-medium">{selectedOrder.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">联系电话</span>
                  <span className="font-medium">{selectedOrder.receiverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">收货地址</span>
                  <span className="font-medium text-right max-w-[200px]">{selectedOrder.receiverAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 商品列表 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-outline-variant pb-2">商品清单</h3>
            <div className="space-y-4">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-outline-variant last:border-0 items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-outline-variant flex-shrink-0">
                    <img src={item.skuImage || 'https://via.placeholder.com/80'} className="w-full h-full object-cover" alt={item.skuName} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold">{item.skuName}</h4>
                    <p className="text-sm text-on-surface-variant mt-1">数量: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-container">¥{item.price.toFixed(2)}</p>
                    <p className="text-sm text-on-surface-variant">小计: ¥{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 订单金额 */}
          <div className="bg-surface-container rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold">订单金额</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">商品总额</span>
                <span className="font-medium">¥{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">运费</span>
                <span className="font-medium text-secondary">¥0.00</span>
              </div>
              <div className="border-t border-outline-variant pt-3 flex justify-between">
                <span className="text-lg font-bold">实付金额</span>
                <span className="text-2xl font-bold text-primary-container">¥{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 备注 */}
          {selectedOrder.remark && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold">订单备注</h3>
              <p className="text-on-surface-variant">{selectedOrder.remark}</p>
            </div>
          )}

          {/* NEW: Order action buttons */}
          <div className="flex gap-4 pt-4 border-t border-outline-variant">
            {selectedOrder.status === 0 && (
              <>
                <button
                  className="px-8 h-12 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                  onClick={() => {
                    setSelectedOrder(selectedOrder);
                    navigateTo('payment');
                  }}
                >
                  <CreditCard className="w-5 h-5" />
                  去支付
                </button>
                <button
                  className="px-8 h-12 border border-error text-error rounded-xl font-bold hover:bg-error/5 transition-colors flex items-center gap-2"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  <XCircle className="w-5 h-5" />
                  取消订单
                </button>
              </>
            )}
            {selectedOrder.status === 2 && (
              <button
                className="px-8 h-12 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                onClick={() => handleConfirmOrder(selectedOrder.id)}
              >
                <Truck className="w-5 h-5" />
                确认收货
              </button>
            )}
            <button
              className="px-8 h-12 border border-outline-variant rounded-xl font-bold hover:bg-surface-container transition-colors"
              onClick={() => navigateTo('orders')}
            >
              返回订单列表
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddressView = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<addressApi.Address | null>(null);
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detailAddress: '',
      isDefault: 0,
    });

    const handleSave = async () => {
      try {
        if (editingAddress) {
          await addressApi.updateAddress({ ...formData, id: editingAddress.id });
        } else {
          await addressApi.addAddress(formData);
        }
        await loadAddresses();
        setShowForm(false);
        setEditingAddress(null);
        setFormData({ name: '', phone: '', province: '', city: '', district: '', detailAddress: '', isDefault: 0 });
      } catch (err) {
        alert('保存地址失败');
      }
    };

    const handleDelete = async (id: number) => {
      if (!confirm('确定要删除这个地址吗？')) return;
      try {
        await addressApi.deleteAddress(id);
        await loadAddresses();
      } catch (err) {
        alert('删除地址失败');
      }
    };

    const handleSetDefault = async (id: number) => {
      try {
        await addressApi.setDefaultAddress(id);
        await loadAddresses();
      } catch (err) {
        alert('设置默认地址失败');
      }
    };

    const startEdit = (addr: addressApi.Address) => {
      setEditingAddress(addr);
      setFormData({
        name: addr.name,
        phone: addr.phone,
        province: addr.province,
        city: addr.city,
        district: addr.district,
        detailAddress: addr.detailAddress,
        isDefault: addr.isDefault,
      });
      setShowForm(true);
    };

    return (
      <div className="py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton onClick={() => navigateTo('profile')} />
            <h1 className="text-3xl font-bold">收货地址</h1>
          </div>
          <button
            className="px-6 h-12 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            onClick={() => {
              setEditingAddress(null);
              setFormData({ name: '', phone: '', province: '', city: '', district: '', detailAddress: '', isDefault: 0 });
              setShowForm(true);
            }}
          >
            <Plus className="w-5 h-5" />
            添加新地址
          </button>
        </div>

        {showForm && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">{editingAddress ? '编辑地址' : '添加新地址'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">收货人</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                  placeholder="请输入收货人姓名"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">联系电话</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                  placeholder="请输入联系电话"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">省份</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                  placeholder="请输入省份"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">城市</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                  placeholder="请输入城市"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">区/县</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                  placeholder="请输入区/县"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">详细地址</label>
                <input
                  type="text"
                  value={formData.detailAddress}
                  onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                  placeholder="请输入详细地址"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault === 1}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked ? 1 : 0 })}
                  className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container"
                />
                <span className="text-sm font-medium">设为默认地址</span>
              </label>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                className="px-8 h-12 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                onClick={handleSave}
              >
                保存
              </button>
              <button
                className="px-8 h-12 border border-outline-variant rounded-xl font-bold hover:bg-surface-container transition-colors"
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-surface-container-lowest border rounded-3xl p-6 shadow-sm ${
                addr.isDefault === 1 ? 'border-primary-container' : 'border-outline-variant'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg">{addr.name}</h4>
                    <span className="text-on-surface-variant">{addr.phone}</span>
                    {addr.isDefault === 1 && (
                      <span className="bg-primary-container/10 text-primary-container px-2 py-0.5 rounded text-[10px] font-bold">默认</span>
                    )}
                  </div>
                  <p className="text-on-surface-variant">
                    {addr.province}{addr.city}{addr.district}{addr.detailAddress}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-outline-variant">
                {addr.isDefault !== 1 && (
                  <button
                    className="text-sm font-medium text-primary-container hover:underline"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    设为默认
                  </button>
                )}
                <button
                  className="text-sm font-medium text-on-surface-variant hover:text-primary-container transition-colors"
                  onClick={() => startEdit(addr)}
                >
                  编辑
                </button>
                <button
                  className="text-sm font-medium text-error hover:underline"
                  onClick={() => handleDelete(addr.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && !showForm && (
          <EmptyState
            icon={MapPin}
            message="暂无收货地址"
            actionLabel="添加新地址"
            onAction={() => setShowForm(true)}
          />
        )}
      </div>
    );
  };

  // NEW: Payment View
  const PaymentView = () => {
    const [selectedPayType, setSelectedPayType] = useState(1);
    const [paying, setPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = async () => {
      if (!selectedOrder) {
        navigateTo('orders');
        return;
      }
      setPaying(true);
      try {
        const paymentRes = await paymentApi.createPayment({
          orderSn: selectedOrder.orderSn,
          payType: selectedPayType,
          amount: selectedOrder.totalAmount,
        });
        if (isSuccessResponse(paymentRes)) {
          await paymentApi.paymentCallback((paymentRes.data as { paymentSn: string }).paymentSn);
          setPaymentSuccess(true);
          setTimeout(() => {
            navigateTo('orders');
          }, PAYMENT_REDIRECT_DELAY);
        } else {
          alert(paymentRes.message || '支付失败');
        }
      } catch (err: any) {
        alert(err.response?.data?.message || '支付失败，请稍后重试');
      } finally {
        setPaying(false);
      }
    };

    if (paymentSuccess) {
      return (
        <div className="py-12 flex flex-col items-center justify-center space-y-6">
          <CheckCircle2 className="w-24 h-24 text-secondary" />
          <h1 className="text-3xl font-bold">支付成功</h1>
          <p className="text-on-surface-variant">订单支付完成，正在跳转...</p>
        </div>
      );
    }

    return (
      <div className="py-8 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton onClick={() => navigateTo('orders')} />
          <h1 className="text-3xl font-bold">确认支付</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-container" />
                订单摘要
              </h3>
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">订单编号</span>
                    <span className="font-medium">{selectedOrder.orderSn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">下单时间</span>
                    <span className="font-medium">{new Date(selectedOrder.createTime).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="border-t border-outline-variant pt-4 flex justify-between">
                    <span className="font-bold">应付金额</span>
                    <span className="text-2xl font-bold text-primary-container">¥{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Payment Method Selection */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary-container" />
                选择支付方式
              </h3>
              <div className="space-y-4">
                <div
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPayType === 1
                      ? 'border-primary-container bg-primary-container/5'
                      : 'border-outline-variant hover:border-primary-container'
                  }`}
                  onClick={() => setSelectedPayType(1)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedPayType === 1 ? 'bg-primary-container text-white' : 'bg-surface-container'
                    }`}>
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold">支付宝</h4>
                      <p className="text-sm text-on-surface-variant">推荐使用，支持花呗分期</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayType === 1 ? 'border-primary-container' : 'border-outline-variant'
                    }`}>
                      {selectedPayType === 1 && <div className="w-4 h-4 rounded-full bg-primary-container" />}
                    </div>
                  </div>
                </div>
                <div
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPayType === 2
                      ? 'border-primary-container bg-primary-container/5'
                      : 'border-outline-variant hover:border-primary-container'
                  }`}
                  onClick={() => setSelectedPayType(2)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedPayType === 2 ? 'bg-primary-container text-white' : 'bg-surface-container'
                    }`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold">微信支付</h4>
                      <p className="text-sm text-on-surface-variant">微信快捷支付</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayType === 2 ? 'border-primary-container' : 'border-outline-variant'
                    }`}>
                      {selectedPayType === 2 && <div className="w-4 h-4 rounded-full bg-primary-container" />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Payment Summary */}
          <aside>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-xl font-bold">支付详情</h2>
              <div className="space-y-4 border-b border-outline-variant pb-6">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>订单金额</span>
                  <span className="text-on-surface font-medium">¥{selectedOrder?.totalAmount.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>运费</span>
                  <span className="text-secondary font-bold">¥0.00</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">实付金额</span>
                <span className="text-3xl font-bold text-primary-container">¥{selectedOrder?.totalAmount.toFixed(2) || '0.00'}</span>
              </div>
              <button
                className="w-full h-14 bg-primary-container text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    确认支付
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <div className="flex justify-center gap-6 opacity-40 grayscale">
                <ShieldCheck className="w-6 h-6" />
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        view={view}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        user={user}
        onNavigate={navigateTo}
        searchKeyword={searchKeyword}
        onSearch={handleSearch}
      />
      <main className="container-max flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {view === 'home' && <HomeView />}
            {view === 'product' && <ProductDetailView />}
            {view === 'cart' && <CartView />}
            {view === 'login' && <AuthView isLogin={true} />}
            {view === 'register' && <AuthView isLogin={false} />}
            {view === 'checkout' && <CheckoutView />}
            {view === 'profile' && <ProfileView />}
            {view === 'orders' && <OrdersView />}
            {view === 'orderDetail' && <OrderDetailView />}
            {view === 'address' && <AddressView />}
            {view === 'payment' && <PaymentView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
