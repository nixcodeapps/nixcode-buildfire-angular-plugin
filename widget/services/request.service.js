'use strict';
(function (angular) {

	angular.module('BingewaveAngularJs')


		.factory('RequestService', RequestService);
	var APIUrl = 'https://bw.bingewave.com/';

	const Preferences = {
		organizer_id: '92012c17-3ea5-440f-948b-90b8a5cb778d',
		// auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTYzNjI4NjgsImV4cCI6MTc0NjM2Mjg2OCwiaXNzIjoibG9jYWxob3N0IiwicmVmZXJlbmNlX2lkIjoiNWI4ODZkNmQtYzM0ZS00ZTc3LWJhM2ItNTE0ODIzM2M0OThkIiwidHlwZSI6ImRpc3RyaWJ1dG9yIiwiZGlkIjoiOTIwMTJjMTctM2VhNS00NDBmLTk0OGItOTBiOGE1Y2I3NzhkIn0.THF0RGEWdKwf34uStzGS4ivQe8KWPJDnbxkqTA2REYM',
		//token to send message
        auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjE1MTI2MDQsImV4cCI6MTc1MTUxMjYwNCwiaXNzIjoibG9jYWxob3N0Iiwid2lkZ2V0X3Rva2VuIjp0cnVlLCJkaXN0cmlidXRvcl9pZCI6bnVsbCwidHlwZSI6ImFjY291bnQifQ.TJstbI2I_TqP8caVsAVeVYBlgy_b9Bg42FyqL-ZAPII',
        template_id: '396a4882-1ad0-4d5c-ba11-c264c244e1bb'
	}


	RequestService.$inject = ['$http', '$rootScope', '$timeout', '$location'];

	function RequestService($http, $rootScope, $timeout, $location) {
		var service = {};
		service.CallAPI = CallAPI;
		service.CallAPI2 = CallAPI2;
		service.CallAPI3 = CallAPI3;
		service.getAPIUrl = getAPIUrl;
		service.getPreferences = getPreferences;
		return service;

		function CallAPI(data, url, success_callback, failure_callback, method, api_url,
		isFile) {
			var urlParam = method && method == 'GET' && data ? '?' + jQuery.param(data) : '';
			var req = {
				method: method ? method : 'POST',
				url: api_url ? api_url + url + urlParam : APIUrl + 'api/' + url + urlParam,
				headers: {
					'Content-Type': isFile ? undefined : 'application/json'
				},
				data: data
			}
			$http(req).then(function (response) {
				success_callback(response);
			}, function (response) {
				if (response.status) {
					switch (response.status) {
						case 401: //Unauthorized
							$rootScope.logout();
							break;
					}
				}
				if (failure_callback)
					failure_callback(response);
			});

		}

		function CallAPI2(data, url, success_callback, failure_callback, method, api_url,
			isFile) {
			var urlParam = method && method == 'GET' && data ? '?' + jQuery.param(data) : '';
			var req = {
				method: method ? method : 'POST',
				url: api_url ? api_url + url + urlParam : APIUrl + 'api/' + url + urlParam,
				headers: {
					'Content-Type': undefined
				},
				data: data
			}
			console.log(req);
			$http(req).then(function (response) {
				success_callback(response);
			}, function (response) {
				console.log(response);
				if (response.status) {
					switch (response.status) {
						case 401: //Unauthorized
							$rootScope.logout();
							break;
					}
				}
				if (failure_callback)
					failure_callback(response);
			});

		}

		function CallAPI3(data, url, success_callback, failure_callback, method, api_url,
			isFile) {
			var urlParam = method && method == 'GET' && data ? '?' + jQuery.param(data) :
				'';
			var req = {
				method: method ? method : 'POST',
				url: api_url ? api_url + url + urlParam : APIUrl + url + urlParam,
				headers: {
					'Content-Type': isFile ? undefined : 'application/json',
					'Authorization': Preferences.auth_token
				},
				data: data
			}
			$http(req).then(function (response) {
				success_callback(response);
			}, function (response) {
				if (response.status) {
					switch (response.status) {
						case 401: //Unauthorized
							$rootScope.logout();
							break;
					}
				}
				if (failure_callback)
					failure_callback(response);
			});

		}
	};

	function getPreferences() {
		return Preferences;
	};

	function getAPIUrl() {
		return APIUrl;
	};

})(window.angular);
