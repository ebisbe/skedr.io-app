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
                        <h2 class="headline">Share in flickr <strong>just</strong> once each photo</h2>
                        <span class="subheading">We know it's hard to track which photo couldn't be added due to group restrictions. If it fails we will rember next day to add it for you, for every photo and group it missed</span>
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
                                        <br> You can share a single photo directly. It's even faster!
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
                                        All photos that can't be added due to group restriccions <br>will be scheduled. You will don't need to try it again next day or week.
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

    </v-content>
</template>
<script>
  export default {
    name: 'Home'
  }
</script>
