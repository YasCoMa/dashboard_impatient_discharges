class Ethnicity extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
         <p> Cancer types occurrences distributed by Ethnicity across Genders </p>
         
      <div class="row">
       <div class="col-9">
            <div class="mb-3">
              <label for="select_cancer_type_p2" class="form-label">Cancer Type:</label>
              <select class="form-select" aria-label="All" id="select_cancer_type_p2" onChange="changeDiseaseEthnicity()" > </select>
            </div>
       </div>
       <span id="notice_p2" style="display: none;" >Loading ...</span>
    </div>   
       
    <div id="ethnic_plot2" ></div>
    `;
  }
}
customElements.define('ethinicty-component', Ethnicity);

/* Cancer cases by gender and athnic group with filter options for cancer types */
function drawCancerCasesEthnicity(dat){
    var filter = _filter_grouped_data(dat, 'gender', 'ethnicity')
    
    var data=[];
    var keys=Object.keys(filter);
    var x = Object.keys(filter[keys[0]]);
    for(i=0; i<keys.length; i++){
        var y = Object.values(filter[keys[i]]);
        data.push( { 'x': x, 'y': y, 'name': keys[i], 'type': 'bar' } )
    }
    
    var layout = {barmode: 'group', xaxis: { title: { text: 'Ethnicity' } }, yaxis: { title: { text: 'Count' } } };
    Plotly.newPlot('ethnic_plot2', data, layout);
   
}

function changeDiseaseEthnicity(){
    document.getElementById('notice_p2').style.display='block';
    
    var chosen_disease = document.getElementById('select_cancer_type_p2').value;
    var api = new ApiCall();
    var dat = [];
    api.getCancerData(chosen_disease).then(function (response) { 
        dat=response; 
        drawCancerCasesEthnicity(dat);
        document.getElementById('notice_p2').style.display='none';
    });
    
}

function init_ethnic(){
    document.getElementById('notice_p2').style.display='block';
    
    _feed_select( 'select_cancer_type_p2', 'ccs_diagnosis_description');
    
    var api = new ApiCall();
    var dat = [];
    api.getCancerData('All').then(function (response) { 
        dat=response; 
        drawCancerCasesEthnicity(dat);
        document.getElementById('notice_p2').style.display='none';
    });
    
}

init_ethnic();

