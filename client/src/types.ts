export interface Repo {
    id: number;
    name: string;
    url: string;
    description: string | null;
    stars: number;
    language: string | null;
    owner: string;
}