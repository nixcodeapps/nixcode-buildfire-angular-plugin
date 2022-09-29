'use strict';
(function (angular) {

    angular.module('BingewaveAngularJs')
    
    .factory('APIService', APIService);
 
    APIService.$inject = ['$rootScope', 'RequestService', '$location'];
    function APIService($rootScope, RequestService, $location) {
        var service = {};        
        //AccountCtrl services
        service.get_my_profile = get_my_profile;
        service.unmute_all_participants = unmute_all_participants;
        service.mute_all_participants = mute_all_participants;
        service.create_event = create_event;
        service.start_stream = start_stream;
        service.stop_stream = stop_stream;
        service.start_broadcast = start_broadcast;
        service.stop_broadcast = stop_broadcast;
        service.get_chat_messages = get_chat_messages;
        service.send_chat_messages = send_chat_messages;
        service.register = register;
 
        return service;
        function get_my_profile(param, callback, fallback) {
            RequestService.CallAPI3(param, 'accounts/me', function (result) {
                if (result) {
                    callback(result);
                }
            }, fallback, 'GET');
        }
        function unmute_all_participants(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param.event_id + '/setUserAudioUnmute', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }


        function mute_all_participants(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param.event_id + '/setUserAudioMute', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }


        function send_chat_messages(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param.event_id + '/messages', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }


        function get_chat_messages(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param + '/messages', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback, 'GET');
        }


        function stop_broadcast(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param + '/stopBroadcasting', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }

        function start_broadcast(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param + '/startBroadcasting', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }

        function stop_stream(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param + '/stopStream', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }

        function start_stream(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events/' + param + '/startStream', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }

              
        function create_event(param, callback, fallback) {
            RequestService.CallAPI3(param, 'events', function (result) {
                if (result) {
                    // $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }


        //This is the register service
        function register(param, callback, fallback) {
            RequestService.CallAPI(param, 'users/signup', function (result) {
                if (result) {
                    $location.path('/register');
                    callback(result);
                }
            }, fallback);
        }   
    }
 
})(window.angular);