angular.module('stages.design_link',[]).config( function ($stateProvider) {

  // specifics for for this state
  var stageName = 'design_link';
  // state definition
  $stateProvider.state("design_link", {
    url: "/design_link/:saved_design_id",
    views: {
      'main@': {
        template: '<h1>landing at design page</h1><a ui-sref="home">home</a>',
        controller: function design_link_ctrl ($scope, $stateParams, $state, firebaseRef, SyncService) {
          // look up the design id:
          $scope.designRef = firebaseRef('/designs/'+ $stateParams.saved_design_id)
            .once('value', function (dataSnapshot) {
              // make it avail in scope
            SyncService.set('design_ref', dataSnapshot);
            console.log('your shared design id is: ', dataSnapshot.key());
            // $state.go('home');
          });

        },
      },
    },
  })
;});