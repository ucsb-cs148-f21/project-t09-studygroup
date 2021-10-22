<template>
  <div class="adminpanel">
    <h1>Admin Panel</h1>
    <b-button block variant="primary">Refresh Quarter
        <b-button
            @click.native="getCourses(quarter)"
            variant="primary">
        </b-button>
    </b-button>
  </div>
</template>