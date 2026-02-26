/**
 * 💾 STORAGE.JS - Helper para LocalStorage
 */

import { STORAGE_KEYS } from './constants.js';

export function saveProject(imageData, hotspots) {
  try {
    const project = {
      image: imageData,
      hotspots: hotspots,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(project));
    return true;
  } catch (error) {
    console.error('Error guardando:', error);
    return false;
  }
}

export function loadProject() {
  try {
    const projectJson = localStorage.getItem(STORAGE_KEYS.PROJECT);
    if (!projectJson) return null;
    return JSON.parse(projectJson);
  } catch (error) {
    console.error('Error cargando:', error);
    return null;
  }
}

export function saveHotspots(hotspots) {
  try {
    localStorage.setItem(STORAGE_KEYS.HOTSPOTS, JSON.stringify(hotspots));
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export function loadHotspots() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOTSPOTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export function clearAllStorage() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECT);
    localStorage.removeItem(STORAGE_KEYS.HOTSPOTS);
    localStorage.removeItem(STORAGE_KEYS.IMAGE);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export default {
  saveProject,
  loadProject,
  saveHotspots,
  loadHotspots,
  clearAllStorage,
};
