<template>
<div id="provincialBox">
</div>

</template>
<script>
import axios from "axios";
import echarts from "echarts";

import greenballoonIcon from "../base64/greenballoon";
import yellowballoonIcon from "../base64/yellowballoon";
import newsIcon from "../base64/news";
import formatterleftIcon from "../base64/formatterleft";
import formatterrightIcon from "../base64/formatterright";
import formatterLeftAngleIcon from "../base64/formatterLeftAngle";

import { IndexModel } from '../untils/index'
const indexModel = new IndexModel()

import { cityMap } from "../untils/cityMap.js"

import { mapState } from "vuex";

export default {
   name:'provincialMapBox',
   data(){
     return{
       showChinaCountry:'',
       allCityList:{},
       cityShopNumber:{},
       cityManager:{},
       afterProvince:''
     }
   },
   computed:{
     ...mapState({
       drawProvincialChange: state => state.home.provincialChange,
       drawProvincialZoom: state => state.home.provincialZoom,
       drawCountryChange: state => state.home.countryChange,
       drawProvincialChinaChange: state => state.home.provincialChinaChange,
       drawCountry: state => state.home.country
     })
   },
   watch:{
     //监视省地图VUEX变量比例变化重新渲染
       drawProvincialZoom:{
         handler(newVal,oldVal){
           this.actionProvincial()
         },
         deep:true
       }
   },
   mounted(){
      this.matchingCountry()
      this.requestCityList()
      // this.actionProvincial()
   },
   methods:{
     //请求省内经销商数据
     requestCityList(){
       if(this.drawProvincialChinaChange=='北京' || this.drawProvincialChinaChange=='上海' || this.drawProvincialChinaChange=='天津'|| this.drawProvincialChinaChange=='重庆'){
         this.afterProvince = this.drawProvincialChinaChange + '市'
         console.log('1111',this.afterProvince)
       }
       else if(this.drawProvincialChinaChange=='香港'||this.drawProvincialChinaChange=='澳门'){
         this.afterProvince = this.drawProvincialChinaChange + '特别行政区'
        //  console.log('5555',this.afterProvince)
       }else if(this.drawProvincialChinaChange == '内蒙古'||this.drawProvincialChinaChange == '西藏'){
         this.afterProvince = this.drawProvincialChinaChange + '自治区'
       }else if(this.drawProvincialChinaChange == '广西'){
         this.afterProvince = this.drawProvincialChinaChange + '壮族自治区'
       }else if(this.drawProvincialChinaChange == '宁夏'){
         this.afterProvince = this.drawProvincialChinaChange + '回族自治区'
       }else if(this.drawProvincialChinaChange == '新疆'){
         this.afterProvince = this.drawProvincialChinaChange + '维吾尔自治区'
       }else{
         this.afterProvince = this.drawProvincialChinaChange + '省'
        //  console.log('6666',this.afterProvince)
       }
      // console.log('8989',this.afterProvince)
       let [country,province] = [this.showChinaCountry,this.afterProvince]
       indexModel.getCityList(country,province)
       .then(res=>{
        //  console.log('res.data',res.data)
           if(res.data.status == 1 ){
            this.allCityList = res.data.data
            console.log('allCityList',this.allCityList)
            this.cityShopNumber = this.allCityList.shopTypeCount[0]
            this.cityManager = this.allCityList.manager
            this.$store.commit("provincial/setCityShopNumber",this.cityShopNumber)
            this.$store.commit("provincial/setAllCityList",this.allCityList)
            this.$store.commit("provincial/setCityManager",this.cityManager)
             console.log('this.cityManager',this.cityManager)
            //地图初始化
            this.actionProvincial()
            // console.log('cityShowNumber',this.cityShopNumber)
           } else {
            //地图初始化
            this.actionProvincial()
           }
       })
       .catch(err=>{
         console.log('111',err)
       })
     },
     //初始化省地图
     actionProvincial(){
        let [provincialChange,provincialZoom,cityBrandList] = [this.drawProvincialChange,this.drawProvincialZoom,this.allCityList.cityList]
        // console.log('provincialChange',this.drawProvincialChange)
        // console.log('cityBrandList转化嵌套',cityBrandList)
        // console.log('省份',provincialChange)
        axios.get(`./geoJson/province/${provincialChange}.json`)
        .then(res => {
          //城市区分开发程度
          let developCity = this.gradeCity()
          // console.log('地图颜色',developCity)
          let spaceColor = this.gradeSpaceCity()
          //区分气球颜色
          let gradeBalloon = this.gradeBalloon()
          // console.log('66气球数据',gradeBalloon)
          let provincialChangeJson = res.data;
          echarts.registerMap("provincialChange", provincialChangeJson);
          this.myEcharts = echarts.init(document.getElementById("provincialBox"));
          let option = this.provincialOption(provincialZoom,cityBrandList,developCity,gradeBalloon,spaceColor);
          this.myEcharts.setOption(option); 
          //城市地图跳转
          this.jumpCity()
        }) 
     },
     //城市跳转地图函数
     jumpCity(){
        this.myEcharts.on('click',(params) =>{
          // console.log('city',params.name)
          let cityAry = Object.keys(cityMap)
          for(let i = 0; i<cityAry.length; i++){
            if(params.name==cityAry[i]){
              //  console.log('cityMapNum',cityMap[cityAry[i]])
                let cityname = params.name
                // let city = cityname.substr(0,cityname.length-1)
                let city = cityname
                this.$store.commit("home/setCityChange",cityMap[cityAry[i]])
                this.$store.commit("home/setCityChinaChange",city)
                this.$router.push({ name: "city" });
            }
          }
        })
     },
     //地图配置
     provincialOption(provincialZoom,cityBrandList,developCity,gradeBalloon,spaceColor){
       console.log('balloon',gradeBalloon)
       return{
          tooltip:{
            show:true,
            triger:'item',
            formatter:function(params){
              // console.log('555',params.name)
              // console.log('999',cityBrandList)
              //判断是鼠标所在点是地图还是散点图
              if(params.componentSubType == 'map'){
                // console.log('929',cityBrandList)
                let brandListArray = []
                for(let i = 0; i<cityBrandList.length; i++){
                    brandListArray = cityBrandList[i].brandList
                    if (params.name == cityBrandList[i].city){
                          let list =[]
                          for(let index=0; index<brandListArray.length; index++){
                            // console.log('cityBrandList.brandList.city',brandListArray)
                            list += `<p style ='margin-left:5px;height:36px;'>${brandListArray[index].brand}：${brandListArray[index].total}</p>`
                          }
                          // if(brandListArray.length >0){
                          //   let res =`<img style='width:280px; height:380px;margin:-15px -10px -15px -10px; display:block;' src='${newsIcon}'/>`
                          //   res +=`<img style='width:30px; height:30px; position:absolute; display:block; right:250px; top:-10px; ' src='${formatterLeftAngleIcon}'/>`
                          //   res +=`<img style='width:30px; height:30px; position:absolute; display:block; right:-10px; top:-10px; transform:rotate(90deg) ' src='${formatterLeftAngleIcon}'/>`
                          //   res +=`<img style='width:30px; height:30px; position:absolute; display:block; right:250px; bottom:-12px; transform:rotate(-90deg) ' src='${formatterLeftAngleIcon}'/>`
                          //   res +=`<img style='width:30px; height:30px; position:absolute; display:block; right:-10px; bottom:-12px; transform:rotate(180deg) ' src='${formatterLeftAngleIcon}'/>`
                          //   res += 
                          //       `<div style ='position:absolute; letf:0px; top:0px; width:280px; height:206px;padding-top:10px;' >
                          //             <p style ='margin-left:5px;height:36px;'>${params.name}</p>
                          //             ${list}
                          //       </div>`    
                          //   return res 
                          // } else{
                          //     let res = `<img style='width:280px; height:100px;margin:-10px -10px -10px -10px; display:block;' src='${newsIcon}'/>`
                          //     res += 
                          //         `<div style ='position:absolute; letf:0px; top:0px; width:280px; height:100px;padding-top:10px; font-size:20px;'>
                          //           <p style ='margin-left:5px;height:36px;'>${params.name}</p>
                          //           <p style ='margin-left:5px;height:36px;'>暂无数据</p>
                          //         </div>`
                          //     return res
                          // }
                          if(brandListArray.length >0){
                          let res = 
                                 `<div style ='position:absolute; letf:0px; top:0px; width:280px;border:2px solid rgba(43, 58, 124, 1);background:linear-gradient(0deg,rgba(1,9,40,1),rgba(0,8,73,1));' >
                                      <p style ='margin-left:5px;height:36px;'>${params.name}</p>
                                      ${list}
                                      <img style='width:30px; height:30px; position:absolute; display:block; left:-10px; top:-10px; ' src='${formatterLeftAngleIcon}'/>
                                      <img style='width:30px; height:30px; position:absolute; display:block; right:-10px; top:-10px; transform:rotate(90deg) ' src='${formatterLeftAngleIcon}'/> 
                                      <img style='width:30px; height:30px; position:absolute; display:block; left:-10px; bottom:-10px; transform:rotate(-90deg) ' src='${formatterLeftAngleIcon}'/>
                                      <img style='width:30px; height:30px; position:absolute; display:block; right:-10px; bottom:-10px; transform:rotate(180deg) ' src='${formatterLeftAngleIcon}'/>
                                </div>`    
                          return res                               
                          } else{
                              let res = `<img style='width:280px; height:100px;margin:-10px -10px -10px -10px; display:block;' src='${newsIcon}'/>`
                              res += 
                                  `<div style ='position:absolute; letf:0px; top:0px; width:280px; height:100px;padding-top:10px; font-size:20px;'>
                                    <p style ='margin-left:5px;height:36px;'>${params.name}</p>
                                    <p style ='margin-left:5px;height:36px;'>暂无数据</p>
                                  </div>`
                              return res                            
                          }   
                    }
                }
              } else {          
                for(let i = 0; i<cityBrandList.length; i++){
                    // let res = `<img style='width:230px; height:206px;margin:-10px -10px -10px -10px; display:block;' src='${newsIcon}'/>`
                    let address =''
                    for(let index = 0; index<gradeBalloon.length; index++){
                      if(params.name==gradeBalloon[index].name){
                         address = gradeBalloon[index].address
                      }
                    }
                    let res = 
                      `<div style ='width:auto; height:74px;padding-top:10px; margin:-5px -5px -5px -5px; border-radius:4px; background:rgba(14,109,233,0.5); font-size:20px;' >
                            <p style ='margin-left:5px;height:36px; padding-left:10px;padding-right:10px;'>${params.name}</p>
                            <p style ='margin-left:5px;height:36px; padding-left:10px;padding-right:10px;'>地址：${address}</p>
                      </div>`
                      res += `<img style='width:21px; height:94px; position:absolute; top:-5px; left:-15px;' src='${formatterleftIcon}'/>`
                      res += `<img style='width:21px; height:94px; position:absolute; top:-5px; right:-15px;' src='${formatterrightIcon}'/>`
                    return res
                }
              }

            },
            textStyle:{
              color:'rgba(122,180,251,1)',
              fontSize:18,
            }
          },
          geo: {
            type: "map",
            map: "provincialChange",
            roam:'move',
            // scaleLimit:{
            //   min:0.6,
            //   max:5.5,
            // },
            zoom: provincialZoom,
            top: "1px",
            itemStyle: {
              // areaColor: "#00083C",
              areaColor: spaceColor,
              borderColor: "#2B3A7C",
              borderType:'solid',
              borderWidth:1,
            },
            label:{
              show:true,
              fontSize:16,
              align:'center',
              color:'#33D8FA',
              position:[10,10],
              distance:55,
            },
            emphasis:{
              label:{
                show:true,
                color:'white'
              },
              itemStyle:{
                // areaColor:'rgba(51,216,250,1)',
                // areaColor: "rgba(56,166,200,1)",
                areaColor:'#9343b5',
              }
            },
            regions:developCity
          },
          series:[
            {
              // name:'provincialChange',
              type:'scatter',
              coordinateSystem: "geo",
              symbolOffset:[0,'-50%'],
              data:gradeBalloon,
              itemStyle:{
                opacity:0.4
              },
              emphasis:{
                itemStyle:{
                  opacity:1
                },                
              }
            },
            {
              type:'map',
              map:'provincialChange',
              coordinateSystem: "geo",
              geoIndex:0,
              data:cityBrandList,
            }
          ]
        };
      
     },
     //国家中英文转换
     matchingCountry(){
        for(let i = 0; i<this.drawCountry.length; i++){
            if(this.drawCountryChange==this.drawCountry[i].EnglishName){
              this.showChinaCountry = this.drawCountry[i].ChinaName
            }
        }
     },
     //城市区分开发程度函数
     gradeCity(){
       let list = this.allCityList.cityList
      //  console.log('list',list)
       let grade =[]
       for(let i = 0; i < list.length; i++){
          if(list[i].developFlag == 0){
            grade.push({
                name:list[i].city,
                itemStyle:{
                  areaColor:'#33D8FA',
                },
                label:{
                  color:'#000001',
                }
            })
          }else if(list[i].developFlag == 1){
            grade.push({
                name:list[i].city,
                itemStyle:{
                  areaColor:'#AC4ED3',
                  color:'white',
                },
                label:{
                  color:'white',
                },
            })
          }
       }
       return grade
     },
     //特殊处理直辖市开发颜色
     gradeSpaceCity(){
      //  let spaceList = this.allCityList.cityList
        let spaceList = this.afterProvince
        let selectColor = ""
        if(spaceList == '北京市' ||spaceList == '上海市'||spaceList == '重庆市'||spaceList == '天津市'||spaceList == '香港特别行政区'||spaceList == '澳门特别行政区'||spaceList == '台湾省'){
          // console.log('北京颜色变化',spaceList.city)
          //门店数为0就黑色
          if(this.allCityList.shopTypeCount[0].multiple==0 && this.allCityList.shopTypeCount[0].single==0){
            selectColor = "#00083C"
          }else{
            selectColor = "#AC4ED3"
          }
        }else{
          selectColor = "#00083C"
        }
        return selectColor
     },
     //气球商店区分函数
     gradeBalloon(){
      //  console.log('气球数据',this.drawProvincialChange)
       if(this.drawProvincialChange != 'xianggang' && this.drawProvincialChange != 'aomen' && this.drawProvincialChange != 'taiwan'){
          let list = this.allCityList.cityList
          let balloon = []
          for(let i=0; i<list.length; i++){
            if(list[i].shopList.length > 0){
                for(let index=0; index<list[i].shopList.length;index++){
                  if(list[i].shopList[index].brandType == 0 ){
                    balloon.push({
                            name:list[i].shopList[index].shopName,
                            address:list[i].shopList[index].address,
                            value:[list[i].shopList[index].longitude,list[i].shopList[index].latitude],
                            symbol:`image://${yellowballoonIcon}`,
                            symbolSize: [16,20],
                            itemStyle:{
                              color:'#EEC947'
                            }
                    })
                    }else{
                    balloon.push({
                            name:list[i].shopList[index].shopName,
                            address:list[i].shopList[index].address,
                            value:[list[i].shopList[index].longitude,list[i].shopList[index].latitude],
                            symbol:`image://${greenballoonIcon}`,
                            symbolSize: [16,20],
                            itemStyle:{
                              color:'#2CC68B'
                            }
                    })
                  }
                }
            }
          }
          return balloon
       }else{
         let list = this.allCityList.shopList
         let balloon = []
         for(let i = 0 ;i<list.length;i++){
          if(list[i].brandType == 0 ){
            balloon.push({
                    name:list[i].shopName,
                    address:list[i].address,
                    value:[list[i].longitude,list[i].latitude],
                    symbol:`image://${yellowballoonIcon}`,
                    symbolSize: [16,20],
                    itemStyle:{
                      color:'#EEC947'
                    }
            })
            }else{
            balloon.push({
                    name:list[i].shopName,
                    address:list[i].address,
                    value:[list[i].longitude,list[i].latitude],
                    symbol:`image://${greenballoonIcon}`,
                    symbolSize: [16,20],
                    itemStyle:{
                      color:'#2CC68B'
                    }
            })
          }
         }
         return balloon
       }
     },
     
   }
}
</script>

<style scoped>
#provincialBox{
  height: 717px;
  width: 929px;
  /* width:1329px; */
  /* height:100%; */
  /* width:100%; */
  /* border:1px solid yellow; */
  /* background-color:yellow; */
}
</style>