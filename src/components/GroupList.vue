<template>
    <section class="content">
        <h1>Group List</h1>
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Members</th>
                <th>Pool count</th>
                <th>Mode</th>
                <th>Remaining</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="group in groups">
                <td><img
                        :src="'http://farm'+group.iconfarm+'.staticflickr.com/'+group.iconserver+'/buddyicons/'+group.nsid+'.jpg'"
                        alt=""
                        class="rounded"
                ></td>
                <td>
                    <router-link :to="{ name: 'GroupView', params: { group_id: group.nsid }}" exact v-html="group.name">
                    </router-link>
                <td>{{group.members}}</td>
                <td>{{group.pool_count}}</td>
                <td>{{group.throttle.mode}}</td>
                <td>{{group.throttle.remaining}} / {{ group.throttle.count }}</td>
                <td>
                    <div class="btn-group btn-group-xs" role="group" aria-label="...">
                        <button type="button" class="btn btn-primary">Add</button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </section>
</template>
<script>
  export default {
    name: 'Group',
    data () {
      return {
        groups: []
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.axios
          .get('groups')
          .then((response) => {
            this.groups = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
</script>
