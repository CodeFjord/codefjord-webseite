import apiClient from './client';

export const testApiConnection = async () => {
  try {
    console.log('🧪 Teste API-Verbindung...');
    
    // Test 1: Health Check (ohne /api prefix)
    try {
      const healthResponse = await fetch('https://api.code-fjord.de/api/health');
      console.log('✅ Health Check:', healthResponse.status);
    } catch (error: any) {
      console.log('❌ Health Check Fehler:', error.message);
    }
    
    // Test 2: Portfolio-Endpoint
    try {
      const portfolioResponse = await apiClient.get('/portfolio');
      console.log('✅ Portfolio API funktioniert:', portfolioResponse.data);
    } catch (error: any) {
      console.log('❌ Portfolio API Fehler:', error.response?.status);
    }
    
    // Test 3: Blog-Endpoint
    try {
      const blogResponse = await apiClient.get('/blog');
      console.log('✅ Blog API funktioniert:', blogResponse.data);
    } catch (error: any) {
      console.log('❌ Blog API Fehler:', error.response?.status);
    }
    
    // Test 4: Pages-Endpoint
    try {
      const pagesResponse = await apiClient.get('/pages');
      console.log('✅ Pages API funktioniert:', pagesResponse.data);
    } catch (error: any) {
      console.log('❌ Pages API Fehler:', error.response?.status);
    }
    
    return true;
  } catch (error: any) {
    console.log('❌ API-Verbindung fehlgeschlagen:', error.message);
    return false;
  }
}; 