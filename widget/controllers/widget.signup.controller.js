'use strict';

(function (angular) {
    angular.module('BingewaveAngularJs')
        .controller('WidgetSignUpCtrl', ['$sce','$scope','APIService','RequestService', 'SocialDataStore', 'Modals', 'Buildfire', '$rootScope', 'Location', 'EVENTS', 'GROUP_STATUS', 'MORE_MENU_POPUP', 'FILE_UPLOAD', '$modal', 'SocialItems', '$q', '$anchorScroll', '$location', '$timeout', 'Util', 'SubscribedUsersData', function ($sce, $scope,APIService,RequestService, SocialDataStore, Modals, Buildfire, $rootScope, Location, EVENTS, GROUP_STATUS, MORE_MENU_POPUP, FILE_UPLOAD, $modal, SocialItems, $q, $anchorScroll, $location, $timeout, util, SubscribedUsersData) {
            var WidgetSignUp = this;
            let timerDelay = null;
            $scope.show_stream = false;
            $scope.stream_url = '';
           
            // buildfire.services.camera.requestAuthorization(null, (err, result) => {
            //   if (err) return console.error(err);
            
            //   console.log("request authorization:" + result);
            // });
            // buildfire.services.camera.isAuthorized(null, (err, status) => {
            //   if (err) return console.error(err);
            
            //   console.log("is Authorized:" + status);
            // });
            
         
            WidgetSignUp.appTheme = null;

            WidgetSignUp.loadedPlugin = false;
            WidgetSignUp.SocialItems = SocialItems.getInstance();
            WidgetSignUp.util = util;
            $rootScope.showThread = true;
            WidgetSignUp.loading = true;


            $scope.bingewave = function () {
                console.log("clicked");
                Location.go('#/bingewave');
            }
           
               
                $scope.trustSrc = function(src) {
                  return $sce.trustAsResourceUrl(src);
                };
             $scope.createEvent = function(){
              
                 var event = { type: 7, organizer_id: RequestService.getPreferences().organizer_id, template_id : RequestService.getPreferences().template_id }
                  APIService.create_event(event, function (result) {
                     console.log(result)
                     if(result.data.status === 'success'){
                      $scope.show_stream = true;
                      $scope.stream_url = result.data.data.webview_video_chat;
                      console.log( $scope.stream_url)
                   }
                    }, function (response) {
                    $scope.show_stream = false;

                    console.log(response)
                    });
                 
              }   
           
            WidgetSignUp.setAppTheme = function () {
                buildfire.appearance.getAppTheme((err, obj) => {
                    let elements = document.getElementsByTagName('svg');
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.setProperty("fill", obj.colors.icons, "important");
                    }
                    WidgetSignUp.appTheme = obj.colors;
                    WidgetSignUp.loadedPlugin = true;
                });
            }

            

            WidgetSignUp.init = function () {
                WidgetSignUp.SocialItems.getSettings((err, result) => {
                    if (err) return console.error("Fetching settings failed.", err);
                    if (result) {
                        WidgetSignUp.SocialItems.items = [];
                        WidgetSignUp.setAppTheme();
                        WidgetSignUp.SocialItems.authenticateUser(null, (err, user) => {
                            if (err) return console.error("Getting user failed.", err);
                            if (user) {
                            } else {
                                WidgetSignUp.groupFollowingStatus = false;
                            }
                        });
                    }
                });
            };

            WidgetSignUp.init();
            WidgetSignUp.formatLanguages = function (strings) {
                Object.keys(strings).forEach(e => {
                    strings[e].value ? WidgetWall.SocialItems.languages[e] = strings[e].value : WidgetWall.SocialItems.languages[e] = strings[e].defaultValue;
                });
            }
       

            $rootScope.$on('navigatedBack', function (event, error) {
                WidgetSignUp.SocialItems.items = [];
                WidgetSignUp.SocialItems.isPrivateChat = false;
                WidgetSignUp.SocialItems.pageSize = 5;
                WidgetSignUp.SocialItems.page = 0;
                WidgetSignUp.SocialItems.wid = WidgetSignUp.SocialItems.mainWallID;
                WidgetSignUp.SocialItems.pluginTitle = '';
                WidgetSignUp.init();
            });

            // On Login
            Buildfire.auth.onLogin(function (user) {
                console.log("NEW USER LOGGED IN", WidgetSignUp.SocialItems.forcedToLogin)
                if (!WidgetSignUp.SocialItems.forcedToLogin) {
                    WidgetSignUp.SocialItems.authenticateUser(user, (err, userData) => {
                        if (err) return console.error("Getting user failed.", err);
                        if (userData) {
                            WidgetSignUp.checkFollowingStatus();
                        }
                    });
                } else WidgetSignUp.SocialItems.forcedToLogin = false;
                WidgetSignUp.showUserLikes();
                if ($scope.$$phase) $scope.$digest();
            });
            
            // On Logout
            Buildfire.auth.onLogout(function () {
                console.log('User loggedOut from Widget Wall Page');
                buildfire.appearance.titlebar.show();
                WidgetSignUp.SocialItems.userDetails = {};
                WidgetSignUp.groupFollowingStatus = false;
                buildfire.notifications.pushNotification.unsubscribe(
                    {
                        groupName: WidgetSignUp.SocialItems.wid === '' ?
                            WidgetSignUp.SocialItems.context.instanceId : WidgetSignUp.SocialItems.wid
                    }, () => { });
                WidgetSignUp.privateChatSecurity();
                $scope.$digest();
            });

        }])
})(window.angular);
