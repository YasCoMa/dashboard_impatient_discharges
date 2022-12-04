class RankingAgeGroup extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <p> Most frequent Cancer types distributed by Age groups. You may also filter the data for a specific gender.</p>
         
        <div class="row">
            <div class="col-6">
                <div class="mb-3">
                    <label for="select_age_p4" class="form-label">Age group:</label>
                    <select class="form-select" aria-label="All" id="select_age_p4" onChange="changeDiseaseRankAge()" > </select>
                </div>
            </div>
            
            <div class="col-6">
                <div class="mb-3">
                    <label for="select_gender_p4" class="form-label">Gender:</label>
                    <select class="form-select" aria-label="All" id="select_gender_p4" onChange="changeDiseaseRankAge()" > </select>
                </div>
            </div>
            
            <span id="notice_p4" style="display: none;" >Loading ...</span>
        </div>   
       
        <div id="rank_age_plot4" ></div>
    `;
  }
}
customElements.define('ranking-age-group-component', RankingAgeGroup);

/* Cancer cases by gender and athnic group with filter options for cancer types */
function drawCancerCasesRankAge(dat){
    var data = [];
    var keys=Object.keys(dat);
    var k = "";
    var first = keys[0];
    var cancers_first=Object.keys(dat[first])
    
    for(k in keys){
        k=keys[k];
        var x=[];
        var y=[]; 
        
        var c = "";
        var ctypes=Object.keys(dat[k])
        for( c in cancers_first ){
            c=cancers_first[c]
            if(ctypes.includes(c) ){
                x.push(c)
                y.push( dat[k][c] )
            }
        } 
        data.push( { x: x, y: y, name: k, mode: 'lines+markers', type: 'scatter' } )  
    }
    
    var layout = {xaxis: { title: { text: 'Cancer Type' } }, yaxis: { title: { text: 'Count' } } };
    Plotly.newPlot('rank_age_plot4', data, layout);
   
}

function changeDiseaseRankAge(){
    var chosen_age = document.getElementById('select_age_p4').value;
    var chosen_gender = document.getElementById('select_gender_p4').value;
    
    init_rank_age(chosen_age, chosen_gender);
}

function init_rank_age(age, gender){
    document.getElementById('notice_p4').style.display='block';
    
    var api = new ApiCall();
    var dat = {};
    api.getRankingCancerTypesAgeGroupFilter(age, gender).then(function (response) { 
        dat=response; 
        drawCancerCasesRankAge(dat);
        document.getElementById('notice_p4').style.display='none';
    });
    
}

_feed_select( 'select_age_p4', 'age_group');
_feed_select( 'select_gender_p4', 'gender');
init_rank_age('All', 'All');

