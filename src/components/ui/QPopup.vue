<template>
  <v-dialog
    v-model="dialogComputed"
    :persistent="hasItemsSelected"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    scrollable
    transition="dialog-bottom-transition"
    max-width="550px"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-btn icon @click.native="closePopUp">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
        <v-spacer />
        <v-flex :slot="showList ? 'extension' : false" class="pa-1">
          <q-filter
            v-if="dialogComputed"
            :placeholder="filterPlaceholder"
            @search="
              val => {
                filterWord = val.toLowerCase()
              }
            "
            @ctrlEnter="selectFiltered"
            @ctrlEsc="clearSelected"
          />
        </v-flex>
      </v-toolbar>

      <v-card-text v-if="showList" class="pa-0">
        <v-layout v-if="filteredData.length" wrap>
          <v-list
            :style="{
              width: '100%',
              'margin-bottom': hasItemsSelected ? '56px' : '0px'
            }"
            two-line
          >
            <v-subheader class="title">
              {{ listTitle }}
            </v-subheader>
            <transition-group name="whatsapp">
              <slot v-for="item in filteredData" :item="item" name="list">
                <v-list-item>
                  <v-list-item-content>
                    {{ item[itemText] }}
                  </v-list-item-content>
                </v-list-item>
              </slot>
            </transition-group>
          </v-list>
        </v-layout>
        <q-empty v-else-if="loading" class="py-12 my-12" loading />
        <v-layout v-else class="grey lighten-2">
          <v-flex class="text-center headline py-12 my-12">
            {{ noDataText }}
          </v-flex>
        </v-layout>
      </v-card-text>
      <slot v-else :selectedData="selectedData" name="save">
        Data could not be saved.
      </slot>
      <transition name="footer">
        <v-toolbar v-show="hasItemsSelected" color="primary" style="position: absolute; bottom:0">
          <div style="overflow: hidden;" class="text-truncate mx-4">
            {{ selectedDataList }}
          </div>
          <v-fab-transition>
            <v-btn
              v-show="hasItemsSelected"
              :disabled="!showList"
              absolute
              top
              right
              fab
              color="primary lighten-2"
              @click="showList = false"
            >
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
  import QEmpty from './QEmpty'

  export default {
    name: 'QPopup',
    components: { QFilter, QEmpty },
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
        default: 'Popup'
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
        showList: true
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
          // this.clearSelected()
          this.showList = true
        }
      }
    },
    methods: {
      closePopUp() {
        this.$emit('close')
        setTimeout(() => {
          this.clearSelected()
        }, 1000)
      },
      selectFiltered() {
        if (this.filterWord === '') {
          return
        }
        this.filteredData.forEach(item => {
          if (!item.alreadyInGroup && item.throttleMode !== 'disabled') item.selected = true
        })
      },
      clearSelected() {
        this.filterWord = ''
        this.data.forEach(item => (item.selected = false))
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
