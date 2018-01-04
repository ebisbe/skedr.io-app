<template>
    <v-content>
        <section>
            <v-parallax src="/static/img/weat_field.jpg" height="600">
                <v-layout
                        column
                        align-center
                        justify-center
                        class="white--text"
                >
                    <h1 class="white--text mb-2 display-1 text-xs-center">Improved Flickr groups workflow</h1>
                    <div class="subheading mb-3 text-xs-center">Spend less time sharing your photos, go out to take more
                    </div>
                    <v-btn dark large class="primary lighten-2 mt-5" :to="{ path: 'groups' }">
                        Improve my profile
                    </v-btn>
                </v-layout>
            </v-parallax>
        </section>

        <section>
            <v-layout
                    column
                    wrap
                    class="my-5"
                    align-center
            >
                <v-flex xs12 sm4 class="my-3">
                    <div class="text-xs-center">
                        <h2 class="headline">Share in flickr <strong>just</strong> once each photo</h2>
                        <span class="subheading">We know it's hard to track which photo could't be added due to group restriccions. If it fails we will rember next day to add it for your, for each photo and group it missed</span>
                    </div>
                </v-flex>
                <v-flex xs12>
                    <h2 class="text-xs-center">How it works?</h2>
                    <v-container grid-list-xl>
                        <v-layout row wrap align-center>
                            <v-flex xs12 md4>
                                <v-card class="elevation-0 transparent">
                                    <v-card-text class="text-xs-center">
                                        <v-icon x-large class="primary--text">add_to_photos</v-icon>
                                    </v-card-text>
                                    <v-card-title primary-title class="layout justify-center">
                                        <div class="headline text-xs-center">Creating the pool</div>
                                    </v-card-title>
                                    <v-card-text>Find all your photos that you want to share. <br>Add them to your virtual pool.
                                        <br> You can share a single photo directly. It's even faster for single photos!
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md4>
                                <v-card class="elevation-0 transparent">
                                    <v-card-text class="text-xs-center">
                                        <v-icon x-large class="primary--text">share</v-icon>
                                    </v-card-text>
                                    <v-card-title primary-title class="layout justify-center">
                                        <div class="headline">Sharing to groups</div>
                                    </v-card-title>
                                    <v-card-text>
                                        Filter through your followed groups. <br>Choose one, two or all of them. <br> With
                                        <strong>one click</strong> add the pool to the selected groups.
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md4>
                                <v-card class="elevation-0 transparent">
                                    <v-card-text class="text-xs-center">
                                        <v-icon x-large class="primary--text">access_time</v-icon>
                                    </v-card-text>
                                    <v-card-title primary-title class="layout justify-center">
                                        <div class="headline text-xs-center">Autoschedule photos</div>
                                    </v-card-title>
                                    <v-card-text>
                                        All photos that cannot be added due to group restriccions <br>will be scheduled. You will don't need to try it again next day or week.
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
            </v-layout>
        </section>

        <section>
            <v-parallax src="/static/img/section.jpeg" height="380">
                <v-layout column align-center justify-center>
                    <div class="headline white--text mb-3 text-xs-center">Improve your profile</div>
                    <em>Sharing photos to more groups will make your photos more visible at Flickr. You will gain more views and favs, followers too!
                    </em>
                    <v-btn large
                           class="mt-5"
                           color="primary"
                           :to="{ path: 'groups' }"
                    >
                        Sign me in!
                    </v-btn>
                </v-layout>
            </v-parallax>
        </section>

        <section>
            <v-container grid-list-xl>
                <v-layout row wrap justify-center class="my-5">
                    <v-flex xs12 sm4>
                        <v-card class="elevation-0 transparent">
                            <v-card-title primary-title class="layout justify-center">
                                <div class="headline">Company info</div>
                            </v-card-title>
                            <v-card-text>
                                Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.
                                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
                                egestas.
                                Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse
                                potenti.
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 sm4 offset-sm1>
                        <v-card class="elevation-0 transparent">
                            <v-card-title primary-title class="layout justify-center">
                                <div class="headline">Contact us</div>
                            </v-card-title>
                            <v-card-text>
                                Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.
                            </v-card-text>
                            <v-list class="transparent">
                                <v-list-tile>
                                    <v-list-tile-action>
                                        <v-icon class="blue--text text--lighten-2">phone</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-title>777-867-5309</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-action>
                                        <v-icon class="blue--text text--lighten-2">place</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-title>Chicago, US</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-action>
                                        <v-icon class="blue--text text--lighten-2">email</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-title>john@vuetifyjs.com</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </section>
    </v-content>
</template>
<script>
  export default {
    name: 'Home'
  }
</script>
