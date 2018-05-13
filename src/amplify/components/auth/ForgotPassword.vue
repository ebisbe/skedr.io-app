/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

<template>
  <div :style="theme.form">
    <h1 :style="theme.header">Forgot Password</h1>
    <div :style="theme.inputRow">
      <input
        :style="theme.input"
        v-model="username"
        placeholder="Username"
        autofocus >
    </div>
    <div :style="theme.inputRow">
      <input
        :style="theme.input"
        v-model="code"
        placeholder="Code" >
    </div>
    <div :style="theme.inputRow">
      <input
        :style="theme.input"
        v-model="password"
        type="password"
        placeholder="Password" >
    </div>
    <div :style="theme.actionRow">
      <button
        :style="theme.action"
        :disabled="!username"
        @click="send">Send Code</button>
      <button
        :style="theme.action"
        :disabled="!username || !code"
        @click="submit">Submit Code</button>
    </div>
    <div :style="theme.footer">
      <span :style="theme.footerLeft">
        <a :style="theme.link" @click="signIn">Back to Sign In</a>
      </span>
      &nbsp;
    </div>
    <div v-if="error" :style="theme.error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { Auth, Logger } from 'aws-amplify'
import AmplifyStore from '../../AmplifyStore'
import AmplifyTheme from '../../AmplifyTheme'

const logger = new Logger('ForgotPasswordComp')

export default {
  name: 'ForgotPassword',
  data() {
    return {
      username: '',
      code: '',
      password: '',
      error: '',
      theme: AmplifyTheme
    }
  },
  computed: {
    user() {
      return AmplifyStore.state.amplify.user
    }
  },
  methods: {
    send: function() {
      Auth.forgotPassword(this.username)
        .then(() => logger.debug('code resent'))
        .catch(err => this.setError(err))
    },
    submit: function() {
      Auth.forgotPasswordSubmit(this.username, this.code, this.password)
        .then(() => this.$router.push('/'))
        .catch(err => this.setError(err))
    },
    signIn: function() {
      this.$router.push('/auth/signIn')
    },
    setError: function(err) {
      this.error = err.message || err
    }
  }
}
</script>
