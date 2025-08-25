import React, { createContext, useContext, useEffect, useState } from 'react';
import { Material } from '../types';

interface MaterialContextType {
  materials: Material[];
  addMaterial: (material: Omit<Material, 'id' | 'dateCreation'>) => Promise<boolean>;
  updateMaterial: (id: string, material: Partial<Material>) => Promise<boolean>;
  deleteMaterial: (id: string) => Promise<boolean>;
  loading: boolean;
}

const MaterialContext = createContext<MaterialContextType | undefined>(undefined);

export const useMaterial = () => {
  const context = useContext(MaterialContext);
  if (context === undefined) {
    throw new Error('useMaterial must be used within a MaterialProvider');
  }
  return context;
};

export const MaterialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger des données de test au démarrage
    const mockMaterials: Material[] = [
      {
        id: '1',
        numero: 'MAT001',
        design: 'Ordinateur portable Dell',
        etat: 'Bon',
        quantite: 15,
        dateCreation: '2024-01-15'
      },
      {
        id: '2',
        numero: 'MAT002',
        design: 'Souris optique',
        etat: 'Mauvais',
        quantite: 8,
        dateCreation: '2024-01-10'
      },
      {
        id: '3',
        numero: 'MAT003',
        design: 'Clavier mécanique',
        etat: 'Abîmé',
        quantite: 12,
        dateCreation: '2024-01-12'
      }
    ];
    setMaterials(mockMaterials);
  }, []);

  const addMaterial = async (material: Omit<Material, 'id' | 'dateCreation'>): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulation de l'appel API PHP
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMaterial: Material = {
        ...material,
        id: Date.now().toString(),
        dateCreation: new Date().toISOString().split('T')[0]
      };
      
      setMaterials(prev => [...prev, newMaterial]);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMaterial = async (id: string, updatedMaterial: Partial<Material>): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulation de l'appel API PHP
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMaterials(prev =>
        prev.map(material =>
          material.id === id ? { ...material, ...updatedMaterial } : material
        )
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulation de l'appel API PHP
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMaterials(prev => prev.filter(material => material.id !== id));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: MaterialContextType = {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    loading
  };

  return <MaterialContext.Provider value={value}>{children}</MaterialContext.Provider>;
};