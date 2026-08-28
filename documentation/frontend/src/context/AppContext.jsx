import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState({});
  const [pageHistory, setPageHistory] = useState([{ page: 'dashboard', params: {} }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [savedApplications, setSavedApplications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [recentlyViewedDocs, setRecentlyViewedDocs] = useState([]);
  const [completedEligibility, setCompletedEligibility] = useState({});

  useEffect(() => {
    const storageKey = `citizendoc_eligibility_${user?.id || 'guest'}`;
    try {
      setCompletedEligibility(JSON.parse(localStorage.getItem(storageKey) || '{}'));
    } catch (_) {
      setCompletedEligibility({});
    }
  }, [user?.id]);

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/documents');
      const json = await res.json();
      if (json.success) {
        setDocuments(json.data);
      }
    } catch (err) {
      console.error("Fetch documents failed:", err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  // Fetch saved applications
  const fetchSavedApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const res = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setSavedApplications(json.data);
      }
    } catch (err) {
      console.error("Fetch applications failed:", err);
    } finally {
      setLoadingApps(false);
    }
  }, [token]);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setDashboardStats(json.data);
      }
    } catch (err) {
      console.error("Fetch dashboard stats failed:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchSavedApplications();
    fetchDashboardStats();
  }, [fetchSavedApplications, fetchDashboardStats, user]);

  const navigateTo = (page, params = {}, options = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    if (!options.fromHistory) {
      setPageHistory(prev => [...prev.slice(0, historyIndex + 1), { page, params }]);
      setHistoryIndex(prev => prev + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track recently viewed doc if guide or eligibility check
    if (params.docId) {
      const doc = documents.find(d => d.id === parseInt(params.docId) || d.slug === params.docId);
      if (doc) {
        setRecentlyViewedDocs(prev => {
          const filtered = prev.filter(d => d.id !== doc.id);
          return [doc, ...filtered].slice(0, 5);
        });
      }
    }
  };

  const navigateHistory = (direction) => {
    setHistoryIndex(currentIndex => {
      const nextIndex = currentIndex + direction;
      const nextEntry = pageHistory[nextIndex];
      if (!nextEntry) return currentIndex;
      setCurrentPage(nextEntry.page);
      setPageParams(nextEntry.params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return nextIndex;
    });
  };

  const markEligibilityComplete = (documentId) => {
    const updated = { ...completedEligibility, [documentId]: true };
    setCompletedEligibility(updated);
    localStorage.setItem(`citizendoc_eligibility_${user?.id || 'guest'}`, JSON.stringify(updated));
  };

  const hasCompletedEligibility = (documentId) => Boolean(completedEligibility[documentId]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        pageParams,
        navigateTo,
        canGoBack: historyIndex > 0,
        canGoForward: historyIndex < pageHistory.length - 1,
        goBack: () => navigateHistory(-1),
        goForward: () => navigateHistory(1),
        markEligibilityComplete,
        hasCompletedEligibility,
        documents,
        savedApplications,
        dashboardStats,
        loadingDocs,
        loadingApps,
        globalSearchQuery,
        setGlobalSearchQuery,
        recentlyViewedDocs,
        refreshApplications: fetchSavedApplications,
        refreshStats: fetchDashboardStats,
        refreshAll: () => {
          fetchDocuments();
          fetchSavedApplications();
          fetchDashboardStats();
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
