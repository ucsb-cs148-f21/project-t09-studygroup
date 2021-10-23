<template>
  <div id="search-form">
    <b-form @submit="onSubmit" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Course:"
        label-for="input-1"
        description="Enter the course id you are searching for (e.g. CMPSC 148)"
      >
        <b-form-input
          id="input-1"
          v-model="form.course"
          placeholder="Search Course"
          required
        ></b-form-input>
      </b-form-group>

      <b-button id="submit" type="submit" variant="primary">Submit</b-button>
    </b-form>
    <!--<b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>--->
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  data() {
    return {
      form: {
        course: '',
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
    },
  },
};
</script>

<style scoped>
#search-form {
  height: 100px;
  width: 30%;
  padding-left: 80px;
  padding-top: 60px;
}
#input-group-1 {
  padding-bottom: 20px;
}
</style>
