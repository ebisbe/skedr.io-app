<template>

    <form class="form-signin" @submit.prevent="handle">
        <h2 class="form-signin-heading">Please sign in</h2>

        <label for="inputEmail" >Email address</label>
        <input type="email" v-model="username"
               id="inputEmail"
               class="form-control"
               placeholder="Email address"
               required autofocus>

        <label for="inputPassword" >Password</label>
        <input type="password" v-model="password"
               id="inputPassword" class="form-control" placeholder="Password" required>

        <div class="checkbox">
            <label>
                <input type="checkbox" value="remember-me"> Remember me
            </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    </form>
</template>
<script>
  import { login } from '../libs/awsLib'

  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async handle () {
        try {
          this.$store.state.token = await login(this.username, this.password)
          localStorage.setItem('token', this.$store.state.token)
          this.$router.push({name: 'Group'})
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
<style>
    .form-signin {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }
</style>