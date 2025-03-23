/**
 * Utility function for reliable page redirection
 * @param {string} path - The path to redirect to (e.g., "/login", "/dashboard")
 * @param {number} delay - Optional delay in milliseconds before redirection
 * @param {function} onSuccess - Optional callback on successful redirect attempt
 * @param {function} onError - Optional callback on redirect error
 */
export const redirectTo = (path, delay = 0, onSuccess = null, onError = null) => {
    const performRedirect = () => {
      try {
        console.log(`Redirecting to ${path}...`);
        
        // For Next.js
        if (typeof window !== "undefined" && window.location) {
          // Method 1: Replace (best for most cases)
          window.location.replace(path);
          
          // Method 2: Fallback with regular href if replace doesn't work
          setTimeout(() => {
            window.location.href = path;
          }, 100);
          
          // Method 3: History API (alternative approach)
          setTimeout(() => {
            if (window.history && window.history.pushState) {
              window.history.pushState({}, '', path);
              window.location.reload();
            }
          }, 200);
        }
        
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Redirection error:", error);
        
        if (onError) {
          onError(error);
        } else {
          alert(`Redirect to ${path} failed. Please try navigating manually.`);
        }
      }
    };
    
    if (delay > 0) {
      setTimeout(performRedirect, delay);
    } else {
      performRedirect();
    }
  };
  
  export default redirectTo;