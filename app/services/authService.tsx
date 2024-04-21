
const authenticateUser = (username: string, password: string) => {
    return process.env.NEXT_PUBLIC_USERNAME == username && process.env.NEXT_PUBLIC_PASSWORD == password;
};

const setUser = (username: string) => {
    localStorage.setItem('user', username);
}

export { setUser };
export { authenticateUser };  