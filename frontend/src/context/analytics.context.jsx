import React, { createContext, useContext, useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  const setAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      // Handle errors here if needed
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    setAnalytics();
  }, []);

  const contextValue = { analyticsData, setAnalytics };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
