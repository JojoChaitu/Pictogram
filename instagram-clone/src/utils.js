export function generateRandomUniqueId(){
    const uniqueId = `${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
    return uniqueId;
}

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}