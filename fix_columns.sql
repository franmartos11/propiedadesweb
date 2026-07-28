-- Corrección de nombres de columnas a camelCase (Sensible a mayúsculas y minúsculas)
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Tabla Properties
ALTER TABLE public.properties RENAME COLUMN m2util TO "m2Util";
ALTER TABLE public.properties RENAME COLUMN m2total TO "m2Total";
ALTER TABLE public.properties RENAME COLUMN tour360urls TO "tour360Urls";
ALTER TABLE public.properties RENAME COLUMN updatedat TO "updatedAt";

-- 2. Tabla Leads
ALTER TABLE public.leads RENAME COLUMN creadoen TO "creadoEn";

-- 3. Tabla Analytics
ALTER TABLE public.analytics RENAME COLUMN propertyid TO "propertyId";
ALTER TABLE public.analytics RENAME COLUMN propertytype TO "propertyType";
