/* ==================================================

  AppCtrl
  the core app controller

  to be used only for functions to which the entire
  app needs access, especially for <title>, <meta>,
  and other <head> elements

================================================== */

controllers.controller("AppCtrl", ['$sce', 'GMAP_CLIENT', 'MINIFIED', 'APP_TITLE', 'Clientstream', '$location', AppCtrl_]);

function AppCtrl_($sce, GMAP_CLIENT, MINIFIED, APP_TITLE, Client, $location) {
  var vm = this;
  vm.gmapClient = GMAP_CLIENT;
  // console.log("vm.gmapClient is", vm.gmapClient);
  // vm.gmapClient = $sce.trustAs("resource_url", "http://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=false&client="+GMAP_CLIENT);
  vm.minified = MINIFIED;
  vm.appTitle = APP_TITLE;

  console.log('****** loading google analytics trackers ******');
  Client.listen('Stages: step complete', notifyTrackerAboutStep);

  function notifyTrackerAboutStep (step) {
    // TODO: convert these ifs into a switch
    if (step === "congrats") {
      //ga('send', 'event', step, 'Button Clicks', 'Final submit');
      dataLayer.push({'event': 'final_submit'});
    }
    if (step === "zoom") {
      //ga('send', 'event', step, 'Design Tool', 'Design tool engaged');
      dataLayer.push({'event': 'design_tool_engaged'});
    }
    if (step === "detail") {
      //ga('send', 'event', step, 'Design Tool', 'Roof alignment determined');
      dataLayer.push({'event': 'roof_alignment_determined'});
    }
    if (step === "slope") {
      //ga('send', 'event', step, 'Design Tool', 'Roof slope determined');
      dataLayer.push({'event': 'roof_slope_determined'});
    }
    if (step === "complete") {
      //ga('send', 'event', step, 'Design Tool', 'Polygon Completed');
      dataLayer.push({'event': 'polygon_completed'});
    }
    console.log("$location", $location.$$path);
    //ga('send', 'pageview', $location.$$path); // relative url
    dataLayer.push({'event':'pageview', 'pageURL':$location.$$path});
  }
}
