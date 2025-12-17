import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";

const GITHUB_API_URL = import.meta.env.VITE_URL_API;
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/user/repos`,{
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
            params:{
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
            }
        });
        const repositories: RepositoryItem[]= response.data.map((repo: any) => ({

            name: repo.name,
            description:repo.description ? repo.description : null,
            imageUrl: repo.owner ? repo.owner.avatar_url : null,
            owner: repo.owner ? repo.owner.login : null,    
            languaje: repo.language ? repo.language : null,

        }));
        return repositories;

    }    catch (error) {
            console.error("Hubo un error al obtener repositorios", error);
            return [];
        }
    }

export const createRepository = async (repo: RepositoryItem): Promise<void> => {
    try {
        const response = await  axios.post(`${GITHUB_API_URL}/user/repos`,repo, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            }
        });
        console.log("Repositorio ingresado", response.data);
       } catch (error){
            console.error("Error al crear repositorio", error);
        }
    };


    export const getUserInfo = async () : Promise<UserInfo> => {
        try {
            const response = await axios.get(`${GITHUB_API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
                }
            });
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