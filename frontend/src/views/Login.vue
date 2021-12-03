<!--Entire file is cited from https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth-->

<template>
  <!-- <div> -->
  <div>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      fade
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide caption="Welcome to UCSB study group 😊!">
        <template #img>
          <img
            class="d-block img-fluid w-100"
            alt="image slot"
            width="480"
            height="1024"
            src="@/assets/lagoon.jpg"
          />
        </template>
      </b-carousel-slide>

      <b-carousel-slide
        caption="In our UCSB study group website, you can look for study partners
              in the class you enrolled in."
      >
        <template #img>
          <img
            class="d-block img-fluid w-100"
            alt="image slot"
            width="480"
            height="1024"
            src="@/assets/sea.jpg"
          />
        </template>
      </b-carousel-slide>

      <b-carousel-slide
        caption="Hope you have a wonderful study experience 🤩!"
      >
        <template #img>
          <img
            class="d-block img-fluid w-100"
            alt="image slot"
            width="480"
            height="1024"
            src="@/assets/night.jpg"
          />
        </template>
      </b-carousel-slide>
    </b-carousel>
    <div class="justify-content-center">
      <p>Please sign in with UCSB account.</p>
      <form>
        <div class="box-container">
          <SocialLogin />
        </div>
      </form>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import SocialLogin from "../components/SocialLogin.vue";

export default {
  name: "Login",
  components: {
    SocialLogin,
  },
};
</script>
