<template>
  <div class="global">
    <router-link :to="{name:'home'}">
      <div class="global_world" :class="{nowPath:pathKey}">
        <p>全球</p>
      </div>
    </router-link>
    <router-link :to="{name:'succession'}">
      <div class="global_brand" :class="{nowBrand:pathKey}">
        <p>品牌</p>
      </div>
    </router-link>
  </div>
</template>
<script>


export default {
  name:'global',
  data(){
    return {
      pathKey:false,
    }
  },
  watch:{

  },
  mounted(){
    this.chenkPath()
  },
  methods:{
    chenkPath(){
      console.log('现在路由',this.$route.name)
      if(this.$route.name == 'succession'){
        this.pathKey = true
      }
    }
  }

};
</script>

<style scoped>
.global {
  position: absolute;
  /* top: 843px;
  left: 44px; */
  height: 212px;
  width: 214px;
  /* border:1px solid greenyellow; */
}
.global_world {
  height: 120px;
  width: 214px;
  background-image: url(../assets/images/global.png);
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  /* border:1px solid gold; */
}
.nowPath{
  height: 120px;
  width: 214px;
  background-image: url(../assets/images/brand.png);
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
}
.global_world p {
  color: rgba(255, 255, 255, 1);
  font-size: 36px;
  font-weight: 400;
  line-height: 38px;
  padding-left: 74px;
  padding-top: 46px;
  /* margin-left:74px;
  margin-top:46px; */
}
.global_brand {
  box-sizing: border-box;
  height: 120px;
  width: 214px;
  background-image: url(../assets/images/brand.png);
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  top: 92px;
  left: 0;
}
.nowBrand{
  box-sizing: border-box;
  height: 120px;
  width: 214px;
  background-image: url(../assets/images/global.png);
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  top: 92px;
  left: 0;
}
.global_brand p {
  color: rgba(255, 255, 255, 1);
  font-size: 36px;
  font-weight: 400;
  line-height: 38px;
  padding-left: 74px;
  padding-top: 46px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(51, 216, 250, 1) 100%
  );
  -webkit-background-clip: text;
  color: transparent;
}
</style>