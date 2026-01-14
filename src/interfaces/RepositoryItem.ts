// Interfaz que representa los datos que usamos en la UI para un repositorio
export interface RepositoryItem {
  // Nombre del repositorio
  name: string;
  // Descripción (puede ser null)
  description: string | null;
  // URL de la imagen/thumbnail (aquí usamos el logo de Ionic por diseño)
  imageurl: string | null;
  // Propietario (login)
  owner: string | null;
  // Lenguaje principal del repositorio
  language: string | null;
  // Nombre completo owner/name (opcional, útil para comparaciones)
  full_name?: string | null;
  // URL pública del repo en GitHub (opcional)
  html_url?: string | null;
}