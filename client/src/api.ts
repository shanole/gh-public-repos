import type { Repo } from './types';

export const fetchInitialRepos = async (): Promise<Repo[]> => {
    const res = await fetch('/api/repos/initial');
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to fetch initial repositories';
        throw new Error(errorMessage);
    }
    return res.json();
}