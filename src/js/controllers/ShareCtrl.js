/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Share Controller

  Controls the views of shared proposal

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ShareCtrl', ['Clientstream', 'defaultValues', '$stateParams', 'Proposal', ShareCtrl_]);

function ShareCtrl_ (Client, defaultValues, $stateParams, Proposal) {

  // http://localhost:8100/flannel#/share/-JkzqbNe6y7UJr7ebTCu/100/0.2233/0.15
  var vm = this;
  vm.prospect = {};

  var upfront_cost,
      annual_consumption,
      utility_rate,
      scty_rate,
      annual_production,
      first_year_savings,
      percent_savings,
      percent_solar,
      percent_utility,
      bill;


  Proposal.rx_panel_count.subscribe(subProposalToPanelCount)

  // calculate annual production in $$ of electricity from panel fill API
  function subProposalToPanelCount (count) {
    // power of each panel
    vm.prospect.panelCapacity = defaultValues.panel_capacity;

    // number of panels filled from Panelfill API
    vm.prospect.systemSize = count * vm.prospect.panelCapacity || defaultValues.system_size;

    // estimated production of that system in a year => power of system * yearly yield per kW in that region
    vm.prospect.annualProduction = vm.prospect.systemSize * vm.prospect.averageYield || defaultValues.annual_production;

    console.log("subProposalToPanelCount", count);
    calculateProposal();
  }

  function calculateProposal () {
    // calculate upfront cost
    upfront_cost = defaultValues.upfront_cost;
    vm.prospect.upfrontCost = upfront_cost;

    // grab rate estimates from the Form object
    utility_rate = $stateParams.utilityRate || defaultValues.utility_rate; // MedianUtilityPrice
    vm.prospect.utilityRate = utility_rate;

    // calculate annual consumption in $$ of electricity from monthly bill estimate
    bill = $stateParams.bill;
    annual_consumption = ((bill * 12) / utility_rate) || defaultValues.annual_consumption; // kWh
    vm.prospect.annualConsumption = annual_consumption;
    annual_production = vm.prospect.annualProduction;

    scty_rate = $stateParams.sctyRate || defaultValues.scty_rate; // FinancingKwhPrice
    vm.prospect.sctyRate = scty_rate;

    // calculate estimated first year savings from annual consumption and production estimates
    // if a prospect would offset less than 80% of their energy needs, first year savings are the yearly spend minus the offset costs at scty rate
    if (annual_production < (annual_consumption * 0.8)) {
      first_year_savings = annual_production * (utility_rate - scty_rate); // $/yr
    }
    // else if they could offset more than that, we make sure they don't
    else {
      first_year_savings = annual_consumption * .8 * (utility_rate - scty_rate); // $/yr
    }
    vm.prospect.firstYearSavings = first_year_savings;

    // calculate percentage of energy coming from solar
    if (((annual_consumption-annual_production)/annual_consumption) < 0.8) {
      percent_solar = 100 * (annual_consumption - annual_production) / annual_consumption; // %
    }
    // if the system would produce more than 80%, we limit it at 80%
    else {
      percent_solar = defaultValues.percent_solar;
    }

    vm.prospect.percentSolar = percent_solar;

    // calculate percentage of energy not coming from solar
    percent_utility = 100 - percent_solar;
    vm.prospect.percentUtility = percent_utility;

    drawPowerChart();
  }

  function drawPowerChart () {
    var chartEl,
        charty,
        chartOpts;

    chartEl = document.getElementById('powerRatioChart').getContext('2d');
    chartOpts = {
      showTooltips: false
    };

    chartData = [
      {
        value: percent_solar,
        color: '#008752',
        highlight: '#559933',
        label: 'Solar Power'
      },
      {
        value: percent_utility,
        color: '#FFFFFF',
        highlight: '#EFEFEF',
        label: 'Dirty Power'
      }
    ]

    charty = new Chart(chartEl).Pie(chartData, chartOpts);
  }
}
