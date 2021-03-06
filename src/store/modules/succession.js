const state ={
     country:[],
     city:[],
     provincial:[],
     provincialCode:[],
     provincialCodeChange:'',
     valueCountry:'中国',
     valueProvincial:'',
     valueCity:'',
     changeType:'',
     brandList:[],
     yList:[],
     echartRequestList:[]  
}
const mutations = {
   setCountryChange:(state,array)=>{
      state.country = array
   },
   setProvincialChange:(state,array)=>{
      state.provincial = array
   },
   setCityChange:(state,array)=>{
     state.city = array
   },
   setValueCountry:(state,string)=>{
     state.valueCountry = string
   },
   setValueProvincial:(state,string)=>{
     state.valueProvincial = string
   },
   setValueCity:(state,string)=>{
     state.valueCity = string
   },
   setBrandList:(state,array)=>{
     state.brandList = array
   },
   setYList:(state,array)=>{
     state.yList = array
   },
   setEchartRequestList:(state,array)=>{
     state.echartRequestList = array
   },
   setProvincialCode:(state,array) => {
     state.provincialCode = array
   },
   setProvincialCodeChange:(state,number)=>{
     state.provincialCodeChange = array
   },
   setChangeType:(state,string) => {
     state.changeType = string
   }
}
const action = {

}
const getters = {

}
export default {
  namespaced: true,
  state,
  getters,
  action,
  mutations,
}