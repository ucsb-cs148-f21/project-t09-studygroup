<template>
  <div class="adminpanel">
    <h1>Admin Panel</h1>
    <b-button block variant="primary" @click="getClasses()">Refresh Quarter
    </b-button>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  methods: {
    getClasses(){
    axios.post('http://localhost:8082/study-group-148/us-central1/widgets/add-recent-classes')
    },
  },

}
</script>

