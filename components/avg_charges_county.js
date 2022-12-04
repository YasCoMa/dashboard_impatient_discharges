class AverageChargeCounty extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <p> Average total charges distributed by hospital counties. You may also filter the data for a specific health service area and cancer type.</p>
         
        <div class="row">
            <div class="col-6">
                <div class="mb-3">
                    <label for="select_area_p5" class="form-label">Health Service Area:</label>
                    <select class="form-select" aria-label="All" id="select_area_p5" onChange="changeDiseaseAvgCounty()" > </select>
                </div>
            </div>
            
            <div class="col-6">
                <div class="mb-3">
                    <label for="select_cancer_p5" class="form-label">Cancer type:</label>
                    <select class="form-select" aria-label="All" id="select_cancer_p5" onChange="changeDiseaseAvgCounty()" > </select>
                </div>
            </div>
            
            <span id="notice_p5" style="display: none;" >Loading ...</span>
        </div>   
       
        <div id="avg_county_plot5" ></div>
    `;
  }
}
customElements.define('average-charge-county-component', AverageChargeCounty);

function drawCancerCasesAvgCounty(dat){
    var data = [];
    var keys=Object.keys(dat);
    var k = "";
    var first = keys[0];
    var counties_first=Object.keys(dat[first])
    
    for(k in keys){
        k=keys[k];
        var x=[];
        var y=[]; 
        
        var c = "";
        var ctypes=Object.keys(dat[k])
        for( c in counties_first ){
            c=counties_first[c]
            if(ctypes.includes(c) ){
                x.push(c)
                y.push( dat[k][c] )
            }
        } 
        data.push( { x: x, y: y, name: k, mode: 'lines+markers', type: 'scatter' } )  
    }
    
    var layout = {xaxis: { title: { text: 'County' } }, yaxis: { title: { text: 'Average Total Charges' } } };
    Plotly.newPlot('avg_county_plot5', data, layout);
   
}

function changeDiseaseAvgCounty(){
    var chosen_area = document.getElementById('select_area_p5').value;
    var chosen_cancer = document.getElementById('select_cancer_p5').value;
    
    init_avg_county(chosen_area, chosen_cancer);
}

function init_avg_county(area, cancer){
    document.getElementById('notice_p5').style.display='block';
    
    var api = new ApiCall();
    var dat = {};
    api.getRankingCancerCostsCountyFilter(area, cancer).then(function (response) { 
        dat=response; 
        drawCancerCasesAvgCounty(dat);
        document.getElementById('notice_p5').style.display='none';
    });
    
}

_feed_select( 'select_area_p5', 'health_service_area');
_feed_select( 'select_cancer_p5', 'ccs_diagnosis_description');
init_avg_county('All', 'All');

