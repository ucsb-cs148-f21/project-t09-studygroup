<template>
  <div>
    <b-navbar
      toggleable="md"
      type="dark"
      variant="dark"
    >
      <b-navbar-brand>UCSB Study Group</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar-nav>
          <b-nav-item href="/home">
            Home
          </b-nav-item>
          <b-nav-item href="AdminPanel">
            AdminPanel
          </b-nav-item>
          <b-nav-item href="About">
            About
          </b-nav-item>
        </b-navbar-nav>

      <!-- Right aligned nav items -->
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>
