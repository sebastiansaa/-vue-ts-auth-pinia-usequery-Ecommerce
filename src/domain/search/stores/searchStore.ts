import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore('searchStore', () => {
  const searchTerm = ref<string>('');
  const isSearching = ref<boolean>(false);

  const setSearchTerm = (term: string) => {
    searchTerm.value = term;
  }

  const clearSearchTerm = () => {
    searchTerm.value = '';
  }
  return {
    searchTerm,// término de búsqueda actual
    isSearching, // estado
    setSearchTerm,// actualiza el término de búsqueda
    clearSearchTerm,// restablece el término de búsqueda
  };
});
