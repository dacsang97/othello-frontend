<template>
  <div id="app">
    <b-navbar fixed="top" type="dark" variant="dark">
      <b-navbar-brand href="#">Othello Game</b-navbar-brand>
      <b-nav class="d-flex justify-content-center">
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>
      </b-nav>
    </b-navbar>
    <router-view />
  </div>
</template>

<style lang="stylus">
body {
  padding: 70px;
  font-family: 'Nunito', sans-serif !important;

  &:before {
    z-index: -1;
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f6f6f6;
  }
}
</style>
