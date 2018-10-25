<template>
  <v-content>
    <v-container
      fluid
      grid-list-md>
      <v-expansion-panel >
        <v-expansion-panel-content v-for="list in autoimportTagList" :key="list.groupId">
          <v-layout
            slot="header"
            align-center
            row
            spacer
          >
            <v-flex
              xs1
              sm1
              md1>
              <v-avatar
                slot="activator"
                size="36px"
              >
                <a :href="`https://www.flickr.com/groups/${list.groupId}`" target="_blank">
                  <img :src="list.group.icon" :alt="list.group.title">
                </a>
              </v-avatar>
            </v-flex>

            <v-flex
              no-wrap
              ellipsis
              xs6
              sm4>
              <strong v-html="list.group.title"/>
            </v-flex>

            <v-flex>
              <v-chip
                v-for="tag in list.tags"
                :key="tag"
                label
                small>
                {{ tag }}
              </v-chip>
            </v-flex>
          </v-layout>
          <v-card>
            <v-card-text>
              <ul>
                <li>Pool count: {{ list.group.poolCount }}</li>
                <li>Members: {{ list.group.members }}</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </v-content>
</template>

<script>
import AUTOIMPORT_TAGS_LIST from '@/graphql/autoimportTagsList.gql'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    autoimportTagList: []
  }),
  computed: {
    ...mapGetters({ userId: 'user/userId' })
  },
  apollo: {
    autoimportTagList: {
      query: AUTOIMPORT_TAGS_LIST,
      variables() {
        return {
          userId: this.userId
        }
      },
      update: ({ autoimportTagList }) => autoimportTagList
    }
  }
}
</script>
