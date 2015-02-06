directives.directive('flnInputEmail', ["Form", flnInputEmail_]);

function flnInputEmail_ (Form) {
  return {
    scope: {
      hint: "@"
    },
    restrict: "E",
    templateUrl: "templates/directives/flnInputEmail.html",
    controller: "FormCtrl as form"
  };
}