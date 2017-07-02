// just-router by ixpl0

let routeMap = {};
let rootRoute;
let othersRoute;

const makeQuery = search => {
	let query = {};

	if (search !== undefined) {
		let searchPairs = search.match(/[^&]+/g);

		if (searchPairs !== null) {
			let searchPairsLen = searchPairs.length;

			for (let i = 0; i < searchPairsLen; i++) {
				let searchPairsSplitted = searchPairs[i].match(/[^=]+/g);

				if (searchPairsSplitted !== null) {
					query[searchPairsSplitted[0]] = searchPairsSplitted[1] || '';
				}
			}
		}
	}

	return query;
};

const getCallbackByMethod = (foundCallback, req) => {
	if (typeof foundCallback === 'object') {
		let foundCallbackMethod = foundCallback[req.method.toLowerCase()] || foundCallback['other'] || foundCallback['_'] || foundCallback['all'] || foundCallback['any'];

		return foundCallbackMethod !== undefined ? foundCallbackMethod : null;
	}

	return foundCallback;
};

const onRequest = (req, res) => {
	let [path, search] = req.url.match(/[^?]+/g);

	req.query = makeQuery(search);

	let foundRoute;
	let foundParams = {};


	if (path === '/') {
		foundRoute = getCallbackByMethod(rootRoute, req);
	} else {
		let routes = Object.keys(routeMap);
		let routesLen = routes.length;

		let pathParts = path.match(/[^\/]+/g);
		let pathPartsLen = pathParts.length;

		for (let i = 0; i < routesLen; i++) {
			let route = routes[i];
			let routeParts = route.match(/[^\/]+/g);
			let routeFound = true;
			let params = {};

			if (routeParts === null) continue;

			let j;
			for (j = 0; j < pathPartsLen; j++) {
				let currentPathPart = pathParts[j];
				let currentRoutePart = routeParts[j];

				if (currentRoutePart !== undefined && currentRoutePart[0] === ':') {
					params[currentRoutePart.substr(1)] = currentPathPart;
					continue;
				} else if (pathParts[j] === routeParts[j]) continue;

				routeFound = false;
				break;
			}

			if (routeFound && !routeParts[j]) {
				let maybeFoundRouteMethod = getCallbackByMethod(routeMap[route], req);

				if (maybeFoundRouteMethod) {
					foundRoute = maybeFoundRouteMethod;
					foundParams = params;
					break;
				}
			}
		}
	}

	let toRun = foundRoute || getCallbackByMethod(othersRoute, req);

	if (typeof toRun === 'function') {
		req.params = foundParams;
		toRun(req, res);
		console.log(req.params, req.query);
	}
};

const onNewRoutes = newRoutes => {
	routeMap = newRoutes;
	rootRoute = routeMap['/'];
	othersRoute = routeMap[''];
	delete routeMap['/'];
	delete routeMap[''];

	return onRequest;
};

const justRouter = (req, res) => (res === undefined ? onNewRoutes : onRequest)(req, res);

Object.defineProperty(justRouter, 'routes', {
	get: () => routeMap,
	set: onNewRoutes
});

module.exports = justRouter;