<template>
  <div class="adminpanel">
    <h1>Admin Panel</h1>
    <b-button
      block
      variant="primary"
      @click="getClasses()"
    >
      Refresh to Current Quarter
    </b-button>
    <div id="search-form">
      <b-form
        v-if="show"
        @submit="onSubmit"
      >
        <b-form-group
          id="input-group-1"
          label="Year:"
          label-for="input-1"
          description="Enter the year you want to refresh the course list to in the format YYYY."
        >
          <b-form-input
            id="input-1"
            v-model="form.year"
            placeholder="Input Year"
            required
          />
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="Quarter:"
          label-for="input-2"
          description="Enter the quarter you want to refresh the course list to (Fall, Winter, Spring, Summer)."
        >
          <b-form-input
            id="input-2"
            v-model="form.season"
            placeholder="Input Quarter"
            required
          />
        </b-form-group>
        <b-button
          id="submit"
          type="submit"
          variant="primary"
        >
          Refresh to Other Quarter
        </b-button>
      </b-form>
    </div>
  </div>
</template>
<script>

// import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';

export default {
  methods: {
    data() {
      return {
        form: {
          year: '',
          season: '',
          formattedQuarter: '',
        },
      };
    },
    getClasses() {
      console.log(this.$API_BASE);
      axiosInstance.post(`${this.$API_BASE}add-recent-classes`);
    },
    getClassesByQuarter(year, season) {
      console.log(this.$API_BASE);
      axiosInstance.post(`${this.$API_BASE}add-classes`, year, season);
    },
    async onSubmit(event) {
      event.preventDefault();
      this.getClassesByQuarter(this.year, this.season);
    },
    getFormattedQuarter(year, season) {
      let formattedQuarter = year;
      if (season === 'Fall') {
        formattedQuarter += '4';
      } else if (season === 'Winter') {
        formattedQuarter += '1';
      } else if (season === 'Spring') {
        formattedQuarter += '2';
      } else if (season === 'Summer') {
        formattedQuarter += '3';
      }
      return formattedQuarter;
    },
  },

};
</script>
