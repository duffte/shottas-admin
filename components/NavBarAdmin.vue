<template>
  <nav 
    id="nav" 
    class="navbar is-dark" 
    role="navigation" 
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link 
        to="/" 
        class="navbar-item">
        <img 
          src="~/assets/shottas_w.svg"
          width="150" 
          height="50">
      </router-link>
      <a 
        :class="{ 'is-active': showNav }" 
        role="button" 
        class="navbar-burger burger" 
        @click="showNav = !showNav">
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
      </a>
    </div>
    <div 
      id="navbarToggle" 
      :class="{ 'is-active': showNav }" 
      class="navbar-menu">
      <div class="navbar-start">
        <p class="navbar-item">
          <nuxt-link 
            to="/add/artikel" 
            class="button is-info">+ artikel</nuxt-link>
        </p>
       

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Danger Zone
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              <nuxt-link to="/defaults/artikel">Artikel</nuxt-link>
            </a>
            
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Edit Content
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              <nuxt-link to="/list/artikel">Artikel</nuxt-link>
            </a>
            
          </div>
        </div>       
      </div>
    </div> 
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    collections: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      showNav: false
    }
  }
}
</script>
