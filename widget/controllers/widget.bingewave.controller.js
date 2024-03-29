'use strict';

(function (angular) {
	angular.module('BingewaveAngularJs')
		.controller('BingewaveCtrl', ['$sce', '$scope', 'APIService', 'RequestService',
			'SocialDataStore', 'Modals', 'Buildfire', '$rootScope', 'Location', 'EVENTS',
			'GROUP_STATUS', 'MORE_MENU_POPUP', 'FILE_UPLOAD', '$modal', 'SocialItems', '$q',
			'$anchorScroll', '$location', '$timeout', 'Util', 'SubscribedUsersData',
			function ($sce, $scope, APIService, RequestService, SocialDataStore,
				Modals, Buildfire, $rootScope, Location, EVENTS, GROUP_STATUS,
				MORE_MENU_POPUP, FILE_UPLOAD, $modal, SocialItems, $q, $anchorScroll,
				$location, $timeout, util, SubscribedUsersData) {
				var WidgetBingewave = this;
				$scope.show_stream = false;
				$scope.stream_url = null;
				$scope.event_id = null;
				$scope.stream_started = false;
				$scope.broadcast_started = false;
				$scope.show_chats = false;
				$scope.messages = [];
				WidgetBingewave.SocialItems = SocialItems.getInstance();
				$scope.showHomeText = false;
				$scope.loaded = false;
				$scope.mute = true;
				$scope.unmute = false;
				$scope.showNewEventTitle = false;
				$scope.newEventTitle = "";
				$scope.event = {};
				$scope.events = [];
				WidgetBingewave.appTheme = null;
				WidgetBingewave.loadedPlugin = false;
				WidgetBingewave.SocialItems = SocialItems.getInstance();
				WidgetBingewave.util = util;
				$rootScope.showWidgetBingewave = true;
				$scope.loading = true;
				$scope.home_text = "B home";
				$scope.languages = {};
				$scope.profile = {};
				$scope.pinnedPost = "";
				$scope.offset = 0;
				$scope.pageSize = 10;
				// buildfire.services.camera.requestAuthorization(null, (err, result) => {
				//   if (err) return console.error(err);

				//   console.log("request authorization:" + result);
				// });
				// buildfire.services.camera.isAuthorized(null, (err, status) => {
				//   if (err) return console.error(err);

				//   console.log("is Authorized:" + status);
				// });


				// $( '#copy_clipboard' ).click(function(e) {
				// 	console.log("kjkjh")
				// });
				// BWEvents.publish('copy-to-clipboard-event', data).then(response => {
				// 		console.log(response);
				// });
				APIService.get_my_profile(null, function (result) {
					$scope.profile = result.data.data;
				}, function (response) {
					console.log(response)
				});
				let queryParam = {
					organizer_id: RequestService.getPreferences().organizer_id,
					results_per_page: $scope.pageSize,
					order_keywords: "DESC",
					order_by: "date",
					offset: $scope.offset
				}
				
				APIService.get_all_events(queryParam, function (result) {
					 $scope.events = result.data.data;
					 $scope.loading = false;
				}, function (response) {
					console.log(response)
				});
				$scope.showMore = function(){
					$scope.loading = true;
					$scope.offset = $scope.offset + 5;
					let queryParam = {
						organizer_id: RequestService.getPreferences().organizer_id,
						results_per_page: $scope.pageSize,
						order_keywords: "DESC",
						order_by: "date",
						offset: $scope.offset
					}
					APIService.get_all_events(queryParam, function (result) {
						console.log(result.data.data)
						$scope.events = result.data.data;
						$scope.loading = false;
				   }, function (response) {
					   console.log(response)
				   });
				}
				WidgetBingewave.getDuration = function (timestamp) {
					return moment(timestamp.toString()).fromNow();
				};
				// buildfire.datastore.get('Social', function (err, result) {
				// 	if (err) {
				// 		console.error('App settings -- ', err);
				// 	} else {
				// 		if (result && result.data) {
				// 			WidgetBingewave.SocialItems.appSettings = result.data.appSettings;
				// 			console.log(WidgetBingewave.SocialItems);
				// 			if (WidgetBingewave.SocialItems && WidgetBingewave.SocialItems.appSettings && WidgetBingewave.SocialItems.appSettings.disableHomeText) {
				// 				WidgetBingewave.showHomeText = false;
				// 			} else {
				// 				WidgetBingewave.showHomeText = true;
				// 			}
				// 			console.log(WidgetBingewave.showHomeText)
				// 		}	
				// 	}
				// });
				$scope.copyText = function () {
					const options = { text: 'Meeting Link Copied' };
					buildfire.components.toast.showToastMessage(options, () => { });
				}
				$scope.signup = function () {
					Location.go('#/signup');
				}
				$scope.trustSrc = function (src) {
					return $sce.trustAsResourceUrl(src);
				};
				$scope.createEventTitle = function(){
					$scope.showNewEventTitle = true;
				}
				$scope.createEvent = function () {
					// console.log(RequestService.getPreferences());
					var event = {
						type: 7,
						organizer_id: RequestService.getPreferences().organizer_id,
						template_id: RequestService.getPreferences().template_id,
						event_title: $scope.event.event_title,
						event_description: $scope.event.event_description,
					}
					console.log(event)
					APIService.create_event(event, function (result) {
						console.log(result)
						if (result.data.status === 'success') {
							$scope.showNewEventTitle = false;
							$scope.show_stream = true;
							$scope.stream_url = result.data.data
								.webview_video_chat;
							$scope.event_id = result.data.data.id;
							// console.log($scope.event_id, $scope.stream_url);
							// $scope.sendChat();
							$scope.getChats();

						}
					}, function (response) {
						$scope.show_stream = false;
						console.log(response)
					});

				}
				$scope.goToEvent = function(event){
					$scope.showNewEventTitle = false;
					$scope.show_stream = true;
					$scope.stream_url = event.webview_video_chat;
					$scope.event_id = event.id;
				}
				$scope.muteAll = function () {
					var event = {
						event_id: $scope.event_id,
						role: "participant"
					}
					APIService.mute_all_participants(event, function (result) {
						// console.log(result)
					}, function (response) {
						$scope.show_stream = false;
						console.log(response)
					});

				}
				$scope.unMuteAll = function () {
					var event = {
						event_id: $scope.event_id,
						role: "participant"
					}
					APIService.unmute_all_participants(event, function (result) {
						// console.log(result)
					}, function (response) {
						$scope.show_stream = false;
						console.log(response)
					});

				}
				$scope.getChats = function () {
					APIService.get_chat_messages($scope.event_id, function (
						result) {
						// console.log(result)
						if (result.data.status === 'success') {
							$scope.messages = result.data.data;
							// console.log($scope.messages);
							$scope.show_chats = true;
						}
					}, function (response) {
						// $scope.show_stream = false;

						console.log(response)
					});
				}
				$scope.sendChat = function () {
					var message = {
						message: $scope.user.message,
						event_id: $scope.event_id
					}
					console.log(message)
					APIService.send_chat_messages(message, function (
					result) {
						console.log(result)
						$scope.getChats();
						// if (result.data.status === 'success') {
						//   $scope.messages = result.data.data;
						//   console.log($scope.messages)
						// }
					}, function (response) {
						// $scope.show_stream = false;

						console.log(response)
					});
				}
				$scope.startBroadcast = function () {
					APIService.start_broadcast($scope.event_id, function (
						result) {
						console.log(result)
						if (result.data.status === 'success') {
							$scope.broadcast_started = true;
						}
					}, function (response) {
						// $scope.show_stream = false;

						console.log(response)
					});
				}
				$scope.stopBroadcast = function () {
					APIService.stop_broadcast($scope.event_id, function (
						result) {
						console.log(result)
						if (result.data.status === 'success') {
							$scope.broadcast_started = false;
						}
					}, function (response) {
						// $scope.show_stream = false;

						console.log(response)
					});
				}
				$scope.startStream = function () {
					APIService.start_stream($scope.event_id, function (
						result) {
						console.log(result)
						if (result.data.status === 'success') {
							$scope.stream_started = true;
						}
					}, function (response) {
						// $scope.show_stream = false;

						console.log(response)
					});
				}
				$scope.stopStream = function () {
					APIService.stop_stream($scope.event_id, function (
					result) {
						console.log(result)
						if (result.data.status === 'success') {
							$scope.stream_started = false;
						}
					}, function (response) {
						// $scope.show_stream = false;

						console.log(response)
					});
				}
				$scope.getAllEvents = function () {
					APIService.get_all_events(null, function (
						result) {
						 console.log(result)
						// if (result.data.status === 'success') {
						// 	$scope.messages = result.data.data;
						// 	// console.log($scope.messages);
						// 	$scope.show_chats = true;
						// }
					}, function (response) {
						// $scope.show_stream = false;

						console.log(response)
					});
				}
				WidgetBingewave.setAppTheme = function () {
					buildfire.appearance.getAppTheme((err, obj) => {
						let elements = document.getElementsByTagName('svg');
						for (var i = 0; i < elements.length; i++) {
							elements[i].style.setProperty("fill", obj.colors
								.icons, "important");
						}
						WidgetBingewave.appTheme = obj.colors;
						WidgetBingewave.loadedPlugin = true;
					});
				}
				Buildfire.datastore.onUpdate(function (response) {
					if (response.tag === "Social") {
						WidgetBingewave.setSettings(response);
						setTimeout(function () {
							if (!response.data.appSettings.disableHomeText) {
								// let wallSVG = document.getElementById("WidgetBingewaveSvg")
								// if (wallSVG) {
								// 	wallSVG.style.setProperty("fill", WidgetBingewave.appTheme.icons, "important");
								// }
							}
						}, 100);
					}
					else if (response.tag === "languages")
						WidgetBingewave.SocialItems.formatLanguages(response);
						$scope.languages = WidgetBingewave.SocialItems.languages;
						console.log($scope.languages, WidgetBingewave.SocialItems.languages)

					   $scope.$digest();
				});
				WidgetBingewave.setSettings = function (settings) {
					// console.log("Set setting")
					WidgetBingewave.SocialItems.appSettings = settings.data && settings.data.appSettings ? settings.data.appSettings : {};
					WidgetBingewave.homeTextPermission();
					console.log(WidgetBingewave);
					if (WidgetBingewave.SocialItems.appSettings && typeof WidgetBingewave.SocialItems.appSettings.pinnedPost !== 'undefined') {
						WidgetBingewave.pinnedPost = WidgetBingewave.SocialItems.appSettings.pinnedPost;
						pinnedPost.innerHTML = WidgetBingewave.pinnedPost;
						$scope.pinnedPost = pinnedPost.innerHTML;
					}
				}
				WidgetBingewave.homeTextPermission = function () {
					buildfire.datastore.get('Social', function (err, result) {
						if (err) {
							console.error('App settings -- ', err);
						} else {
							if (result && result.data) {
								WidgetBingewave.SocialItems.appSettings = result.data.appSettings;
								// console.log(WidgetBingewave.SocialItems);
								if (WidgetBingewave.SocialItems && WidgetBingewave.SocialItems.appSettings && WidgetBingewave.SocialItems.appSettings.disableHomeText) {
									$scope.showHomeText = false;
								} else {
									$scope.showHomeText = true;
								}
							}	
						}
						$scope.loaded = true;
                        $scope.$digest();

					});
					
				}

				WidgetBingewave.init = function () {
					WidgetBingewave.SocialItems.getSettings((err, result) => {
						if (err) return console.error(
							"Fetching settings failed.", err);
						if (result) {
							WidgetBingewave.SocialItems.items = [];
							WidgetBingewave.setSettings(result);
							WidgetBingewave.setAppTheme();
					        WidgetBingewave.homeTextPermission();
							$scope.languages = WidgetBingewave.SocialItems.languages;
							WidgetBingewave.SocialItems.authenticateUser(null, (
								err, user) => {
								if (err) return console.error(
									"Getting user failed.", err);
								if (user) {} else {
									WidgetBingewave
										.groupFollowingStatus = false;
								}
							});
						}
					});
				};

				WidgetBingewave.init();
				WidgetBingewave.formatLanguages = function (strings) {
					Object.keys(strings).forEach(e => {
						strings[e].value ? WidgetBingewave.SocialItems.languages[e] =
							strings[e].value : WidgetBingewave.SocialItems.languages[
								e] = strings[e].defaultValue;
					});
				}
				$scope.showMoreOptions = function (event) {
					WidgetBingewave.modalPopupWidgetBingewaveId = event.id;
					WidgetBingewave.SocialItems.authenticateUser(null, (err, user) => {
						if (err) return console.error("Getting user failed.", err);
						if (user) {
							Modals.showMoreOptionsModal({
								'postId': event.id,
								// 'userId': WidgetBingewave.post.userId,
								'socialItemUserId': WidgetBingewave.SocialItems.userDetails.userId,
								'languages': $scope.languages
							}).then(function (data) {
								if(data === WidgetBingewave.SocialItems.languages.reportEvent) {
									SocialDataStore.reportEvent({
										reportedAt: new Date(),
										reporter: WidgetBingewave.SocialItems.userDetails.email,
										reported: event.title,
										// reportedUserID: WidgetBingewave.post.userId,
										// text: WidgetBingewave.post.text,
										// postId: WidgetBingewave.post.id,
										wid: WidgetBingewave.SocialItems.wid
									});
								}
							},
								function (err) {
									console.log('Error in Error handler--------------------------', err);
								});
						}
					});
				};

				$rootScope.$on('navigatedBack', function (event, error) {
					WidgetBingewave.SocialItems.items = [];
					WidgetBingewave.SocialItems.isPrivateChat = false;
					WidgetBingewave.SocialItems.pageSize = 5;
					WidgetBingewave.SocialItems.page = 0;
					WidgetBingewave.SocialItems.wid = WidgetBingewave.SocialItems
						.mainWallID;
					WidgetBingewave.SocialItems.pluginTitle = '';
					WidgetBingewave.init();
				});

				// On Login
				Buildfire.auth.onLogin(function (user) {
					console.log("NEW USER LOGGED IN", WidgetBingewave.SocialItems
						.forcedToLogin)
					if (!WidgetBingewave.SocialItems.forcedToLogin) {
						WidgetBingewave.SocialItems.authenticateUser(user, (err,
							userData) => {
							if (err) return console.error(
								"Getting user failed.", err);
							if (userData) {
								WidgetBingewave.checkFollowingStatus();
							}
						});
					} else WidgetBingewave.SocialItems.forcedToLogin = false;
					WidgetBingewave.showUserLikes();
					if ($scope.$$phase) $scope.$digest();
				});

				// On Logout
				Buildfire.auth.onLogout(function () {
					console.log('User loggedOut from Widget Wall Page');
					buildfire.appearance.titlebar.show();
					WidgetBingewave.SocialItems.userDetails = {};
					WidgetBingewave.groupFollowingStatus = false;
					buildfire.notifications.pushNotification.unsubscribe({
						groupName: WidgetBingewave.SocialItems.wid === '' ?
							WidgetBingewave.SocialItems.context.instanceId :
							WidgetBingewave.SocialItems.wid
					}, () => {});
					WidgetBingewave.privateChatSecurity();
					$scope.$digest();
				});

			}
		])
})(window.angular);
