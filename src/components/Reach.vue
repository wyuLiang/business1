<template>
  <div class="reachBox">
    <ul>
      <li class="reach_after"  :class="{'textColor1':discColor1}">
        <div class="reach_after_disc" :class="{'activeColor1':discColor1}"></div>
        <span>已开发区域</span>
      </li>
      <li class="reach_after" :class="{'textColor2':discColor2}">
        <div class="reach_after_disc" :class="{'activeColor2':discColor2}"></div>
        <span>未开发区域</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data(){
    return {
      discColor1:true,
      discColor2:false,
    }
  },
  methods:{
      color1(){
        if(this.discColor1==false){
          this.discColor1=!this.discColor1
          this.discColor2=false
          console.log('discColor1',this.discColor1)
        }
      },
      color2(){
        if(this.discColor2==false){
          this.discColor2=!this.discColor2
          this.discColor1=false
          console.log('discColor2',this.discColor2)
        }
      }

  }
};
</script>

<style scoped>
.reachBox {
  /* background-color:saddlebrown; */
  width: 193px;
  height: 120px;
  font-size: 30px;
  font-weight: 400;
  color: rgba(229, 229, 229, 1);
  line-height: 31px;
}
.reach_after {
  height: 60px;
  width: 193px;
  /* border: 1px solid #fff */
}
.reach_after_disc{
  width:20px;
  height:20px;
  border-radius:50%;
  display:inline-block;
  margin-right:20px;
  border:1px solid rgba(43, 58, 124, 1);
  list-style-type:circle;
}
/* .reach_after:hover{
  color: rgba(51, 216, 250, 1);
} */
.textColor1{
  color: rgba(51, 216, 250, 1);
}
.textColor2{
  color: rgba(51, 216, 250, 1);
}
.activeColor1{
  background:rgba(51,216,250,1);
}
.activeColor2{
  background:rgba(51,216,250,1);
}
</style>