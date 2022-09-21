describe('Unit : Controller - WidgetSignUpCtrl', function () {

// load the controller's module
    var WidgetSignUpCtrl, scope, Modals, SocialDataStore, $timeout,$q,Buildfire,rootScope;

    beforeEach(module('BingewaveAngularJs'));

    beforeEach(module('BingewaveAngularJs', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'onUpdate','onRefresh']);
            this.imageLib = jasmine.createSpyObj('imageLib', ['cropImage']);
            this.imageLib.cropImage.and.callFake(function (url,options) {
               return 'abc.png';
            });
            this.auth = jasmine.createSpyObj('auth', ['getCurrentUser', 'login','onLogin','onLogout']);
            this.navigation = jasmine.createSpyObj('navigation', ['get', 'onUpdate']);
            this.messaging = jasmine.createSpyObj('messaging', ['get', 'onUpdate','sendMessageToControl']);
            this.history =  jasmine.createSpyObj('history', ['pop', 'push', 'onPop']);
            this.getContext=function(){};

        });
    }));


   /* beforeEach(inject(function ($controller, _$rootScope_, _Modals_, _SocialDataStore_, _$timeout_,_$q_,Buildfire) {
            scope = _$rootScope_.$new();
            Modals = _Modals_;
            SocialDataStore = _SocialDataStore_;
            $timeout = _$timeout_;
            $q = _$q_;
            WidgetSignUpCtrl = $controller('WidgetSignUpCtrl', {
                $scope: scope,
                Modals: Modals,
                SocialDataStore: SocialDataStore,
                Buildfire :_Buildfire_
            });
        })
    );*/

    beforeEach(inject(function ($controller, _$rootScope_, Location,SocialItems,_Modals_, _SocialDataStore_, _$timeout_,_$q_,_Buildfire_) {
        Buildfire = _Buildfire_;
        SocialDataStore = jasmine.createSpyObj('SocialDataStore', ['deletePost', 'onUpdate','getUserSettings','saveUserSettings']);;
        Location1 = Location;
        SocialItem =SocialItems;
        scope = _$rootScope_.$new();
        rootScope= _$rootScope_;
        Modals = _Modals_;
        $timeout = _$timeout_;
        $q = _$q_;

        WidgetSignUpCtrl = $controller('WidgetSignUpCtrl', {
            $scope: scope,
            Modals: Modals,
            SocialDataStore: SocialDataStore,
            Buildfire :_Buildfire_
        });


    }));

    describe('Units: units should be Defined', function () {
        it('it should pass if WidgetSignUpCtrl is defined', function () {
            expect(WidgetSignUpCtrl).not.toBeUndefined();
        });
        it('it should pass if Modals is defined', function () {
            expect(Modals).not.toBeUndefined();
        });
    });


    describe('WidgetSignUp.getFollowingStatus', function () {

        it('it should pass if getFollowingStatus is called', function () {

            WidgetSignUpCtrl.getFollowingStatus();

        });
    });


    describe('WidgetSignUp.createPost', function () {

        var spy1;
       beforeEach((function () {

           WidgetSignUpCtrl.SocialItems.userDetails.userToken='';
           WidgetSignUpCtrl.SocialItems.parentThreadId='sasas';
           WidgetSignUpCtrl.SocialItems.userDetails.userId='sasas';
           WidgetSignUpCtrl.SocialItems.socialAppId='sasas';
           WidgetSignUpCtrl.waitAPICompletion = true;
           WidgetSignUpCtrl.picFile={};

            Buildfire.auth.getCurrentUser.and.callFake(function (callback) {

             callback(null,null);
                Buildfire.auth.login.and.callFake(function (callback) {


                    callback(null, {});
                });

            });
        }));

        it('it should pass if it calls SocialDataStore.createPost if WidgetSignUp.picFile is truthy', function () {
            WidgetSignUpCtrl.SocialItems.userDetails.userToken='';
            WidgetSignUpCtrl.SocialItems.parentThreadId='sasas';
            WidgetSignUpCtrl.SocialItems.userDetails.userId='sasas';
            WidgetSignUpCtrl.SocialItems.socialAppId='sasas';
            WidgetSignUpCtrl.waitAPICompletion = true;
            WidgetSignUpCtrl.picFile={};
            WidgetSignUpCtrl.createPost();

        });

    });

    describe('WidgetSignUp.likeThread', function () {

        var spy1;
        beforeEach(inject(function () {
            spy1 = spyOn(SocialDataStore,'addThreadLike').and.callFake(function () {

                var deferred = $q.defer();
                deferred.resolve({});
                console.log('abc');
                return deferred.promise;
            });

        }));

        xit('it should pass', function () {
            var a = {likesCount:9};
            WidgetSignUpCtrl.likeThread(a,{});
            expect(a.likesCount).toEqual(10);
            //expect(spy1).not.toHaveBeenCalled();
        });
    });

    describe('WidgetSignUp.seeMore', function () {

        it('it should pass if it sets seeMore to true for the post', function () {
            var a = {seeMore:false};
            WidgetSignUpCtrl.seeMore(a,{});
            expect(a.seeMore).toBeTruthy();
        });
    });

    describe('WidgetSignUp.getPosts', function () {

        it('it should pass if it sets seeMore to true for the post', function () {
            var a = {seeMore:false};
            WidgetSignUpCtrl.seeMore(a,{});
            expect(a.seeMore).toBeTruthy();
        });
    });


    describe('WidgetSignUp.getUserName', function () {


        it('it should pass if it calls SocialDataStore.getUserName is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.getUserName();

        });


    });

    describe('WidgetSignUp.getUserImage', function () {


        it('it should pass if it calls SocialDataStore.getUserImage is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.getUserImage();

        });


    });

    describe('WidgetSignUp.showMoreOptions', function () {


        it('it should pass if it calls SocialDataStore.showMoreOptions is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.showMoreOptions('asasasa');

        });


    });

    describe('WidgetSignUp.likeThread', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.likeThread('asasasa','user');

        });
    });

    describe('WidgetSignUp.goInToThread', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.goInToThread('asasasa');

        });
    });

    describe('WidgetSignUp.isLikedByLoggedInUser', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.isUserLikeActive('asasasa');

        });
    });

    describe('WidgetSignUp.uploadImage', function () {
        it('it should pass if it calls WidgetSignUp.uploadImage is called', function () {
          //  WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.uploadImage({});

        });
    });

    describe('WidgetSignUp.cancelImageSelect ', function () {
        it('it should pass if it calls WidgetSignUp.cancelImageSelect is called', function () {
            //  WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.cancelImageSelect();
            $timeout.flush();
        });
    });

    describe('WidgetSignUp.updateLikesData', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.updateLikesData('asasasa','online');

        });
    });

    describe('WidgetSignUp.getDuration', function () {
        it('it should pass if it calls WidgetSignUp.getDuration is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.getDuration('1212121212');

        });
    });


    describe('WidgetSignUp.deletePost', function () {
        beforeEach(function(){

            var response={
                data:{
                    result:{

                    }
                }
            };

            SocialDataStore.deletePost.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(response);
                return deferred.promise;
            });

            Buildfire.messaging.sendMessageToControl.and.callFake(function () {

            });
        })
        it('it should pass if it calls SocialDataStore.deletePost is called', function () {
            WidgetSignUpCtrl.picFile = 'a';
            WidgetSignUpCtrl.deletePost('asasasa');
            scope.$digest();

        });
    });

    describe('scope.emit COMMENT_ADDED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('COMMENT_ADDED');

        });
    });

    describe('scope.emit COMMENT_LIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('COMMENT_LIKED');

        });
    });

    describe('scope.emit COMMENT_UNLIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('COMMENT_UNLIKED');

        });
    });

    describe('scope.emit POST_LIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('POST_LIKED',{_id:'12313'});

        });
    });

    describe('scope.emit POST_UNLIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('POST_UNLIKED',{_id:'12313'});

        });
    });



});