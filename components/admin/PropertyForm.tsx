'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/lib/data/properties';

interface PropertyFormProps {
  initialData?: Property;
  isEdit?: boolean;
}

export function PropertyForm({ initialData, isEdit }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [formData, setFormData] = React.useState({
    nombre: initialData?.nombre ?? '',
    tipo: initialData?.tipo ?? 'Venta',
    precio: initialData?.precio ?? 0,
    moneda: initialData?.moneda ?? 'USD',
    barrio: initialData?.barrio ?? '',
    comuna: initialData?.comuna ?? 'Córdoba',
    m2Util: initialData?.m2Util ?? 0,
    m2Total: initialData?.m2Total ?? 0,
    habitaciones: initialData?.habitaciones ?? 0,
    banos: initialData?.banos ?? 0,
    estacionamientos: initialData?.estacionamientos ?? 0,
    antiguedad: initialData?.antiguedad ?? 0,
    descripcion: initialData?.descripcion ?? '',
    imagenes: initialData?.imagenes.join('\n') ?? '', // textArea por líneas
    tour360Urls: initialData?.tour360Urls?.join('\n') ?? '',
    destacada: initialData?.destacada ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    const numberFields = ['precio', 'm2Util', 'm2Total', 'habitaciones', 'banos', 'estacionamientos', 'antiguedad'];
    const finalValue = numberFields.includes(name) ? Number(value) : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    const form = new FormData();
    for (let i = 0; i < files.length; i++) {
      form.append('file', files[i]);
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al subir imágenes');

      const newUrls = data.urls as string[];
      setFormData(prev => ({
        ...prev,
        imagenes: prev.imagenes ? prev.imagenes + '\n' + newUrls.join('\n') : newUrls.join('\n')
      }));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado al subir imágenes');
    } finally {
      setUploading(false);
      // Limpiar input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const imagenesArray = formData.imagenes.split('\n').map(s => s.trim()).filter(Boolean);
    const tour360Array = (formData.tour360Urls || '').split('\n').map((s: string) => s.trim()).filter(Boolean);

    const payload = {
      ...formData,
      imagenes: imagenesArray,
      tour360Urls: tour360Array,
    };

    try {
      const url = isEdit && initialData ? `/api/admin/properties/${initialData.id}` : '/api/admin/properties';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al guardar la propiedad');
      }

      router.push('/admin/propiedades');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#111] border border-white/10 text-white font-sans text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-white/30 transition-colors";
  const labelClasses = "block font-sans text-xs uppercase tracking-widest text-white/50 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl font-sans text-sm">
          {error}
        </div>
      )}

      {/* Información principal */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="font-serif text-xl text-white">Información General</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClasses}>Título / Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required className={inputClasses} placeholder="Ej: Departamento en Nueva Córdoba" />
          </div>
          
          <div>
            <label className={labelClasses}>Tipo de Operación</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} className={inputClasses}>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler / Alquiler</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className={labelClasses}>Moneda</label>
              <select name="moneda" value={formData.moneda} onChange={handleChange} className={inputClasses}>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClasses}>Precio</label>
              <input type="number" name="precio" value={formData.precio} onChange={handleChange} required className={inputClasses} />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Barrio</label>
            <input name="barrio" value={formData.barrio} onChange={handleChange} required className={inputClasses} />
          </div>

          <div>
            <label className={labelClasses}>Ciudad / Comuna</label>
            <input name="comuna" value={formData.comuna} onChange={handleChange} required className={inputClasses} />
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="font-serif text-xl text-white">Características</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className={labelClasses}>M2 Totales</label>
            <input type="number" name="m2Total" value={formData.m2Total} onChange={handleChange} required className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>M2 Útiles</label>
            <input type="number" name="m2Util" value={formData.m2Util} onChange={handleChange} required className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Habitaciones</label>
            <input type="number" name="habitaciones" value={formData.habitaciones} onChange={handleChange} required className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Baños</label>
            <input type="number" name="banos" value={formData.banos} onChange={handleChange} required className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Cocheras</label>
            <input type="number" name="estacionamientos" value={formData.estacionamientos} onChange={handleChange} required className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Antigüedad (años)</label>
            <input type="number" name="antiguedad" value={formData.antiguedad} onChange={handleChange} required className={inputClasses} />
            <p className="text-xs text-muted-foreground mt-1">0 = A estrenar / En construcción</p>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Descripción detallada</label>
          <textarea 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange} 
            required 
            rows={6}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Multimedia y Opciones */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="font-serif text-xl text-white">Multimedia y Opciones</h2>
        
        <div>
          <label className={labelClasses}>Subir imágenes</label>
          <div className="mb-4">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#C1121F] file:text-white hover:file:bg-red-700 transition-colors"
            />
            {uploading && <p className="text-white/50 text-xs mt-2 font-sans">Subiendo imágenes...</p>}
          </div>

          <label className={labelClasses}>O URLs de Imágenes (una por línea)</label>
          <p className="text-white/30 text-xs font-sans mb-3">Las imágenes subidas aparecerán acá abajo. También podés pegar links separados por un salto de línea.</p>
          <textarea 
            name="imagenes" 
            value={formData.imagenes} 
            onChange={handleChange} 
            rows={5}
            placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Recorrido 360º (Opcional)</label>
          <p className="text-white/30 text-xs font-sans mb-3">Pegá los links a tus imágenes panorámicas 360 equirectangulares separadas por enter. O subilas acá mismo.</p>
          <div className="mb-4">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                setUploading(true);
                const form = new FormData();
                for (let i = 0; i < files.length; i++) form.append('file', files[i]);
                try {
                  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
                  const data = await res.json();
                  if (!res.ok) throw new Error();
                  const newUrls = data.urls as string[];
                  setFormData(prev => ({ ...prev, tour360Urls: prev.tour360Urls ? prev.tour360Urls + '\n' + newUrls.join('\n') : newUrls.join('\n') }));
                } catch {
                  setError('Error subiendo 360');
                } finally {
                  setUploading(false);
                  e.target.value = '';
                }
              }}
              disabled={uploading}
              className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
            />
          </div>
          <textarea 
            name="tour360Urls" 
            value={formData.tour360Urls} 
            onChange={handleChange} 
            rows={2}
            className={inputClasses}
          />
        </div>

        <div className="flex items-center gap-3 bg-[#111] border border-white/10 p-4 rounded-lg">
          <input 
            type="checkbox" 
            id="destacada" 
            name="destacada" 
            checked={formData.destacada} 
            onChange={handleChange}
            className="w-5 h-5 accent-[#C1121F]"
          />
          <div>
            <label htmlFor="destacada" className="font-sans text-sm text-white font-semibold cursor-pointer">Propiedad Destacada</label>
            <p className="font-sans text-xs text-white/50">Aparecerá en el slider de la página principal de la inmobiliaria.</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-3 border border-white/10 rounded-xl text-white hover:bg-white/5 font-sans text-sm font-semibold transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 bg-[#C1121F] rounded-xl text-white font-sans text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Propiedad'}
        </button>
      </div>

    </form>
  );
}
