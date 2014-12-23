/* ==================================================
  ModalCtrl
  the modal controller
================================================== */

controllers.controller("ModalCtrl", ["ModalService", ModalCtrl_]);

function ModalCtrl_(ModalService) {

  var vm = this;

  vm.isOn        = ModalService.get;
  vm.dialogShown = ModalService.dialogShown;
  vm.open        = openModal;
  vm.close       = closeModal;
  vm.toggle      = toggleModal;
  vm.showDialog  = showDialog;

  // turn modal state on
  function openModal() {
    $('body').css('overflow', 'hidden');
    ModalService.set(true);
  }

  // turn modal state off
  function closeModal() {
    $('body').css('overflow-y', 'scroll');
    ModalService.set(false);
  }

  // switch modal state on and off
  function toggleModal() {
    var shown = ModalService.get();
    if ($('body').css('overflow') === 'hidden') {
      $('body').css('overflow-y', 'scroll');
    } else {
      $('body').css('overflow', 'hidden');
    }
    ModalService.set(!shown);
  }

  // select which dialog displays in the modal state
  function showDialog(name) {
    ModalService.set(true);
    ModalService.activate(name);
  }
}
