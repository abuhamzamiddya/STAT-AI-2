class ApiClient {
    constructor() {
        const configured = (window.STAT_AI_API_URL || '').trim().replace(/\/$/, '');
        const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        this.baseUrl = configured || (local ? '' : '');
    }
    async request(path, options = {}) {
        const response = await fetch(this.baseUrl + path, {
            ...options,
            headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
        });
        const data = (response.headers.get('content-type') || '').includes('json') ? await response.json() : await response.text();
        if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`);
        return data?.data ?? data;
    }
    getDashboardOverview(){ return this.request('/api/dashboard/overview'); }
    analyzeCompetencyGap(id){ return this.request(`/api/gaps/analyze/${encodeURIComponent(id)}`, {method:'POST'}); }
    getRecommendedCourses(id){ return this.request(`/api/training/recommend/${encodeURIComponent(id)}`); }
    generateQuiz(payload){ return this.request('/api/quiz/generate', {method:'POST',body:JSON.stringify(payload)}); }
    scoreAdaptiveQuiz(payload){ return this.request('/api/adaptive/score', {method:'POST',body:JSON.stringify(payload)}); }
    getQuizById(id){ return this.request(`/api/quiz/${encodeURIComponent(id)}`); }
}
window.apiClient = new ApiClient();
