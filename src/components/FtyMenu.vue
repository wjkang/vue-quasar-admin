<template>
    <div>
        <q-list v-show="!shrink" separator>
            <template v-for="menu in menuList" v-if="menu.leftMemu">
                <q-collapsible indent v-if="menu.children&&menu.children.length>0" :icon="menu.icon" :label="$t(menu.title)" :key="menu.name">
                    <template v-for="child in menu.children" v-if="child.leftMemu">
                        <q-collapsible v-if="child.children&&child.children.some(s=>{return s.leftMemu})" :key="child.name" :icon="child.icon" indent :label="$t(child.title)">
                            <template v-for="child1 in child.children" v-if="child1.leftMemu">
                                <q-item link :to="{ name: child1.name}" :key="child1.name">
                                    <q-item-side :icon="child1.icon" />
                                    <q-item-main>
                                        <q-item-tile v-ripple label>{{$t(child1.title)}}</q-item-tile>
                                    </q-item-main>
                                </q-item>
                            </template>
                        </q-collapsible>
                        <q-item v-else link :to="{ name: child.name}" :key="child.name">
                            <q-item-side :icon="child.icon" />
                            <q-item-main>
                                <q-item-tile v-ripple label>{{$t(child.title)}}</q-item-tile>
                            </q-item-main>
                        </q-item>
                    </template>
                </q-collapsible>
                <q-collapsible indent v-else :icon="menu.icon" :label="$t(menu.title)" :key="menu.name">
                    <q-item link :to="{ name: menu.name}">
                        <q-item-side :icon="menu.icon" />
                        <q-item-main>
                            <q-item-tile v-ripple label>{{$t(menu.title)}}</q-item-tile>
                        </q-item-main>
                    </q-item>
                </q-collapsible>
            </template>
        </q-list>
        <q-list v-show="shrink" separator>
            <template v-for="menu in menuList" v-if="menu.leftMemu">
                <q-item v-if="menu.children&&menu.children.length>0" :key="'shrink-'+menu.name" v-ripple>
                    <q-item-side :icon="menu.icon">
                        <q-popover anchor="top right" self="top left">
                            <q-list style="min-width: 100px">
                                <template v-for="child in menu.children" v-if="child.leftMemu">
                                    <q-item v-if="child.children&&child.children.some(s=>{return s.leftMemu}) >0" :key="'shrink-'+child.name" v-ripple>
                                        <q-item-side :icon="child.icon" />
                                        <q-item-main :label="$t(child.title)">
                                            <q-popover anchor="top right" self="top left">
                                                <q-list style="min-width: 100px">
                                                    <template v-for="child1 in child.children" v-if="child1.leftMemu">
                                                        <q-item link :to="{ name: child1.name}" :key="'shrink-'+child1.name" v-ripple>
                                                            <q-item-side :icon="child1.icon" />
                                                            <q-item-main :label="$t(child1.title)" />
                                                        </q-item>
                                                    </template>
                                                </q-list>
                                            </q-popover>
                                        </q-item-main>
                                    </q-item>
                                    <q-item v-else link :to="{ name: child.name}" :key="'shrink-'+child.name" v-ripple>
                                        <q-item-side :icon="child.icon" />
                                        <q-item-main :label="$t(child.title)" />
                                    </q-item>
                                </template>
                            </q-list>
                        </q-popover>
                    </q-item-side>
                </q-item>
                <q-item v-else :key="menu.name" v-ripple>
                    <q-item-side :icon="menu.icon">
                        <q-popover anchor="top right" self="top left">
                            <q-list style="min-width: 100px">
                                <q-item link :to="{ name: menu.name}">
                                    <q-item-side :icon="menu.icon" />
                                    <q-item-main :label="$t(menu.title)" />
                                </q-item>
                            </q-list>
                        </q-popover>
                    </q-item-side>
                </q-item>
            </template>
        </q-list>
    </div>
</template>

<script>
export default {
  name: "FtyMenu",
  props: {
    shrink: {
      type: Boolean,
      required: true
    },
    menuList: {
      type: Array,
      required: true
    }
  }
};
</script>

