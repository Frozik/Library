import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import authorRoutes from "./author/routes";
import reducer from "./reducers";

export function renderApplication(containerId: string) {
    render(
        (
            <Provider store={createStore(reducer, applyMiddleware(thunk))}>
                <Router history={browserHistory}>
                    {authorRoutes}
                </Router>
            </Provider>
        ),
        document.getElementById(containerId)
    );
}
