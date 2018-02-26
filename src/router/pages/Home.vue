<template>
  <v-content>
    <section>
      <v-parallax
        src="/static/img/weat_field.jpg"
        alt="Background: Weat field with bokeh."
        height="600">
        <v-layout
          column
          align-center
          justify-center
          class="white--text"
        >
          <h1 class="white--text mb-2 display-1 text-xs-center">Autoimport and autosked for Flickr groups</h1>
          <div class="subheading mb-3 text-xs-center">
            Spend less time sharing photos, go out to take more
          </div>
          <div>
            <v-tooltip top>
              <v-btn
                dark
                large
                class="primary lighten-1 mt-5"
                :to="{ name: 'Signup' }"
                slot="activator">
                Sign Up
              </v-btn>
              <span>Requires Flickr account</span>
            </v-tooltip>
            <v-btn
              dark
              large
              class="primary lighten-3 mt-5"
              :to="{ name: 'Login' }"
              slot="activator">
              Log In
            </v-btn>
          </div>
        </v-layout>
      </v-parallax>
    </section>
    <section>
      <v-layout
        column
        wrap
        align-center
      >
        <v-jumbotron
          src="/static/img/material2.jpg"
          gradient="to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)">
          <v-container fill-height>
            <v-layout align-center>
              <v-flex>
                <h3 class="display-2">Share in Flickr <strong>just</strong> once each photo</h3>
                <span class="subheading">We know it's hard to track which photo couldn't be added due to group restrictions. If it fails we will rember next day to add it for you, for every photo and group it missed</span>
                <v-divider class="my-3"/>
                <div class="title mb-3">Check out how it works!</div>
                <v-btn
                  large
                  color="primary"
                  class="mx-0"
                  href="#how-it-works">Read more</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-jumbotron>
      </v-layout>
    </section>
    <a id="how-it-works"/>
    <section>
      <v-layout
        column
        wrap
        class="my-5">
        <v-flex xs12>
          <h2 class="text-xs-center">How it works?</h2>
          <v-container grid-list-xl>
            <v-layout
              row
              wrap
              align-center>
              <v-flex
                xs12
                md4>
                <v-card>
                  <v-card-media
                    class="white--text"
                    :height="height"
                    src="https://c1.staticflickr.com/5/4681/39475349062_10aa876c0e_c.jpg"
                    alt="Among all your photos you can choose to create a pool or sked them directly"
                  />
                  <v-card-title>
                    <div>
                      <h2><v-icon color="secondary">add_to_photos</v-icon>&nbsp;Creating the pool</h2>
                      Find all your photos that you want to share. Add them to your
                      virtual pool. You can share a single photo directly. It's even faster!
                    </div>
                  </v-card-title>
                </v-card>
              </v-flex>
              <v-flex
                xs12
                md4>
                <v-card>
                  <v-card-media
                    class="white--text"
                    :height="height"
                    src="https://c1.staticflickr.com/5/4647/39475348792_94cee1a4de_c.jpg"
                    alt="Filter through your followed groups. Add photos to them."
                  />
                  <v-card-title>
                    <div>
                      <h2><v-icon color="secondary">share</v-icon>&nbsp;Sharing to groups</h2>
                      Filter through your followed groups. Choose one, two or all of them. With
                      <strong>one click</strong> add the pool to the selected groups.
                    </div>
                  </v-card-title>
                </v-card>
              </v-flex>
              <v-flex
                xs12
                md4>
                <v-card>
                  <v-card-media
                    class="white--text"
                    :height="height"
                    src="https://c1.staticflickr.com/5/4739/39475349342_09bc60e943_c.jpg"
                    alt="All photos that can't be added will be skeded."
                  />
                  <v-card-title>
                    <div>
                      <h2><v-icon color="secondary">access_time</v-icon>&nbsp;Autoschedule photos</h2>
                      All photos that can't be added due to group restriccions
                      will be scheduled. You will don't need to try it again next day or week.
                    </div>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>

    <section>
      <v-parallax
        src="/static/img/hero.jpeg"
        alt="Background: Sea shoreline"
        height="380">
        <v-layout
          column
          align-center
          justify-center>
          <div class="headline white--text mb-3 text-xs-center">Improve your profile</div>
          <em>Sharing photos to more groups will make your photos more visible at Flickr. You will gain more
          views and favs, followers too!
          </em>
          <v-tooltip top>
            <v-btn
              large
              class="mt-5"
              color="primary"
              :to="{ name: 'Signup' }"
              slot="activator"
            >
              Sign me in!
            </v-btn>
            <span>Requires Flickr account</span>
          </v-tooltip>
        </v-layout>
      </v-parallax>
    </section>
  </v-content>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      height: 300
    }
  }
}
</script>
