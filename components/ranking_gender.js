class RankingGender extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
         <p> Most frequent Cancer types distributed by Genders </p>
         
      <div class="row">
       <div class="col-9">
            <div class="mb-3">
              <label for="select_gender_p3" class="form-label">Gender:</label>
              <select class="form-select" aria-label="All" id="select_gender_p3" onChange="changeDiseaseRankGender()" > </select>
            </div>
       </div>
       <span id="notice_p3" style="display: none;" >Loading ...</span>
    </div>   
       
    <div id="rank_gender_plot3" ></div>
    `;
  }
}
customElements.define('ranking-gender-component', RankingGender);

/* Cancer cases by gender and athnic group with filter options for cancer types */
function drawCancerCasesRankGender(dat){
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
    Plotly.newPlot('rank_gender_plot3', data, layout);
   
}

function changeDiseaseRankGender(){
    var chosen_gender = document.getElementById('select_gender_p3').value;
    
    init_rank_gender(chosen_gender);
}

function init_rank_gender(gender){
    document.getElementById('notice_p3').style.display='block';
    
    var api = new ApiCall();
    var dat = {};
    api.getRankingCancerTypesGenderFilter(gender).then(function (response) { 
        dat=response; 
        drawCancerCasesRankGender(dat);
        document.getElementById('notice_p3').style.display='none';
    });
    
}

_feed_select( 'select_gender_p3', 'gender');
init_rank_gender('All');

