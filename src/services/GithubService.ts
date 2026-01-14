import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
import AuthService from "./AuthService";

const GITHUB_API_URL = import.meta.env.VITE_URL_API;

// Instancia axios configurada con la URL base de la API de GitHub
const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
});

// Interceptor: añade Authorization a cada petición si hay token disponible
githubApi.interceptors.request.use((config) => {
    const authHeader = AuthService.getAuthHeader();
    if (authHeader) {
        config.headers.Authorization = authHeader;
    }
return config;
}, (error) => {
    return Promise.reject(error);
});





// Obtiene los repositorios del usuario autenticado y los mapea a RepositoryItem
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        const response = await githubApi.get(`/user/repos`,{
            params:{
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
            }
        });
        type GitHubRepo = {
            name: string;
            description?: string | null;
            owner?: { login?: string; avatar_url?: string } | null;
            language?: string | null;
            full_name?: string;
            html_url?: string;
        };
        const ghRepos = response.data as GitHubRepo[];
        const repositories: RepositoryItem[]= ghRepos.map((repo) => ({

            name: repo.name,
            description: repo.description ? repo.description : null,
            imageurl: repo.owner?.avatar_url ?? null,
            owner: repo.owner?.login ?? null,
            language: repo.language ?? null,
            full_name: repo.full_name ?? null,
            html_url: repo.html_url ?? null,

        }));

        return repositories;

    }    catch (error) {
            console.error("Hubo un error al obtener repositorios", error);
            return [];
        }
    }

// Elimina un repositorio del usuario (DELETE /repos/{owner}/{repo})
export const deleteRepository = async (owner: string, repoName: string): Promise<void> => {
    try {
        await githubApi.delete(`/repos/${owner}/${repoName}`);
        console.log(`Repositorio ${owner}/${repoName} eliminado`);
    } catch (error) {
        console.error("Error al eliminar repositorio", error);
        throw error;
    }
};

// Actualiza campos del repositorio (PATCH /repos/{owner}/{repo}) y retorna el repo actualizado
export const updateRepository = async (owner: string, repoName: string, update: { name?: string; description?: string | null; homepage?: string | null; }): Promise<RepositoryItem> => {
    try {
        const response = await githubApi.patch(`/repos/${owner}/${repoName}`, update);
        const repo = response.data;
        const mapped: RepositoryItem = {
            name: repo.name,
            description: repo.description ? repo.description : null,
            imageurl: repo.owner ? repo.owner.avatar_url : null,
            owner: repo.owner ? repo.owner.login : null,
            language: repo.language ? repo.language : null,
            full_name: repo.full_name,
            html_url: repo.html_url,
        };
        return mapped;
    } catch (error) {
        console.error("Error al actualizar repositorio", error);
        throw error;
    }
};

// Crea un nuevo repositorio en la cuenta del usuario (POST /user/repos)
export const createRepository = async (repo: RepositoryItem): Promise<void> => {
    try {
        const response = await githubApi.post(`/user/repos`,repo);
        console.log("Repositorio ingresado", response.data);
       } catch (error){
            console.error("Error al crear repositorio", error);
        }
    };


    // Obtiene información del usuario autenticado (GET /user)
export const getUserInfo = async () : Promise<UserInfo> => {
        try {
            const response = await githubApi.get(`/user`);
            return response.data as UserInfo;
                
        } catch (error) {   
            console.error("Error al obtener información del usuario", error);
            const userNotFound : UserInfo = {
                login: 'undefined',
                name: 'Usuario no encontrado',
                bio: 'No se pudo obtener la información del usuario.',
                avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_eN9ltaN4YL-7g4jrTdTXHsBUf_bWxQ_cSg&s',
        }
            return userNotFound;
    }
};