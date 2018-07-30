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

import Store from '../store'
import { Auth } from 'aws-amplify'

const AuthFilter = async (to, from, next) => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    Store.commit('user/setUser', user)
    const credentials = await Auth.currentCredentials().catch(err => err)
    Store.commit('user/setUserId', credentials.identityId)
    next()
  } catch (err) {
    Store.commit('user/setUser', null)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      next('/login')
    } else {
      next()
    }
  }
}

export default AuthFilter
