<template>
    <q-page padding class="docs-btn row justify-center">
        <q-tabs inverted color="secondary" align="left" no-pane-border>
            <q-tab default slot="title" icon="view_carousel" name="view" />
            <q-tab slot="title" icon="code" name="code" />
            <q-tab-pane name="view">
                <slot name="source"></slot>
            </q-tab-pane>
            <q-tab-pane name="code">
                <slot name="highlight"></slot>
            </q-tab-pane>
        </q-tabs>

    </q-page>

</template>

<script>
import "highlight.js/styles/github.css";
export default {};
</script>

<style scoped>
main {
  min-height:0px!important;
}
</style>
