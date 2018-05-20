import {observable, action, useStrict,computed} from 'mobx';
import Mock from 'mockjs';
import fetchApi from  '@/api';

//import axios from 'axios';
useStrict(true);

class Interfase {
  @observable editable = false ;
  @observable showLeadInModal = false ;
  @observable data = {
    name: '',
    method: "",
    url: '',
    res: [

    ],
    req: []
  };

  @observable resCode='';
  @observable reqCode='';
  timer={res:null,req:null};

  @computed get resMock() {
       if(!this.data.res){
         return "";
       }
       let data={};
       for(let item of this.data.res){

         data[item.name+(item.mockNum&&"|"+item.mockNum)]=this.formatMock(item)
       }
       return JSON.stringify(data,null,2);
   }

   @computed get reqMock() {
       if(!this.data.res){
         return "";
       }
        let data={};
        for(let item of this.data.req){
          data[item.name+(item.mockNum&&"|"+item.mockNum)]=this.formatMock(item)
        }
        return JSON.stringify(data,null,2);
    }



  formatMock(item){
    try{
    if(!item.children||item.children.length===0||item.mockValue){
      if(item.mockValue){
        if(item.mockType==='Array'&&/^\[[\s\S]*\]$/m.test(item.mockValue)){
          return JSON.parse(item.mockValue)
        }else if(item.mockType==='Object'&&/^{[\s\S]*}$/m.test(item.mockValue)){
          return JSON.parse(item.mockValue)
        }else if(item.mockType==='String'){
          return ""+item.mockValue
        }else if(item.mockType==='Number'&&/^[0-9.+-]*$/m.test(item.mockValue)){
          return Number(item.mockValue)
        }else if(item.mockType==='Boolean'&&/^true|false$/m.test(item.mockValue)){
          return JSON.parse(item.mockValue)
        }else{
          return item.mockValue
        }

      }else{
        if(item.type==='Array'){
          return []
        }else if(item.type==='Object'){
          return {}
        }else if(item.type==='String'){
          return ""
        }else if(item.type==='Number'){
          return 0
        }else if(item.type==='Boolean'){
          return false
        }else{

        }
      }
      return ""
    }
    let data={};
    for(let child of item.children){
      data[child.name+(child.mockNum&&"|"+child.mockNum)]=this.formatMock(child);
    }

    if(item.mockType==='Array'){
       return [data]
    }else{
      return data;
    }
  }catch(e){
    console.log(e)
    return item.mockValue
  }
  }



  formatCode(key, value,id) {
    function judgeType(value){
      if(!value){return 'String'}
      if(value.constructor === Array){
        return "Array"
      }else if(value.constructor===Date){
        return "Date"
      }else{
        return (typeof value).replace(/./,$=>$.toUpperCase())
      }
    }
    let data = {
      key:id,
      name: key,
      type: judgeType(value),
      required: false,
      mockType: judgeType(value),
      mockNum: '',
      mockValue: (typeof value==='object'||value===null)?'':value,
      description: ''
    }
    if (value&&typeof value === 'object') {
      data.children = [];
      if(value.constructor === Array){
        if(typeof value[0]==='string'){
          data.mockValue=JSON.stringify(value);
          return data;
        }else{
          value=value[0];
        }

      }

      let num=0;
      for (let i in value) {
        num++;
        data.children.push(this.formatCode(i,value[i],id+'-'+num))
      }
    }
    return data;
  }

  @action.bound
  leadInRes(code) {
    if (typeof code === 'string') {
      code = JSON.parse(code)
    }
    let newCode = [];
    let id=Date.now()
    for (let i in code) {
      newCode.push(this.formatCode(i, code[i],id+i))
    }
    this.data.res=this.data.res.toJS().concat(newCode)
    this.changeCode('res')
  }

  @action.bound
  leadInReq(code) {
    if (typeof code === 'string') {
      code = JSON.parse(code)
    }
    let newCode = [];
    let id=Date.now()
    for (let i in code) {
      newCode.push(this.formatCode(i, code[i],id+i))
    }
    this.data.req=this.data.req.slice().concat(newCode)
    this.changeCode('req')
  }


  @action.bound
  changeProxyType(val) {
    this.data.proxyType=val;
  }


  @action.bound
  changeField(type,value, key, column) {
    const data = this.data[type].slice();
    const keys=key.split('-');
    let curKey='';
    let target={children:data};
    for(let i =0;i< keys.length;i++){
      curKey+=keys[i];
      target = target.children.filter(item => curKey === item.key)[0];
      curKey+="-"
    }
    if (target) {
      target[column] = value;
      if(column==='type'){
        target['mockType']=value;
        if(value!=='Array'&&value!=='Object'){
          target.children=null;
        }
      }

    }

    this.data[type]=data;

    this.changeCode(type)

  }

  @action.bound
  delField(type,key) {
    const data = this.data[type].slice();
    const keys=key.split('-');
    let curKey='';
    let target={children:data};

    for(let i =0;i< keys.length;i++){
      curKey+=keys[i];
      if(i===keys.length-1){
        let index = target.children.findIndex(item => curKey === item.key);
        target.children.splice(index,1)
      }else{
        target = target.children.filter(item => curKey === item.key)[0];
      }

      curKey+="-"

    }
    this.data[type]=data;
    this.changeCode(type)
  }




  @action.bound
  addValue({type,key,value}) {
    if(!key){
      this.data[type].push(value)
      return;
    }
    const keys=key.split('-');
    let curKey='';
    let target={children:this.data[type].slice()};
    for(let i =0;i< keys.length;i++){
      curKey+=keys[i];
      target = target.children.filter(item => curKey === item.key)[0];
      curKey+="-"
    }
    if (target) {
      value.key=key+"-"+value.key;
      if(!target.children){
        target.children=[];
      }
      target.children.push(value)
    }
    this.changeCode(type)
  }

  @action.bound
  changeCode(type) {
    clearTimeout(this.timer[type])
    this.timer[type]=setTimeout(()=>{
      this.createCode(type)
    },500)
  }

  @action.bound
  createCode(type){
    if(type==='res'&&this.resMock){
      this.resCode= JSON.stringify(Mock.mock(JSON.parse(this.resMock)),null,2)
    }else if(this.reqMock){
      this.reqCode= JSON.stringify(Mock.mock(JSON.parse(this.reqMock)),null,2)
    }
  }




  @action.bound
  openEditable() {
    this.editable = true;
  }
  @action.bound
  closeEditable() {
    this.editable = false;
  }


  @action.bound
  getInterfaseData(data) {
      this.data={...data};
      this.editable = false;
      interfases.changeCode('req')
      interfases.changeCode('res')
  }


}

const interfases= new Interfase()



export default interfases