export function handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = '/images/placeholder.png'; // Ajusta la ruta según tu estructura
}
