export function getQuery(search,name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export function mergePath(url1,url2) {
  return url1.replace(/\/$/,'')+'/'+url2.replace(/^\//,'')
}

export function getApiUrl(search,name) {
  let host=window.location.host;
  if(/test/.test(host)){
    return "http://test.qa.91jkys.com:9215"
  }else if(!/127|localhost/.test(host)){
    return window.location.origin+"/api"
  }else{
    return "http://127.0.0.1:9215"
  }
}


export function setCookie(name, value) {
  var exp = new Date();
  exp.setTime(exp.getTime() + 300 * 24 * 60 * 60 * 1000); 
  document.cookie = name + "=" + encodeURIComponent(value)
      + ";expires=" + exp.toGMTString() + ";path=/";
  return true;
}

export function mergeData(oldData,newData,pKey){
  function changeKey(data,key){
    if(!key){
      return data;
    }
    for(let i in data){
      key=key+"-"+data[i].name.replace(/-/g,'_');
      data[i].key=key;
      if(data[i].children&&data[i].children.length>0){
        data[i].children=changeKey(data[i].children.slice(),key)
      }
    }
    return data;
  }
  function merge(a,b,key){
    if(!b||b.length===0){
      return a;
    }
    if(!a){
      return changeKey(b,key);
    }
    for(let i in b){
      const index=a.findIndex(item=>(item.name===b[i].name));
      if(index>=0){
        if(a[index].children&&a[index].children.length>0&&b[i].children&&b[i].children.length){
          a[index].children=merge(a[index].children.slice(),b[i].children,a[index].key);
        }else if(b[i].children&&b[i].children.length){
          a[index].mockType=b[i].mockType;
          a[index].type=b[i].type;
          a[index].children=changeKey(b[i].children, a[index].key)
        }
      }else{
        a=a.concat(changeKey([b[i]],key));
      }
    }
    return a;
  }
  return merge(oldData,newData,pKey);
}