
function _filter_grouped_data(dat, x_label, levels_grouped){
    var filter = {}
    for(i=0; i<dat.length; i++){
        var keys=Object.keys(filter);
        var x_label_dat = dat[i][x_label];
        if(x_label_dat=='F'){
            x_label_dat='Female';
        }
        if(x_label_dat=='M'){
            x_label_dat='Male';
        }
        
        if(!keys.includes(x_label_dat)){
            filter[x_label_dat]={}
        }
        var level_grouped = dat[i][levels_grouped];
        if(level_grouped=='F'){
            level_grouped='Female';
        }
        if(level_grouped=='M'){
            level_grouped='Male';
        }
        
        var subkeys=Object.keys(filter[x_label_dat]);
        if(!subkeys.includes(level_grouped)){
            filter[x_label_dat][level_grouped]=0
        }
        filter[x_label_dat][level_grouped]+=1
    }
    return filter
}

function _feed_select(container_id, column_name){
    var ct=[];
    var api = new ApiCall();
    api.getDistinctValuesInField(column_name).then(function (response) { 
        ct=response;
        var html="<option value='All' selected > All </option>";
        ct.forEach(function(type) { type=="F" ? value='Female' : type=="M" ? value='Male' : value=type; html += "<option value='"+type+"'> "+value+" </option>"; });
        document.getElementById(container_id).innerHTML=html;
    });
}

// line chart ranking cancer types by gender and ethnicity and age group
// hospital areas x costs filtering by cancer type
// hospital areas x ethnicity or gender

