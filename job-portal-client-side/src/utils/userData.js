export const getUserSession = async () => {
    const user = localStorage.getItem('userData');
    if (user) {
        return Promise.resolve(JSON.parse(user))
    }
}