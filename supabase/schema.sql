-- Enable PostGIS for location features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('vendor', 'customer')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  address TEXT,
  banner_url TEXT,
  qr_code_url TEXT,
  upi_id TEXT,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity TEXT,
  category TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id), -- Optional for customers
  vendor_id UUID REFERENCES public.vendors(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  customer_name TEXT,
  customer_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- RLS (Row Level Security) Settings
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all, but edit only their own
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vendors: Everyone can view, but owners can edit
CREATE POLICY "Vendors are viewable by everyone." ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Vendors can be created by authenticated users." ON public.vendors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Vendors can be updated by owners." ON public.vendors FOR UPDATE USING (profile_id = auth.uid());

-- Products: Everyone can view, but vendor owners can edit
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Products can be managed by vendor owners." ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE public.vendors.id = public.products.vendor_id 
    AND public.vendors.profile_id = auth.uid()
  )
);

-- Orders: Customers can view their own, Vendors can view their own
CREATE POLICY "Orders are viewable by order parties." ON public.orders FOR SELECT USING (
  auth.uid() = customer_id OR 
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE public.vendors.id = public.orders.vendor_id 
    AND public.vendors.profile_id = auth.uid()
  )
);
