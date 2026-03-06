(async () => {
    try {
        const token = "eyJuYW1lIjoidGVzdCJ9"; // basic invalid token
        const res = await fetch('http://127.0.0.1:3000/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${text}`);
    } catch (e) {
        console.error(e.message);
    }
})();
