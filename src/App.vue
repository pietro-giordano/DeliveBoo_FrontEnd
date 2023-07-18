<script>
export default ({
  async mounted() {
   await this.$store.commit('initialiseStore')
  },
})
</script>

<template>
    
<router-view/>
  
</template>


<style lang="scss">

@import './styles/main';


</style>
