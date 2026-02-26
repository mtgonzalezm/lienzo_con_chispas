/**
 * 🔄 HISTORY.JS - Undo/Redo
 */

export class HistoryManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  push(state) {
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    this.history.push(JSON.parse(JSON.stringify(state)));
    this.currentIndex++;
    if (this.history.length > 50) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.getCurrent();
    }
    return null;
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.getCurrent();
    }
    return null;
  }

  getCurrent() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

export default HistoryManager;
