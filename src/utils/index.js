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
  if(/91jkys\./.test(host)||/moapi\./.test(host)){
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