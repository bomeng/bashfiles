/* ==================================================

  flnOlMap

  a directive used to create an OpenLayers map

  TODO:
    * sync itself with firebase on '$destroy'

================================================== */

directives.directive('flnOlMap', ['Clientstream', 'newConfigurator', flnOlMap_]);

function flnOlMap_ (Client, Configurator) {
  return {
    restrict: "A",
    controller: "OlMapCtrl as omap",
    link: function flnOlMapLink(scope, ele, attrs) {
      // in the case we have a new user, the directive needs to
      // wait until it configurator is
      // loaded before attaching configurator to map
      // Configurator.map.setTarget(ele[0]);


      Client.listen('Configurator: Loaded', sendElement);

      function sendElement (interactions) {
        // Client.emit('Spinner: spin it', true);
        // Client.emit('OlMap: map target element', ele);
      }


      ele.on('$destroy', function (e) {
        // make sure we sync whatever is going on with firebase
        // what else?
        console.log("check it brah, i'm syncing with firebase!");
      });
    },
  };
}

directives.directive('flnTestMap', ['Clientstream', flnTestMap_]);

function flnTestMap_ (Client) {
  return {
    restrict: "A",
    templateUrl: 'templates/directives/test/flnTest.html',
    controller: function ($scope, $element, $attrs, newConfigurator) {
      newConfigurator.setTarget($element);
      Client.listen('draw_busy', function (arg) {
        $scope.draw_busy = arg;
        $scope.$apply();
      });
      
    },
  };
}
