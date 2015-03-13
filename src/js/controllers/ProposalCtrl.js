/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  Proposal Controller

  Controls the views of proposal data

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

controllers.controller('ProposalCtrl', ['Form', 'Clientstream', 'defaultValues', ProposalCtrl_]);

function ProposalCtrl_ (Form, Client, defaultValues) {
  var vm = this;
  vm.prospect = Form.prospect;

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

  calculateProposal();
  console.debug('defaults', defaultValues);

  function calculateProposal () {
    // calculate upfront cost
    upfront_cost = defaultValues.upfront_cost;
    vm.prospect.upfrontCost = upfront_cost;
    Client.emit('Form: valid data', { upfrontCost: 0 });

    // calculate annual consumption in $$ of electricity from monthly bill estimate
    bill = vm.prospect.bill;
    annual_consumption = (bill * 12) || defaultValues.annual_consumption;
    vm.prospect.annualConsumption = annual_consumption;
    Client.emit('Form: valid data', { annualConsumption: annual_consumption });

    // calculate annual production in $$ of electricity from panel fill API
    // HACK: replace with Panel Fill API production estimate
    // annual_production = vm.prospect.annualProduction;
    annual_production = defaultValues.annual_production;
    vm.prospect.annualProduction = annual_production;
    Client.emit('Form: valid data', { annualProduction: annual_production });

    // grab rate estimates from the Form object
    utility_rate = vm.prospect.utilityRate || defaultValues.utility_rate; // MedianUtilityPrice
    vm.prospect.utilityRate = utility_rate;

    scty_rate = vm.prospect.sctyRate || defaultValues.scty_rate; // FinancingKwhPrice
    vm.prospect.sctyRate = scty_rate;

    // calculate estimated first year savings from annual consumption and production estimates
    // first_year_savings = (annual_production < annual_consumption * 0.8) ? (bill * 12) - (annual_production * scty_rate) : (bill * 12) - (annual_consumption * 0.8 * scty_rate);
    if (annual_production < annual_consumption * 0.8) {
      first_year_savings = annual_consumption - (annual_production * scty_rate);
    } else {
      // first_year_savings = (bill * 12) - (annual_consumption * 0.8 * scty_rate);
      // first_year_savings = (bill * 12) - (bill * 12 * 0.8 * scty_rate);
      first_year_savings = annual_consumption * 0.2 * scty_rate;
    }
    vm.prospect.firstYearSavings = first_year_savings;
    Client.emit('Form: valid data', { firstYearSavings: first_year_savings });

    // calculate percentage of energy coming from solar
    // percent_solar = ((annual_production / annual_consumption) < 0.8) ? annual_production * 100 / annual_consumption : 80;
    if ((annual_production/annual_consumption) < 0.8) {
      percent_solar = annual_production * 100 / annual_consumption;
    } else percent_solar = defaultValues.percent_solar;
    vm.prospect.percentSolar = percent_solar;
    Client.emit('Form: valid data', { percentSolar: percent_solar });

    // calculate percentage of energy not coming from solar
    percent_utility = 100 - percent_solar;
    vm.prospect.percentUtility = percent_utility;
    Client.emit('Form: valid data', { percentUtility: percent_utility });
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
