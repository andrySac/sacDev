import React, { useState } from 'react';
import { useMaterial } from '../contexts/MaterialContext';
import { Material } from '../types';
import { List, Edit, Trash2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

export const MaterialList: React.FC = () => {
  const { materials, updateMaterial, deleteMaterial, loading } = useMaterial();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Material>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const startEdit = (material: Material) => {
    setEditingId(material.id);
    setEditForm(material);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;

    try {
      const success = await updateMaterial(editingId, editForm);
      if (success) {
        setMessage({ type: 'success', text: 'Mise à jour réussie' });
        setEditingId(null);
        setEditForm({});
      } else {
        setMessage({ type: 'error', text: 'Échec de la mise à jour' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Échec de la mise à jour' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) return;

    try {
      const success = await deleteMaterial(id);
      if (success) {
        setMessage({ type: 'success', text: 'Suppression réussie' });
      } else {
        setMessage({ type: 'error', text: 'Échec de la suppression' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Échec de la suppression' });
    }
  };

  const getEtatBadge = (etat: string) => {
    const colors = {
      'Bon': 'bg-green-100 text-green-800',
      'Abîmé': 'bg-yellow-100 text-yellow-800',
      'Mauvais': 'bg-red-100 text-red-800'
    };
    return colors[etat as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <List className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Liste des matériels
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              {materials.length} matériel{materials.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-md flex items-center space-x-2 ${
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

        {materials.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucun matériel enregistré pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Matériel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Design
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editingId === material.id ? (
                        <input
                          type="text"
                          value={editForm.numero || ''}
                          onChange={(e) => setEditForm({ ...editForm, numero: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      ) : (
                        material.numero
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {editingId === material.id ? (
                        <input
                          type="text"
                          value={editForm.design || ''}
                          onChange={(e) => setEditForm({ ...editForm, design: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      ) : (
                        material.design
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === material.id ? (
                        <select
                          value={editForm.etat || 'Bon'}
                          onChange={(e) => setEditForm({ ...editForm, etat: e.target.value as 'Mauvais' | 'Bon' | 'Abîmé' })}
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="Bon">Bon</option>
                          <option value="Abîmé">Abîmé</option>
                          <option value="Mauvais">Mauvais</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtatBadge(material.etat)}`}>
                          {material.etat}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === material.id ? (
                        <input
                          type="number"
                          value={editForm.quantite || 0}
                          onChange={(e) => setEditForm({ ...editForm, quantite: parseInt(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                          min="1"
                        />
                      ) : (
                        material.quantite
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(material.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === material.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={saveEdit}
                            disabled={loading}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Sauvegarder"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Annuler"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEdit(material)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(material.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};