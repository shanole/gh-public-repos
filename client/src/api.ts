import type { OwnerRepoResponse, Repo } from './types';

export const fetchInitialRepos = async (): Promise<Repo[]> => {
    const res = await fetch('/api/repos/initial');
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to fetch initial repositories';
        throw new Error(errorMessage);
    }
    return res.json();
}

export const fetchReposByOwner = async (owner: string, pageNumber: number = 1, pageSize: number = 20): Promise<OwnerRepoResponse> => {
    const queryParams = new URLSearchParams({ pageNumber: pageNumber.toString(), pageSize: pageSize.toString() });

    const res = await fetch(`/api/repos/owner/${encodeURIComponent(owner)}?${queryParams.toString()}`);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to fetch repositories for owner: ${owner}`;
        throw new Error(errorMessage);
    }
    return res.json();
};