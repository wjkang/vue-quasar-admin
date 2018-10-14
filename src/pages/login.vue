<template>
  <div class="index">
    <div id="indexLizi">
    </div>
    <div class="full-height row justify-center">
      <div class="column justify-center" style="width:300px">
        <div style="text-align:left">
          <!-- <q-field icon="account_circle" :error="$v.form.username.$error" error-label="Oops, we got an error.">
            <q-input v-model="form.username" :float-label="$t('Please input Username')" />
          </q-field> -->
          <q-input dark type="text" v-model="form.username" :float-label="$t('Username')" clearable :error="$t($v.form.username.$error)" :before="[{icon: 'account_circle'}]" autocomplete="new-password" />

          <q-input dark type="password" v-model="form.password" :float-label="$t('Password')" clearable :error="$t($v.form.password.$error)" :before="[{icon: 'vpn_key'}]" autocomplete="new-password" />
        </div>
        <div class="row justify-around q-mt-md">
          <q-btn color="primary" :loading="loading" @click="submit">
            {{$t('Login')}}
            <span slot="loading">
              <q-spinner-hourglass class="on-left" /> {{$t('Loading')}}...
            </span>
          </q-btn>
          <q-btn color="negative" @click="clear">{{$t('Reset')}}</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import THREE from "../libs/three/three";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123"
      },
      loading: false
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required }
    }
  },
  methods: {
    liziInit() {
      var SCREEN_WIDTH = window.innerWidth;
      var SCREEN_HEIGHT = window.innerHeight;
      var SEPARATION = 90;
      var AMOUNTX = 50;
      var AMOUNTY = 50;
      var container;
      var particles, particle;
      var count;
      var camera;
      var scene;
      var renderer;
      var mouseX = 0;
      var mouseY = 0;
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;
      init();
      this.interval = setInterval(loop, 1000 / 40);
      function init() {
        container = document.createElement("div");
        container.style.position = "relative";
        container.style.top = "200px";
        document.getElementById("indexLizi").appendChild(container);
        camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
        camera.position.z = 1000;
        scene = new THREE.Scene();
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        particles = new Array();
        var i = 0;
        var material = new THREE.ParticleCircleMaterial(0x097bdb, 1);
        for (var ix = 0; ix < AMOUNTX; ix++) {
          for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++] = new THREE.Particle(material);
            particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2;
            particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2;
            scene.add(particle);
          }
        }
        count = 0;
        container.appendChild(renderer.domElement);
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        document.addEventListener("touchmove", onDocumentTouchMove, false);
      }
      var mousemovetimer = null;
      function onMouseMove(event) {
        window.clearTimeout(mousemovetimer);
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
        mousemovetimer = null;
      }
      function onDocumentMouseMove(event) {
        if (!mousemovetimer)
          mousemovetimer = window.setTimeout(onMouseMove, 50, event);
      }
      function onDocumentTouchMove(event) {
        if (event.touches.length == 1) {
          event.preventDefault();
          mouseX = event.touches[0].pageX - windowHalfX;
          mouseY = event.touches[0].pageY - windowHalfY;
        }
      }
      function loop() {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
        camera.position.y = 364;
        var i = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {
          for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y =
              Math.sin((ix + count) * 0.3) * 50 +
              Math.sin((iy + count) * 0.5) * 50;
            particle.scale.x = particle.scale.y =
              (Math.sin((ix + count) * 0.3) + 1) * 2 +
              (Math.sin((iy + count) * 0.5) + 1) * 2;
          }
        }
        renderer.render(scene, camera);
        count += 0.1;
      }
    },
    submit() {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        this.$q.notify(this.$t("Account password cannot be empty") + '!');
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("LoginByUserName", this.form)
        .then(() => {
          if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
          }
          this.loading = false;
          this.$router.push({
            name: "home_index"
          });
        })
        .catch(ex => {
          this.loading = false;
        });
    },
    clear() {
      this.form.username = "";
      this.form.password = "";
      this.$v.form.$reset();
    }
  },
  computed: {},
  mounted() {
    this.liziInit();
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
};
</script>

<style scoped>
#login-app {
  background: none;
}
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background-color: #141a48;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.index h1 {
  height: 150px;
}

.index h1 img {
  height: 100%;
}

.index h2 {
  color: #666;
  margin-bottom: 200px;
}

.index h2 p {
  margin: 0 0 50px;
}

.index .ivu-row-flex {
  height: 100%;
}

#indexLizi {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
}

p {
  color: white;
}
</style>
