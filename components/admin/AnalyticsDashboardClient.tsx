'use client';

import * as React from 'react';
import type { AnalyticsEvent } from '@/lib/data/analytics';
import type { Property } from '@/lib/data/db';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Eye, MessageCircle, Home, TrendingUp } from 'lucide-react';

export function AnalyticsDashboardClient({
  events,
  properties
}: {
  events: AnalyticsEvent[];
  properties: Property[];
}) {
  const views = events.filter(e => e.type === 'property_view');
  const inquiries = events.filter(e => e.type === 'property_inquiry');

  // Stats
  const totalViews = views.length;
  const totalInquiries = inquiries.length;
  const convRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : '0.0';

  // Alquiler vs Venta (Vistas)
  const viewsAlquiler = views.filter(e => e.propertyType === 'Arriendo').length;
  const viewsVenta = views.filter(e => e.propertyType === 'Venta').length;
  
  const pieData = [
    { name: 'Alquiler', value: viewsAlquiler },
    { name: 'Venta', value: viewsVenta }
  ];
  const COLORS = ['#22c55e', '#3b82f6']; // green and blue

  // Vistas a lo largo del tiempo (agrupado por día)
  const viewsByDayMap = new Map<string, number>();
  views.forEach(e => {
    const day = new Date(e.timestamp).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    viewsByDayMap.set(day, (viewsByDayMap.get(day) || 0) + 1);
  });
  
  const timelineData = Array.from(viewsByDayMap.entries()).map(([date, count]) => ({ date, views: count }));

  // Top Propiedades (Vistas)
  const propertyViewsMap = new Map<string, number>();
  views.forEach(e => {
    propertyViewsMap.set(e.propertyId, (propertyViewsMap.get(e.propertyId) || 0) + 1);
  });
  
  const topProperties = Array.from(propertyViewsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const p = properties.find(prop => prop.id === id);
      return {
        id,
        nombre: p ? p.nombre : `Desconocida (${id})`,
        vistas: count
      };
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="text-blue-400" size={20} />
            <h3 className="font-sans text-sm font-medium text-white/60">Vistas a propiedades</h3>
          </div>
          <p className="font-serif text-3xl text-white">{totalViews}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="text-green-400" size={20} />
            <h3 className="font-sans text-sm font-medium text-white/60">Consultas generadas</h3>
          </div>
          <p className="font-serif text-3xl text-white">{totalInquiries}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-amber-400" size={20} />
            <h3 className="font-sans text-sm font-medium text-white/60">Tasa de Conversión</h3>
          </div>
          <p className="font-serif text-3xl text-white">{convRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-sans text-sm font-medium text-white mb-6 uppercase tracking-widest">
            Tráfico (Últimos días)
          </h3>
          <div className="h-[300px] w-full">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="views" name="Vistas" stroke="#c1121f" strokeWidth={3} dot={{ r: 4, fill: '#c1121f' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-sm font-sans">
                Sin datos suficientes
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <h3 className="font-sans text-sm font-medium text-white mb-6 uppercase tracking-widest">
            Venta vs Alquiler
          </h3>
          <div className="h-[250px] w-full flex-1">
            {totalViews > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-sm font-sans">
                Sin datos suficientes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Properties List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-sans text-sm font-medium text-white mb-6 uppercase tracking-widest">
          Propiedades más populares
        </h3>
        <div className="divide-y divide-white/10">
          {topProperties.length > 0 ? topProperties.map((prop, idx) => (
            <div key={prop.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="font-serif text-2xl text-white/30">#{idx + 1}</span>
                <p className="font-sans text-sm text-white font-medium">{prop.nombre}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full shrink-0">
                <Eye size={14} className="text-white/40" />
                <span className="font-sans text-xs text-white/70">{prop.vistas} vistas</span>
              </div>
            </div>
          )) : (
            <div className="py-8 text-center text-white/30 text-sm font-sans">
              Todavía no hay vistas en las propiedades.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
