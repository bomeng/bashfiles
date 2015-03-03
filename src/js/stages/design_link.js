angular.module('design_link',[]).config(["$stateProvider", function ($stateProvider) {
  var stageName,
      templateUrl,
      session_ref_key;

  // specifics for for this state
  stageName = 'design_link';
  // state definition
  templateUrl = "templates/";
  // var stageUrl = templateUrl + "/stages/" + stageName + '/';

  $stateProvider.state("design_link", {
    url: "/oda/:session_ref_key",
    views: {
      'header@': {
        templateUrl: templateUrl + 'header.html',
        controller:  'NavCtrl as nav',
      },
      'main@': {
        templateUrl: templateUrl +'design_link.html',
        controller: function design_link_ctrl ($stateParams, $state, Clientstream, User) {
          var user_id,
              session_key;
          session_ref_key = $stateParams.session_ref_key;
          Clientstream.emit('ODA: Request session',session_ref_key);
        },
      },
    },
  })
;}]);
