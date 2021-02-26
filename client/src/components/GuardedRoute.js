import React from 'react';
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, permission, defaultRoute, ...rest }) => {
    return (
        <Route {...rest} render={(props) => (
            permission === true
                ? <Component {...props} />
                : <Redirect to={defaultRoute} />
        )} />
    )

}

export default GuardedRoute;