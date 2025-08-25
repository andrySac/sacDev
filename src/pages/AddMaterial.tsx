import React, { useState } from 'react';
import { useMaterial } from '../contexts/MaterialContext';
import { Package, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export const AddMaterial: React.FC = () => {
  const [numero, setNumero] = useState('');
  const [design, setDesign] = useState('');
  const [etat, setEtat] = useState<'Mauvais' | 'Bon' | 'Abîmé'>('Bon');
  const [quantite, setQuantite] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { addMaterial, loading } = useMaterial();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const success = await addMaterial({
        numero,
        design,
        etat,
        quantite
      });

      if (success) {
        setMessage({ type: 'success', text: 'Insertion réussie' });
        // Reset form
        setNumero('');
        setDesign('');
        setEtat('Bon');
        setQuantite(1);
      } else {
        setMessage({ type: 'error', text: 'Échec de l\'insertion' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Échec de l\'insertion' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Plus className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Ajout de matériel
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-md flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={`font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
                N° matériel *
              </label>
              <input
                type="text"
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: MAT001"
              />
            </div>

            <div>
              <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-2">
                Quantité *
              </label>
              <input
                type="number"
                id="quantite"
                value={quantite}
                onChange={(e) => setQuantite(parseInt(e.target.value) || 1)}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="design" className="block text-sm font-medium text-gray-700 mb-2">
              Design *
            </label>
            <input
              type="text"
              id="design"
              value={design}
              onChange={(e) => setDesign(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description du matériel"
            />
          </div>

          <div>
            <label htmlFor="etat" className="block text-sm font-medium text-gray-700 mb-2">
              État *
            </label>
            <select
              id="etat"
              value={etat}
              onChange={(e) => setEtat(e.target.value as 'Mauvais' | 'Bon' | 'Abîmé')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Bon">Bon</option>
              <option value="Abîmé">Abîmé</option>
              <option value="Mauvais">Mauvais</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setNumero('');
                setDesign('');
                setEtat('Bon');
                setQuantite(1);
                setMessage(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Package className="h-4 w-4" />
                  <span>Ajouter le matériel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};