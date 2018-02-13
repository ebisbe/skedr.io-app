<template>
  <v-dialog
    v-model="dialogComputed"
    :persistent="selectedData.length > 0"
    scrollable
    max-width="500px">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn
          icon
          @click.native="closePopUp">
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
      </v-toolbar>
      <div v-if="showList" class="pa-1">
        <q-filter
          :placeholder="filterPlaceholder"
          class="pa-1"
          @search="val => { filterWord = val.toLowerCase() }"
          @ctrlEnter="selectFiltered"
          @ctrlEsc="clearSelected"
        />
      </div>
      <v-card-text v-if="showList" class="pa-0">
        <v-layout wrap v-if="filteredData.length">
          <v-list two-line style="width: 100%;">
            <v-subheader v-html="listTitle" class="title"/>
            <transition-group name="whatsapp">
              <slot
                name="list"
                v-for="item in filteredData"
                :item="item">
                <v-list-tile>
                  <v-list-tile-content>
                    {{ item[itemText] }}
                  </v-list-tile-content>
                </v-list-tile>
              </slot>
            </transition-group>
          </v-list>
        </v-layout>
        <v-layout v-else class="grey lighten-2">
          <v-flex v-html="noDataText" class="text-xs-center headline py-5 my-5"/>
        </v-layout>
      </v-card-text>
      <slot
        v-else
        name="save"
        :selectedData="selectedData">
        Data could not be saved.
      </slot>
      <transition name="footer">
        <v-toolbar
          dark
          color="primary"
          v-show="selectedData.length">
          <div
            style="overflow: hidden; hieght: 12px;"
            class="ellipsis mx-3"
            v-html="selectedDataList"/>
          <v-fab-transition>
            <v-btn
              dark
              absolute
              top
              right
              fab
              :disabled="!showList"
              color="secondary"
              v-show="selectedData.length > 0"
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

export default {
  name: 'QPopup',
  components: { QFilter },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true
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
      return this.data.filter(item => item[this.itemText].toLowerCase().search(this.filterWord) >= 0)
    },
    selectedData() {
      return this.data.filter(item => item.selected === true)
    },
    selectedDataList() {
      return this.selectedData.map(item => item[this.itemText]).join(',&nbsp;')
    }
  },
  watch: {
    dialog(value) {
      if (value) {
        this.filterWord = ''
        this.clearSelected()
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
<style>
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
