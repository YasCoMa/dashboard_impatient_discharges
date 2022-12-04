class Mortality extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <p> Cancer types occurrences distributed by Mortality Risks across Age groups </p>
      
      <div class="row">
           <div class="col-9">
                <div class="mb-3">
                  <label for="select_cancer_type" class="form-label">Cancer Type:</label>
                  <select class="form-select" aria-label="All" id="select_cancer_type" onChange="changeDiseaseMortality()" > </select>
                </div>
           </div>
           <span id="notice" style="display: none;" >Loading ...</span>
        </div>   
           
        <div id="mortality_plot1" ></div>
    `;
  }
}
customElements.define('mortality-component', Mortality);

/* Mortality rate accross age groups with filter options for cancer types */
function drawCancerCasesMortality(dat){
    var filter = _filter_grouped_data(dat, 'age_group', 'apr_risk_of_mortality')
    
    var data=[];
    var keys=Object.keys(filter);
    var x = Object.keys(filter[keys[0]]);
    for(i=0; i<keys.length; i++){
        var y = Object.values(filter[keys[i]]);
        data.push( { 'x': x, 'y': y, 'name': keys[i], 'type': 'bar' } )
    }
    
    var layout = {barmode: 'group', xaxis: { title: { text: 'Mortality Risk' } }, yaxis: { title: { text: 'Count' } } };
    Plotly.newPlot('mortality_plot1', data, layout);
   
}

function changeDiseaseMortality(){
    document.getElementById('notice').style.display='block';
    
    var chosen_disease = document.getElementById('select_cancer_type').value;
    var api = new ApiCall();
    var dat = [];
    api.getCancerData(chosen_disease).then(function (response) { 
        dat=response; 
        drawCancerCasesMortality(dat);
        document.getElementById('notice').style.display='none';
    });
    
}

function init_mortality(){
    document.getElementById('notice').style.display='block';
    
     _feed_select( 'select_cancer_type', 'ccs_diagnosis_description');
     
    var api = new ApiCall();
    var dat = [];
    api.getCancerData('All').then(function (response) { 
        dat=response; 
        drawCancerCasesMortality(dat);
        document.getElementById('notice').style.display='none';
    });
    
}

init_mortality();

