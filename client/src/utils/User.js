const isAuthenticated = () => {
    let user = localStorage.getItem("user");
    if(user)
        return true;
    else
        return false;
}

const isAdmin = () => {
    let user = getUser();
    if(user==null || user.role==="User")
        return false;
    else
        return true;
}

const setUser = (user) => {
    localStorage.setItem("user",JSON.stringify(user));
}

const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

const removeUser = () => {
    localStorage.removeItem("user")
}

export { isAuthenticated, isAdmin, setUser, getUser, removeUser }