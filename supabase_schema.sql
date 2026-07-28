-- =========================================================================
-- SCRIPT DE MIGRACIÓN PARA SUPABASE
-- Copia y pega todo este código en el "SQL Editor" de tu proyecto Supabase.
-- =========================================================================

-- 1. Tabla de Propiedades
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    barrio TEXT NOT NULL,
    comuna TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'Venta' o 'Arriendo'
    precio NUMERIC NOT NULL,
    moneda TEXT NOT NULL, -- 'USD' o 'ARS'
    m2Util NUMERIC NOT NULL,
    m2Total NUMERIC NOT NULL,
    habitaciones INTEGER NOT NULL,
    banos INTEGER NOT NULL,
    estacionamientos INTEGER NOT NULL,
    antiguedad INTEGER,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    descripcion TEXT NOT NULL,
    imagenes JSONB NOT NULL DEFAULT '[]'::jsonb,
    tour360Urls JSONB DEFAULT '[]'::jsonb,
    destacada BOOLEAN NOT NULL DEFAULT false,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Leads (Consultas)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    servicio TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Nuevo', -- 'Nuevo', 'Contactado', 'En seguimiento', 'Cerrado'
    notas TEXT,
    creadoEn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Analytics
CREATE TABLE IF NOT EXISTS public.analytics (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'property_view' o 'property_inquiry'
    propertyId TEXT NOT NULL,
    propertyType TEXT NOT NULL, -- 'Venta' o 'Arriendo'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Settings (Configuración Global)
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    instagram TEXT NOT NULL,
    address TEXT NOT NULL
);

-- Insertar la configuración por defecto (si no existe)
INSERT INTO public.settings (id, whatsapp, email, instagram, address)
VALUES (
    'global', 
    '5493513200152', 
    'villalbamartinezprop@gmail.com', 
    'https://www.instagram.com/villalba.martinez.inmobiliaria/', 
    'Córdoba, Argentina'
) ON CONFLICT (id) DO NOTHING;

-- Configurar RLS (Row Level Security) para que cualquier persona 
-- pueda leer propiedades y configuraciones, pero solo el server 
-- (usando el SERVICE_ROLE_KEY) pueda escribir.

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Lectura publica de properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Lectura publica de settings" ON public.settings FOR SELECT USING (true);
-- Nota: La inserción de analíticas y leads se hará desde rutas de API del servidor
-- utilizando el Service Role Key, el cual se salta las reglas de RLS automáticamente.
