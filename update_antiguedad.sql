-- =========================================================================
-- SCRIPT DE ACTUALIZACIÓN: Agregar "antiguedad" a "properties"
-- Copia y pega esto en el SQL Editor de Supabase y dale a "Run"
-- =========================================================================

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS antiguedad INTEGER DEFAULT 0;
