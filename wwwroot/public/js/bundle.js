webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var router_tsx_1 = __webpack_require__(1);
	router_tsx_1.renderApplication("application-container");


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(2);
	var react_dom_1 = __webpack_require__(35);
	var react_redux_1 = __webpack_require__(173);
	var react_router_1 = __webpack_require__(197);
	var redux_1 = __webpack_require__(180);
	var redux_thunk_1 = __webpack_require__(258);
	var routes_1 = __webpack_require__(259);
	var reducers_1 = __webpack_require__(263);
	function renderApplication(containerId) {
	    react_dom_1.render((React.createElement(react_redux_1.Provider, {store: redux_1.createStore(reducers_1.default, redux_1.applyMiddleware(redux_thunk_1.default))}, React.createElement(react_router_1.Router, {history: react_router_1.browserHistory}, routes_1.default))), document.getElementById(containerId));
	}
	exports.renderApplication = renderApplication;


/***/ },

/***/ 259:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(2);
	var react_router_1 = __webpack_require__(197);
	var home_1 = __webpack_require__(260);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = (React.createElement(react_router_1.Route, {path: "/", component: home_1.AuthorHome}));


/***/ },

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(2);
	var rich_editor_1 = __webpack_require__(261);
	var AuthorHome = (function (_super) {
	    __extends(AuthorHome, _super);
	    function AuthorHome(props) {
	        _super.call(this, props);
	        this.state = {};
	    }
	    AuthorHome.prototype.render = function () {
	        return (React.createElement("div", null, React.createElement(rich_editor_1.RichEditor, null)));
	    };
	    return AuthorHome;
	}(React.Component));
	exports.AuthorHome = AuthorHome;


/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(2);
	var index_css_1 = __webpack_require__(262);
	var RichEditor = (function (_super) {
	    __extends(RichEditor, _super);
	    function RichEditor(props) {
	        _super.call(this, props);
	        this.state = {};
	    }
	    RichEditor.prototype.render = function () {
	        return (React.createElement("div", {className: index_css_1.editor}, "Hi, there"));
	    };
	    return RichEditor;
	}(React.Component));
	exports.RichEditor = RichEditor;


/***/ },

/***/ 262:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"editor":"index-editor-K84","toolbar":"index-toolbar-Sqn","bold":"index-bold-2Ey","italic":"index-italic-1hW","unordered-list":"index-unordered-list-2cx","unorderedList":"index-unordered-list-2cx","ordered-list":"index-ordered-list-YZt","orderedList":"index-ordered-list-YZt","quote":"index-quote-Hxk","photo":"index-photo-1vz","menu":"index-menu-3WM","paragraph":"index-paragraph-1qe","side":"index-side-1xv","image":"index-image-2Tu","toolbar-icons":"index-toolbar-icons-1jA","toolbarIcons":"index-toolbar-icons-1jA","toolbar-icon":"index-toolbar-icon-1eH","toolbarIcon":"index-toolbar-icon-1eH","active":"index-active-oOK","side-toolbar":"index-side-toolbar-vCt","sideToolbar":"index-side-toolbar-vCt","a-menu":"index-a-menu-3zT","aMenu":"index-a-menu-3zT"};

/***/ },

/***/ 263:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var redux_1 = __webpack_require__(180);
	var reducers_1 = __webpack_require__(264);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = redux_1.combineReducers({
	    author: reducers_1.default,
	});


/***/ },

/***/ 264:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var redux_1 = __webpack_require__(180);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = redux_1.combineReducers({});


/***/ }

});
//# sourceMappingURL=bundle.js.map