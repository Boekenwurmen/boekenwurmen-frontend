import { PUBLIC_API_URL } from '$env/static/public';

const API_BASE = PUBLIC_API_URL;

// Types
export interface Admin {
	id: number;
	email: string;
	name: string;
}

export interface Client {
	id: number;
	name: string;
	code?: string;
	score?: number;
	createdAt: string;
	updatedAt?: string;
}

export interface PageOption {
	toPage: number;
	type: string;
	name: string;
}

export interface Page {
	id: number;
	story: string;
	type: string;
	options: PageOption[];
}

export interface Book {
	id: number;
	title: string;
	description: string;
	author: string;
	coAuthors?: string[];
	coverImageUrl: string;
	createdAt: string;
	category: string;
	pageCount: number;
	goodEndings: number;
	badEndings: number;
	isIntroduction: boolean;
	pages?: Page[];
}

// Token management
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
	accessToken = token;
	if (token) {
		localStorage.setItem('adminAccessToken', token);
	} else {
		localStorage.removeItem('adminAccessToken');
	}
}

export function getAccessToken(): string | null {
	if (!accessToken) {
		accessToken = localStorage.getItem('adminAccessToken');
	}
	return accessToken;
}

export function clearTokens() {
	accessToken = null;
	localStorage.removeItem('adminAccessToken');
}

// API helper with auth
async function apiFetch<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
	const token = getAccessToken();
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	try {
		const res = await fetch(`${API_BASE}${endpoint}`, {
			...options,
			headers,
			credentials: 'include' // For refresh token cookie
		});

		// Handle 401 - try to refresh token
		if (res.status === 401 && token) {
			const refreshRes = await fetch(`${API_BASE}/admin/refresh`, {
				method: 'POST',
				credentials: 'include'
			});

			if (refreshRes.ok) {
				const refreshData = await refreshRes.json();
				setAccessToken(refreshData.accessToken);

				// Retry original request
				headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
				const retryRes = await fetch(`${API_BASE}${endpoint}`, {
					...options,
					headers,
					credentials: 'include'
				});

				const retryData = await retryRes.json().catch(() => ({}));
				return { data: retryData as T, status: retryRes.status };
			} else {
				clearTokens();
				return { error: 'Session expired', status: 401 };
			}
		}

		const data = await res.json().catch(() => ({}));

		if (!res.ok) {
			return { error: data.error || 'Request failed', status: res.status };
		}

		return { data: data as T, status: res.status };
	} catch (e) {
		return { error: 'Network error', status: 0 };
	}
}

// Auth API
export async function adminLogin(email: string, password: string) {
	const res = await apiFetch<{ admin: Admin; accessToken: string }>('/admin/login', {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});

	if (res.data?.accessToken) {
		setAccessToken(res.data.accessToken);
	}

	return res;
}

export async function adminLogout() {
	const res = await apiFetch('/admin/logout', { method: 'POST' });
	clearTokens();
	return res;
}

export async function getAdminMe() {
	return apiFetch<{ admin: Admin }>('/admin/me');
}

// Clients API
export async function getClients() {
	const res = await apiFetch<{ data: Client[] }>('/admin/clients');
	if (res.data?.data) {
		return { data: res.data.data, status: res.status };
	}
	return { error: res.error, status: res.status };
}

export async function updateClient(id: number, data: Partial<Pick<Client, 'name' | 'code' | 'score'>>) {
	return apiFetch<Client>(`/admin/clients/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

export async function deleteClient(id: number) {
	return apiFetch(`/admin/clients/${id}`, { method: 'DELETE' });
}

// Books API
export async function getBooks() {
	const res = await apiFetch<{ data: Book[] }>('/admin/books');
	if (res.data?.data) {
		return { data: res.data.data, status: res.status };
	}
	return { error: res.error, status: res.status };
}

export async function getBook(bookId: number) {
	const res = await apiFetch<{ data: Book }>(`/admin/books/${bookId}`);
	if (res.data?.data) {
		return { data: res.data.data, status: res.status };
	}
	return { error: res.error, status: res.status };
}

export async function createBook(data: {
	title: string;
	author: string;
	description?: string;
	coverUrl?: string;
	category?: string;
	year?: number;
}) {
	return apiFetch<Book>('/admin/books', {
		method: 'POST',
		body: JSON.stringify({
			metadata: {
				title: data.title,
				author: data.author,
				description: data.description || '',
				co_authors: [],
				cover_image_url: data.coverUrl || '',
				category: data.category || 'fiction'
			}
		})
	});
}

export async function updateBook(
	bookId: number,
	data: Partial<{
		title: string;
		author: string;
		description: string;
		coverUrl: string;
		category: string;
		year: number;
	}>
) {
	return apiFetch<Book>(`/admin/books/${bookId}`, {
		method: 'PUT',
		body: JSON.stringify({
			metadata: {
				...(data.title && { title: data.title }),
				...(data.author && { author: data.author }),
				...(data.description !== undefined && { description: data.description }),
				...(data.coverUrl !== undefined && { cover_image_url: data.coverUrl }),
				...(data.category && { category: data.category })
			}
		})
	});
}

export async function deleteBook(bookId: number) {
	return apiFetch(`/admin/books/${bookId}`, { method: 'DELETE' });
}

export async function setIntroductionBook(bookId: number) {
	return apiFetch<Book>('/admin/books/introduction', {
		method: 'PUT',
		body: JSON.stringify({ bookId })
	});
}

// Pages API
export async function addPage(bookId: number, data: { pageNumber: number; content: string }) {
	return apiFetch<Page>(`/admin/books/${bookId}/pages`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function updatePage(bookId: number, pageId: number, data: { pageNumber?: number; content?: string }) {
	return apiFetch<Page>(`/admin/books/${bookId}/pages/${pageId}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

export async function deletePage(bookId: number, pageId: number) {
	return apiFetch(`/admin/books/${bookId}/pages/${pageId}`, { method: 'DELETE' });
}
