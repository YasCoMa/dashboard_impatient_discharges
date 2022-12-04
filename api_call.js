const axiosConfig = () => {
    axios.interceptors.request.use(function (config) {
        config.headers['X-App-Token'] =  'vL7rlKzXR5M6c2o98kOuMmbCO';
        return config;
    });
}

class ApiCall {
  async getDistinctValuesInField(field){
    var treated=[];
    var url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=distinct "+field+"&$where=lower(ccs_diagnosis_description) like '%25cancer%25'&$order="+field+" asc";
    var dat = await axios.get(url);
    var d = {};
    for (d in dat.data){
        d=dat.data[d]
        treated.push(d[field])
    }
    return treated;
  }

  async getCancerData(cancer_type) {
    var url="https://health.data.ny.gov/resource/gnzp-ekau.json?$where=lower(ccs_diagnosis_description) like '%25cancer%25'";
    if(cancer_type!='All'){
        var url="https://health.data.ny.gov/resource/gnzp-ekau.json?ccs_diagnosis_description="+cancer_type;
    }
    var dat = await axios.get(url);
    return dat.data;
  }

  async getTopFrequentCancer() {
    var url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=ccs_diagnosis_description,count(facility_id) as cnt&$group=ccs_diagnosis_description&$where=lower(ccs_diagnosis_description) like '%25cancer%25'&$order=cnt desc";
    var temp = await axios.get(url);
    var treated=[];
    var d = {};
    for (d in temp.data){
        d=temp.data[d];
        if(treated.length < 5){
            treated.push(d['ccs_diagnosis_description']);
        }
    }
    
    return treated;
  }
  
  async getRankingCancerTypesGenderFilter(gender){
    var api = new ApiCall();
    var genders = await api.getDistinctValuesInField('gender');
    var map = {};
    genders.forEach(function(item){ item=='F' ? map[item]='Female' : item=='M' ? map[item]='Male' : map[item]=item });
    
    var url="";
    var dat={};
    if(gender!="All"){
        url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=ccs_diagnosis_description,count(facility_id) as cnt&$group=ccs_diagnosis_description&$where=lower(ccs_diagnosis_description) like '%25cancer%25' and gender='"+gender+"'&$order=cnt desc"
        var temp = await axios.get(url);
        var treated={};
        var d = {};
        for (d in temp.data){
            d=temp.data[d];
            treated[ d['ccs_diagnosis_description'] ] = parseInt(d['cnt'])
        }
        dat[map[gender]]=treated;
    }
    else{
        
        var dat={}
        var g = "";
        for (g in genders) {
            url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=ccs_diagnosis_description,count(facility_id) as cnt&$group=ccs_diagnosis_description&$where=lower(ccs_diagnosis_description) like '%25cancer%25' and gender='"+genders[g]+"'&$order=cnt desc"
            var temp = await axios.get(url);
            var treated={};
            var d = {};
            for (d in temp.data){
                d=temp.data[d];
                treated[ d['ccs_diagnosis_description'] ] = parseInt(d['cnt'])
            }
            dat[map[genders[g]]]=treated;
        }
    }
    return dat;
  }
  
  async getRankingCancerTypesAgeGroupFilter(age_group, gender){
    var ext="";
    if(gender!="All"){
        ext="' and gender='"+gender;
    }
    
    var url="";
    var dat={};
    if(age_group!="All"){
        url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=ccs_diagnosis_description,count(facility_id) as cnt&$group=ccs_diagnosis_description&$where=lower(ccs_diagnosis_description) like '%25cancer%25' and age_group='"+age_group+ext+"'&$order=cnt desc"
        var temp = await axios.get(url);
        var treated={};
        var d = {};
        for (d in temp.data){
            d=temp.data[d];
            treated[ d['ccs_diagnosis_description'] ] = parseInt(d['cnt'])
        }
        dat[map[gender]]=treated;
    }
    else{
        var api = new ApiCall();
        var groups = await api.getDistinctValuesInField('age_group');
        
        var dat={}
        var g = "";
        for (g in groups) {
            url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=ccs_diagnosis_description,count(facility_id) as cnt&$group=ccs_diagnosis_description&$where=lower(ccs_diagnosis_description) like '%25cancer%25' and age_group='"+groups[g]+ext+"'&$order=cnt desc"
            var temp = await axios.get(url);
            var treated={};
            var d = {};
            for (d in temp.data){
                d=temp.data[d];
                treated[ d['ccs_diagnosis_description'] ] = parseInt(d['cnt'])
            }
            dat[ groups[g] ]=treated;
        }
    }
    return dat;
  }
  
  async getRankingCancerCostsCountyFilter(hospital_area, cancer_type){
    var ext="";
    if(hospital_area!="All"){
        ext="' and health_service_area='"+hospital_area;
    }
    
    var url="";
    var dat={};
    if(cancer_type!="All"){
        url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=hospital_county,avg(total_charges) as cnt&$group=hospital_county&$where=lower(ccs_diagnosis_description) like '%25cancer%25' and ccs_diagnosis_description='"+cancer_type+ext+"'&$order=cnt desc"
        var temp = await axios.get(url);
        var treated={};
        var d = {};
        for (d in temp.data){
            d=temp.data[d];
            treated[ d['hospital_county'] ] = parseInt(d['cnt'])
        }
        dat[cancer_type]=treated;
    }
    else{
        var api = new ApiCall();
        var groups = await api.getTopFrequentCancer();
        
        var dat={}
        var g = "";
        for (g in groups) {
            url="https://health.data.ny.gov/resource/gnzp-ekau.json?$select=hospital_county,avg(total_charges) as cnt&$group=hospital_county&$where=lower(ccs_diagnosis_description) like '%25cancer%25' and ccs_diagnosis_description='"+groups[g]+ext+"'&$order=cnt desc"
            var temp = await axios.get(url);
            var treated={};
            var d = {};
            for (d in temp.data){
                d=temp.data[d];
                treated[ d['hospital_county'] ] = parseInt(d['cnt'])
            }
            dat[ groups[g] ]=treated;
        }
    }
    return dat;
  }
  
}
