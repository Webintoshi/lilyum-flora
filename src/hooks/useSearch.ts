import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { useAdminStore } from '@/store/adminStore';

interface UseSearchResult {
    results: Product[];
    isLoading: boolean;
    search: (term: string) => void;
    clearResults: () => void;
}

export const useSearch = (): UseSearchResult => {
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeProductsCache, setActiveProductsCache] = useState<Product[] | null>(null);

    // We can use adminStore's products if available and filtered, 
    // but to be safe and independent for the public side, let's fetch active products once.
    // Optimization: Fetch all active products once and filter client-side for small/medium catalogs.
    // This provides instant feedback. For larger catalogs, we would use Firestore queries per keystroke.

    const ensureCache = async () => {
        if (activeProductsCache) return activeProductsCache;

        try {
            const q = query(collection(db, 'products'), where('isActive', '==', true));
            const snapshot = await getDocs(q);
            const products: Product[] = [];
            snapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() } as unknown as Product);
            });
            setActiveProductsCache(products);
            return products;
        } catch (error) {
            console.error("Failed to cache products for search", error);
            return [];
        }
    };

    const search = async (term: string) => {
        if (!term || term.length < 3) {
            setResults([]);
            return;
        }

        setIsLoading(true);

        try {
            const products = await ensureCache();
            const lowerTerm = term.toLocaleLowerCase('tr-TR');

            const filtered = products.filter(p =>
                p.name.toLocaleLowerCase('tr-TR').includes(lowerTerm) ||
                p.description?.toLocaleLowerCase('tr-TR').includes(lowerTerm)
            ).slice(0, 5); // Limit to 5 results for the dropdown

            setResults(filtered);
        } catch (error) {
            console.error("Search failed", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
    };

    return { results, isLoading, search, clearResults };
};
