<template>
  <v-dialog
    v-model="dialogComputed"
    :persistent="hasItemsSelected"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    scrollable
    transition="dialog-bottom-transition"
    max-width="500px">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click.native="closePopUp">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title v-html="toolbarTitle"/>
        <v-spacer/>
        <v-toolbar-items>
          <!-- <v-btn flat @click="dialog3 = !dialog3">
            <v-icon>add</v-icon> Add
          </v-btn>
          <v-dialog v-model="dialog3" max-width="500px">
            <v-card>
              <v-card-title>
                <span>Dialog 3</span>
              </v-card-title>
              <v-card-actions>
                <v-btn
                  color="primary"
                  flat
                  @click.stop="dialog3=false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
        </v-toolbar-items>
        <v-flex
          :slot="showList ? 'extension' : false"
          class="pa-1">
          <q-filter
            :placeholder="filterPlaceholder"
            @search="val => { filterWord = val.toLowerCase() }"
            @ctrlEnter="selectFiltered"
            @ctrlEsc="clearSelected"/>
        </v-flex>
      </v-toolbar>

      <v-card-text v-if="showList" class="pa-0">
        <v-layout v-if="filteredData.length" wrap>
          <v-list
            :style="{'width': '100%', 'margin-bottom': hasItemsSelected ? '56px' : '0px'}"
            two-line>
            <v-subheader class="title" v-html="listTitle"/>
            <transition-group name="whatsapp">
              <slot
                v-for="item in filteredData"
                :item="item"
                name="list">
                <v-list-tile>
                  <v-list-tile-content>
                    {{ item[itemText] }}
                  </v-list-tile-content>
                </v-list-tile>
              </slot>
            </transition-group>
          </v-list>
        </v-layout>
        <empty
          v-else-if="loading"
          class="py-5 my-5"
          loading/>
        <v-layout v-else class="grey lighten-2">
          <v-flex class="text-xs-center headline py-5 my-5" v-html="noDataText"/>
        </v-layout>
      </v-card-text>
      <slot
        v-else
        :selectedData="selectedData"
        name="save">
        Data could not be saved.
      </slot>
      <transition name="footer">
        <v-toolbar
          v-show="hasItemsSelected"
          dark
          color="primary"
          style="position: absolute; bottom:0">
          <div
            style="overflow: hidden; hieght: 12px;"
            class="ellipsis mx-3"
            v-html="selectedDataList"/>
          <v-fab-transition>
            <v-btn
              v-show="hasItemsSelected"
              :disabled="!showList"
              dark
              absolute
              top
              right
              fab
              color="secondary"
              @click="showList = false">
              <v-icon>send</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-toolbar>
      </transition>
    </v-card>
  </v-dialog>
</template>

<script>
import QFilter from './QFilter'
import Empty from './Empty'

export default {
  name: 'QPopup',
  components: { QFilter, Empty },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    toolbarTitle: {
      type: String,
      required: true
    },
    listTitle: {
      type: String,
      default: 'Data'
    },
    noDataText: {
      type: String,
      default: 'No data available'
    },
    filterPlaceholder: {
      type: String,
      default: 'Filter data'
    },
    itemText: {
      type: String,
      default: 'title'
    }
  },
  data() {
    return {
      filterWord: '',
      showList: true,
      dialog3: false
    }
  },
  computed: {
    dialogComputed: {
      set(value) {
        if (!value) {
          this.$emit('close')
        } else {
          this.dialog = value
        }
      },
      get() {
        return this.dialog
      }
    },
    filteredData() {
      return this.data.filter(item => {
        switch (this.filterWord) {
          case ':sel':
            return item.selected
          case ':inpool':
            return item.alreadyInGroup
          default:
            return item[this.itemText].toLowerCase().search(this.filterWord) >= 0
        }
      })
    },
    selectedData() {
      return this.data.filter(item => item.selected === true)
    },
    hasItemsSelected() {
      return this.selectedData.length > 0
    },
    selectedDataList() {
      return this.selectedData.map(item => item[this.itemText]).join(',&nbsp;')
    }
  },
  watch: {
    dialog(value) {
      if (value) {
        this.filterWord = ''
        //this.clearSelected()
        this.showList = true
      }
    }
  },
  methods: {
    closePopUp() {
      this.$emit('close')
    },
    selectFiltered() {
      if (this.filterWord === '') {
        return
      }
      this.filteredData.forEach(item => (item.selected = true))
    },
    clearSelected() {
      this.filteredData.forEach(item => (item.selected = false))
    }
  }
}
</script>
<style lang="css">
.selected {
  background: #f5f5f5;
}

.whatsapp-enter-active {
  transition: all 0.2s;
}

.whatsapp-leave-active {
  transition: all 0.2s;
}

.whatsapp-enter {
  opacity: 0;
  transform: translateY(-30px);
}

.whatsapp-leave-to {
  opacity: 0;
}
</style>
