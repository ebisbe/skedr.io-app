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
                    <img src="/static/img/hourglass.svg" alt="Vuetify.js" height="200">
                    <h1 class="white--text mb-2 display-1 text-xs-center">Qronos</h1>
                    <div class="subheading mb-3 text-xs-center">Take your time</div>
                    <v-btn dark large class="primary lighten-2 mt-5" :to="{ path: 'groups' }">
                        Get Started
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
                        <h2 class="headline">Just do it once!</h2>
                        <span class="subheading">Simply add one or more photos to one or more groups and forget the rest. You will get more views <v-icon>remove_red_eye</v-icon> and favs <v-icon>star</v-icon> in your photos, gaining followers in the way.
                </span>
                    </div>
                </v-flex>
                <v-flex xs12>
                    <v-container grid-list-xl>
                        <v-layout row wrap align-center>
                            <v-flex xs12 md4>
                                <v-card class="elevation-0 transparent">
                                    <v-card-text class="text-xs-center">
                                        <v-icon x-large class="primary--text">add_to_photos</v-icon>
                                    </v-card-text>
                                    <v-card-title primary-title class="layout justify-center">
                                        <div class="headline text-xs-center">Create a pool</div>
                                    </v-card-title>
                                    <v-card-text>Search all your photos that you want to add to the same groups. <br>Creating a
                                        virtual pool of images is so easy!
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md4>
                                <v-card class="elevation-0 transparent">
                                    <v-card-text class="text-xs-center">
                                        <v-icon x-large class="primary--text">share</v-icon>
                                    </v-card-text>
                                    <v-card-title primary-title class="layout justify-center">
                                        <div class="headline">Choose groups</div>
                                    </v-card-title>
                                    <v-card-text>
                                        Filter through your groups. <br>Select one, two or all of them. <br> With
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
                                        All photos that cannot be added will be scheduled for next days. Take your time!
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
                    <div class="headline white--text mb-3 text-xs-center">Improving your profile has never been so
                        easy!
                    </div>
                    <em>Kick-start your application today</em>
                    <v-btn large
                           class="mt-5"
                           color="primary"
                           :to="{ path: 'groups' }"
                    >
                        Get Started
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
