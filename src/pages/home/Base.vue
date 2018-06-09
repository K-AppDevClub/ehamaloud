<template>
  <v-ons-navigator swipeable
    :page-stack="pageStack"
    @push-page="pageStack.push($event);"
    @pop-page="pageStack.pop();"
  ></v-ons-navigator>
</template>

<script>
import MainMenu from './MainMenu';
// import HomePage from './HomePage';
import Navbar from '../../components/navbar/Navbar';

export default {
  name: 'home-base',
  components: {
    Navbar,
  },
  data() {
    return {
      pageStack: [MainMenu]
    }
  },
};
</script>
