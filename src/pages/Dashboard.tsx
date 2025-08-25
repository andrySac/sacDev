import React from 'react';
import { useMaterial } from '../contexts/MaterialContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart3, Package, TrendingUp, AlertTriangle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { materials } = useMaterial();

  // Calculs pour le bilan
  const totalQuantity = materials.reduce((sum, material) => sum + material.quantite, 0);
  const etatCounts = materials.reduce((acc, material) => {
    acc[material.etat] = (acc[material.etat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Données pour l'histogramme
  const barData = [
    { etat: 'Bon', count: etatCounts['Bon'] || 0, color: '#10B981' },
    { etat: 'Abîmé', count: etatCounts['Abîmé'] || 0, color: '#F59E0B' },
    { etat: 'Mauvais', count: etatCounts['Mauvais'] || 0, color: '#EF4444' }
  ];

  // Données pour le camembert
  const pieData = barData.filter(item => item.count > 0).map(item => ({
    name: item.etat,
    value: item.count,
    color: item.color
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Bilan des matériels
          </h2>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total matériels</p>
              <p className="text-2xl font-semibold text-gray-900">{materials.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quantité totale</p>
              <p className="text-2xl font-semibold text-gray-900">{totalQuantity}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="h-6 w-6 bg-green-600 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bon état</p>
              <p className="text-2xl font-semibold text-gray-900">{etatCounts['Bon'] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">À surveiller</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(etatCounts['Abîmé'] || 0) + (etatCounts['Mauvais'] || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histogramme */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par état (Histogramme)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="etat" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Nombre de matériels']}
                labelFormatter={(label) => `État: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Nombre de matériels"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Camembert */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par état (Camembert)
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Matériels']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Aucune donnée à afficher
            </div>
          )}
        </div>
      </div>

      {/* Détails par état */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Détail par état
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Bon état</p>
                <p className="text-xl font-semibold text-green-900">{etatCounts['Bon'] || 0}</p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Abîmé</p>
                <p className="text-xl font-semibold text-yellow-900">{etatCounts['Abîmé'] || 0}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Mauvais état</p>
                <p className="text-xl font-semibold text-red-900">{etatCounts['Mauvais'] || 0}</p>
              </div>
              <div className="h-8 w-8 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};