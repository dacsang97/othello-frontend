<template>
  <b-container>
    <b-row>
      <b-col md="8" offset-md="2">
        <h2>Hello {{ name }}</h2>
        <b-button block to="/game">SINGLE COMPUTER GAME</b-button>
        <b-button block>CREATE ROOM GAME</b-button>
        <b-button block>JOIN EXISTS ROOM</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['name']),
  },
}
</script>
