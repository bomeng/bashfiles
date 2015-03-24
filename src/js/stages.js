angular.module('stages',[
  'flannel.providers',
  'design_link',
  'share_link',
  'home',
  'configure',
  'proposal',
  'signup',
])
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/my-home/zip-nearme'); // if users arrive somewhere other than the root URL, send them to the root.
  $stateProvider.state('flannel', {
    url: "/",
    abstract: true,
    resolve: {
      // Resolve ensures we authenticate before going to the root controller
      // This only fires once since the root only instantiates once
      init: ['Auth', function(Auth) {
        return Auth.authenticate();
      }]
    },
    views: {
      'header@': {
        templateUrl: 'templates/header.html',
        controller: 'NavCtrl as nav',
      },
      'footer@': {
        templateUrl: 'templates/footer.html',
        controller: 'FooterCtrl as footer',
      },
    }
  })

}]).run(['$rootScope', 'Clientstream', function ui_router_run($rootScope, Client) {
  // this runs after all the dependencies are bootstrapped
  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    // Avoid emitting when transitioning to a new stage, which is an intermediary abstract state and has no step
    if (toState.step) {
      Client.emit('Router: state change success', { stage: toState.stage, step: toState.step });
    }
  });
}]);
