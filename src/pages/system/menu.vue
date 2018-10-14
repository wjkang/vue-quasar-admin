<template>
  <div class="row" style="padding:10px">
    <div class="col-4 shadow-6 padding-10">
      <q-scroll-area style="height: 580px;">
        <p class="caption" v-show="editingMenu.label">{{$t('Editing')}}
          <q-chip small> {{editingMenu.label}}</q-chip>
        </p>
        <div class="q-mb-sm">
          <q-btn size="sm" color="primary" @click="addMenu(1)" :label="$t('Add top menu')" />
          <q-btn v-if="selected" size="sm" color="red" @click="addMenu(2)" :label="$t('Add a submenu')" />
        </div>
        <q-tree :nodes="menuList" default-expand-all :selected.sync="selected" node-key="id" />
      </q-scroll-area>
    </div>

    <div class="col-7 shadow-6" style="margin-left:10px">
      <q-card inline class="fit">
        <q-card-title>
          <q-chip square small :v-html="'\'' + (tempMenu.id ? $t('Edit menu') : $t('Add menu')) + '\''"></q-chip>
          <q-icon slot="right" name="edit" />
        </q-card-title>
        <q-card-main style="height:80%">
          <q-field :count="15" :error="$v.tempMenu.name.$error" error-label="error">
            <q-input v-model="tempMenu.name" :float-label="$t('Name')" @blur="$v.tempMenu.name.$touch" />
          </q-field>
          <q-field :count="15" :error="$v.tempMenu.label.$error" error-label="error">
            <q-input v-model="tempMenu.label" :float-label="$t('Title')" @blur="$v.tempMenu.label.$touch" />
          </q-field>
          <q-field :count="20">
            <q-input v-model="tempMenu.functionCode" :float-label="$t('Authority code')" />
          </q-field>
          <q-field>
            <q-input v-model="tempMenu.sort" type="number" :float-label="$t('Sort')" />
          </q-field><br>
          <q-toggle v-model="tempMenu.leftMemu" :label="$t('Display on the left')" /><br/><br/>
          <q-toggle v-model="tempMenu.isLock" :label="$t('Lock')" /><br/><br/>
          <q-btn :icon="tempMenu.icon" class="bg-brown-5 text-white" :label="$t('Select icon')" @click="openIconModal" />
        </q-card-main>
        <q-card-separator />
        <q-card-actions align="end">
          <q-btn color="primary" @click="saveMenu">{{$t('Save')}}</q-btn>
          <q-btn color="red">{{$t('Cancel')}}</q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <q-modal v-model="iconModal" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn flat round dense @click="iconModal = false" icon="reply" />
          <q-toolbar-title>
            {{$t('Select icon')}}
          </q-toolbar-title>
        </q-toolbar>

        <q-toolbar slot="header">
          <q-search class="full-width" inverted v-model="searchIcon" />
        </q-toolbar>

        <q-toolbar slot="footer">
          <q-toolbar-title>
          </q-toolbar-title>
          <q-btn :disable="tempIcon==''" round @click="selectIcon">{{$t('Select')}}</q-btn>
          <q-btn round color="red" @click="iconModal = false">{{$t('Cancel')}}</q-btn>
        </q-toolbar>

        <div class="layout-padding">
          <div class="row">
            <div class="icon-view" v-for="icon in iconList" :key="icon.name" @click="tempIcon=icon.name">
              <q-icon :name="icon.name" size="40px" :color="icon.name==tempIcon?'primary':'grey-4'">
                <q-tooltip>{{$t(icon.title)}}</q-tooltip>
              </q-icon>
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import { getAllMenu, getIcons, saveMenu } from "@/service/system/menu";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  name: "fty-menu",

  data() {
    return {
      selected: 0,
      menuList: [],
      editingMenu: {},
      tempMenu: {
        id: 0,
        parentId: 0,
        label: "",
        name: "",
        path: "",
        icon: "",
        leftMemu: false,
        functionCode: "",
        isLock: false,
        sort: 0
      },
      iconModal: false,
      iconList: [
        {
          name: "3d_rotation",
          title: "3d rotation"
        },
        {
          name: "accessibility",
          title: "accessibility"
        },
        {
          name: "accessible",
          title: "accessible"
        },
        {
          name: "account_balance",
          title: "account balance"
        },
        {
          name: "account_balance_wallet",
          title: "account balance wallet"
        },
        {
          name: "account_box",
          title: "account box"
        },
        {
          name: "account_circle",
          title: "account circle"
        },
        {
          name: "add_shopping_cart",
          title: "add shopping cart"
        },
        {
          name: "alarm",
          title: "alarm"
        },
        {
          name: "alarm_add",
          title: "alarm add"
        },
        {
          name: "alarm_off",
          title: "alarm off"
        },
        {
          name: "alarm_on",
          title: "alarm on"
        },
        {
          name: "all_out",
          title: "all out"
        },
        {
          name: "android",
          title: "android"
        },
        {
          name: "announcement",
          title: "announcement"
        },
        {
          name: "aspect_ratio",
          title: "aspect ratio"
        },
        {
          name: "assessment",
          title: "assessment"
        },
        {
          name: "assignment",
          title: "assignment"
        },
        {
          name: "assignment_ind",
          title: "assignment ind"
        },
        {
          name: "assignment_late",
          title: "assignment late"
        },
        {
          name: "assignment_return",
          title: "assignment return"
        },
        {
          name: "assignment_returned",
          title: "assignment returned"
        },
        {
          name: "assignment_turned_in",
          title: "assignment turned in"
        },
        {
          name: "autorenew",
          title: "autorenew"
        },
        {
          name: "backup",
          title: "backup"
        },
        {
          name: "book",
          title: "book"
        },
        {
          name: "bookmark",
          title: "bookmark"
        },
        {
          name: "bookmark_border",
          title: "bookmark border"
        },
        {
          name: "bug_report",
          title: "bug report"
        },
        {
          name: "build",
          title: "build"
        },
        {
          name: "cached",
          title: "cached"
        },
        {
          name: "camera_enhance",
          title: "camera enhance"
        },
        {
          name: "card_giftcard",
          title: "card giftcard"
        },
        {
          name: "card_membership",
          title: "card membership"
        },
        {
          name: "card_travel",
          title: "card travel"
        },
        {
          name: "change_history",
          title: "change history"
        },
        {
          name: "check_circle",
          title: "check circle"
        },
        {
          name: "chrome_reader_mode",
          title: "chrome reader mode"
        },
        {
          name: "class",
          title: "class"
        },
        {
          name: "code",
          title: "code"
        },
        {
          name: "compare_arrows",
          title: "compare arrows"
        },
        {
          name: "copyright",
          title: "copyright"
        },
        {
          name: "credit_card",
          title: "credit card"
        },
        {
          name: "dashboard",
          title: "dashboard"
        },
        {
          name: "date_range",
          title: "date range"
        },
        {
          name: "delete",
          title: "delete"
        },
        {
          name: "delete_forever",
          title: "delete forever"
        },
        {
          name: "description",
          title: "description"
        },
        {
          name: "dns",
          title: "dns"
        },
        {
          name: "done",
          title: "done"
        },
        {
          name: "done_all",
          title: "done all"
        },
        {
          name: "donut_large",
          title: "donut large"
        },
        {
          name: "donut_small",
          title: "donut small"
        },
        {
          name: "eject",
          title: "eject"
        },
        {
          name: "euro_symbol",
          title: "euro symbol"
        },
        {
          name: "event",
          title: "event"
        },
        {
          name: "event_seat",
          title: "event seat"
        },
        {
          name: "exit_to_app",
          title: "exit to app"
        },
        {
          name: "explore",
          title: "explore"
        },
        {
          name: "extension",
          title: "extension"
        },
        {
          name: "face",
          title: "face"
        },
        {
          name: "favorite",
          title: "favorite"
        },
        {
          name: "favorite_border",
          title: "favorite border"
        },
        {
          name: "feedback",
          title: "feedback"
        },
        {
          name: "find_in_page",
          title: "find in page"
        },
        {
          name: "find_replace",
          title: "find replace"
        },
        {
          name: "fingerprint",
          title: "fingerprint"
        },
        {
          name: "flight_land",
          title: "flight land"
        },
        {
          name: "flight_takeoff",
          title: "flight takeoff"
        },
        {
          name: "flip_to_back",
          title: "flip to back"
        },
        {
          name: "flip_to_front",
          title: "flip to front"
        },
        {
          name: "g_translate",
          title: "g translate"
        },
        {
          name: "gavel",
          title: "gavel"
        },
        {
          name: "get_app",
          title: "get app"
        },
        {
          name: "gif",
          title: "gif"
        },
        {
          name: "grade",
          title: "grade"
        },
        {
          name: "group_work",
          title: "group work"
        },
        {
          name: "help",
          title: "help"
        },
        {
          name: "help_outline",
          title: "help outline"
        },
        {
          name: "highlight_off",
          title: "highlight off"
        },
        {
          name: "history",
          title: "history"
        },
        {
          name: "home",
          title: "home"
        },
        {
          name: "hourglass_empty",
          title: "hourglass empty"
        },
        {
          name: "hourglass_full",
          title: "hourglass full"
        },
        {
          name: "http",
          title: "http"
        },
        {
          name: "https",
          title: "https"
        },
        {
          name: "important_devices",
          title: "important devices"
        },
        {
          name: "info",
          title: "info"
        },
        {
          name: "info_outline",
          title: "info outline"
        },
        {
          name: "input",
          title: "input"
        },
        {
          name: "invert_colors",
          title: "invert colors"
        },
        {
          name: "label",
          title: "label"
        },
        {
          name: "label_outline",
          title: "label outline"
        },
        {
          name: "language",
          title: "language"
        },
        {
          name: "launch",
          title: "launch"
        },
        {
          name: "lightbulb_outline",
          title: "lightbulb outline"
        },
        {
          name: "line_style",
          title: "line style"
        },
        {
          name: "line_weight",
          title: "line weight"
        },
        {
          name: "list",
          title: "list"
        },
        {
          name: "lock",
          title: "lock"
        },
        {
          name: "lock_open",
          title: "lock open"
        },
        {
          name: "lock_outline",
          title: "lock outline"
        },
        {
          name: "loyalty",
          title: "loyalty"
        },
        {
          name: "markunread_mailbox",
          title: "markunread mailbox"
        },
        {
          name: "motorcycle",
          title: "motorcycle"
        },
        {
          name: "note_add",
          title: "note add"
        },
        {
          name: "offline_pin",
          title: "offline pin"
        },
        {
          name: "opacity",
          title: "opacity"
        },
        {
          name: "open_in_browser",
          title: "open in browser"
        },
        {
          name: "open_in_new",
          title: "open in new"
        },
        {
          name: "open_with",
          title: "open with"
        },
        {
          name: "pageview",
          title: "pageview"
        },
        {
          name: "pan_tool",
          title: "pan tool"
        },
        {
          name: "payment",
          title: "payment"
        },
        {
          name: "perm_camera_mic",
          title: "perm camera mic"
        },
        {
          name: "perm_contact_calendar",
          title: "perm contact calendar"
        },
        {
          name: "perm_data_setting",
          title: "perm data setting"
        },
        {
          name: "perm_device_information",
          title: "perm device information"
        },
        {
          name: "perm_identity",
          title: "perm identity"
        },
        {
          name: "perm_media",
          title: "perm media"
        },
        {
          name: "perm_phone_msg",
          title: "perm phone msg"
        },
        {
          name: "perm_scan_wifi",
          title: "perm scan wifi"
        },
        {
          name: "pets",
          title: "pets"
        },
        {
          name: "picture_in_picture",
          title: "picture in picture"
        },
        {
          name: "picture_in_picture_alt",
          title: "picture in picture alt"
        },
        {
          name: "play_for_work",
          title: "play for work"
        },
        {
          name: "polymer",
          title: "polymer"
        },
        {
          name: "power_settings_new",
          title: "power settings new"
        },
        {
          name: "pregnant_woman",
          title: "pregnant woman"
        },
        {
          name: "print",
          title: "print"
        },
        {
          name: "query_builder",
          title: "query builder"
        },
        {
          name: "question_answer",
          title: "question answer"
        },
        {
          name: "receipt",
          title: "receipt"
        },
        {
          name: "record_voice_over",
          title: "record voice over"
        },
        {
          name: "redeem",
          title: "redeem"
        },
        {
          name: "remove_shopping_cart",
          title: "remove shopping cart"
        },
        {
          name: "reorder",
          title: "reorder"
        },
        {
          name: "report_problem",
          title: "report problem"
        },
        {
          name: "restore",
          title: "restore"
        },
        {
          name: "restore_page",
          title: "restore page"
        },
        {
          name: "room",
          title: "room"
        },
        {
          name: "rounded_corner",
          title: "rounded corner"
        },
        {
          name: "rowing",
          title: "rowing"
        },
        {
          name: "schedule",
          title: "schedule"
        },
        {
          name: "search",
          title: "search"
        },
        {
          name: "settings",
          title: "settings"
        },
        {
          name: "settings_applications",
          title: "settings applications"
        },
        {
          name: "settings_backup_restore",
          title: "settings backup restore"
        },
        {
          name: "settings_bluetooth",
          title: "settings bluetooth"
        },
        {
          name: "settings_brightness",
          title: "settings brightness"
        },
        {
          name: "settings_cell",
          title: "settings cell"
        },
        {
          name: "settings_ethernet",
          title: "settings ethernet"
        },
        {
          name: "settings_input_antenna",
          title: "settings input antenna"
        },
        {
          name: "settings_input_component",
          title: "settings input component"
        },
        {
          name: "settings_input_composite",
          title: "settings input composite"
        },
        {
          name: "settings_input_hdmi",
          title: "settings input hdmi"
        },
        {
          name: "settings_input_svideo",
          title: "settings input svideo"
        },
        {
          name: "settings_overscan",
          title: "settings overscan"
        },
        {
          name: "settings_phone",
          title: "settings phone"
        },
        {
          name: "settings_power",
          title: "settings power"
        },
        {
          name: "settings_remote",
          title: "settings remote"
        },
        {
          name: "settings_voice",
          title: "settings voice"
        },
        {
          name: "shop",
          title: "shop"
        },
        {
          name: "shop_two",
          title: "shop two"
        },
        {
          name: "shopping_basket",
          title: "shopping basket"
        },
        {
          name: "shopping_cart",
          title: "shopping cart"
        },
        {
          name: "speaker_notes",
          title: "speaker notes"
        },
        {
          name: "speaker_notes_off",
          title: "speaker notes off"
        },
        {
          name: "spellcheck",
          title: "spellcheck"
        },
        {
          name: "star_rate",
          title: "star rate"
        },
        {
          name: "stars",
          title: "stars"
        },
        {
          name: "store",
          title: "store"
        },
        {
          name: "subject",
          title: "subject"
        },
        {
          name: "supervisor_account",
          title: "supervisor account"
        },
        {
          name: "swap_horiz",
          title: "swap horiz"
        },
        {
          name: "swap_vert",
          title: "swap vert"
        },
        {
          name: "swap_vertical_circle",
          title: "swap vertical circle"
        },
        {
          name: "system_update_alt",
          title: "system update alt"
        },
        {
          name: "tab",
          title: "tab"
        },
        {
          name: "tab_unselected",
          title: "tab unselected"
        },
        {
          name: "theaters",
          title: "theaters"
        },
        {
          name: "thumb_down",
          title: "thumb down"
        },
        {
          name: "thumb_up",
          title: "thumb up"
        },
        {
          name: "thumbs_up_down",
          title: "thumbs up down"
        },
        {
          name: "timeline",
          title: "timeline"
        },
        {
          name: "toc",
          title: "toc"
        },
        {
          name: "today",
          title: "today"
        },
        {
          name: "toll",
          title: "toll"
        },
        {
          name: "touch_app",
          title: "touch app"
        },
        {
          name: "track_changes",
          title: "track changes"
        },
        {
          name: "translate",
          title: "translate"
        },
        {
          name: "trending_down",
          title: "trending down"
        },
        {
          name: "trending_flat",
          title: "trending flat"
        },
        {
          name: "trending_up",
          title: "trending up"
        },
        {
          name: "turned_in",
          title: "turned in"
        },
        {
          name: "turned_in_not",
          title: "turned in not"
        },
        {
          name: "update",
          title: "update"
        },
        {
          name: "verified_user",
          title: "verified user"
        },
        {
          name: "view_agenda",
          title: "view agenda"
        },
        {
          name: "view_array",
          title: "view array"
        },
        {
          name: "view_carousel",
          title: "view carousel"
        },
        {
          name: "view_column",
          title: "view column"
        },
        {
          name: "view_day",
          title: "view day"
        },
        {
          name: "view_headline",
          title: "view headline"
        },
        {
          name: "view_list",
          title: "view list"
        },
        {
          name: "view_module",
          title: "view module"
        },
        {
          name: "view_quilt",
          title: "view quilt"
        },
        {
          name: "view_stream",
          title: "view stream"
        },
        {
          name: "view_week",
          title: "view week"
        },
        {
          name: "visibility",
          title: "visibility"
        },
        {
          name: "visibility_off",
          title: "visibility off"
        },
        {
          name: "watch_later",
          title: "watch later"
        },
        {
          name: "work",
          title: "work"
        },
        {
          name: "youtube_searched_for",
          title: "youtube searched for"
        },
        {
          name: "zoom_in",
          title: "zoom in"
        },
        {
          name: "zoom_out",
          title: "zoom out"
        },
        {
          name: "add_alert",
          title: "add alert"
        },
        {
          name: "error",
          title: "error"
        },
        {
          name: "error_outline",
          title: "error outline"
        },
        {
          name: "warning",
          title: "warning"
        },
        {
          name: "add_to_queue",
          title: "add to queue"
        },
        {
          name: "airplay",
          title: "airplay"
        },
        {
          name: "album",
          title: "album"
        },
        {
          name: "art_track",
          title: "art track"
        },
        {
          name: "av_timer",
          title: "av timer"
        },
        {
          name: "branding_watermark",
          title: "branding watermark"
        },
        {
          name: "call_to_action",
          title: "call to action"
        },
        {
          name: "closed_caption",
          title: "closed caption"
        },
        {
          name: "equalizer",
          title: "equalizer"
        },
        {
          name: "explicit",
          title: "explicit"
        },
        {
          name: "fast_forward",
          title: "fast forward"
        },
        {
          name: "fast_rewind",
          title: "fast rewind"
        },
        {
          name: "featured_play_list",
          title: "featured play list"
        },
        {
          name: "featured_video",
          title: "featured video"
        },
        {
          name: "fiber_dvr",
          title: "fiber dvr"
        },
        {
          name: "fiber_manual_record",
          title: "fiber manual record"
        },
        {
          name: "fiber_new",
          title: "fiber new"
        },
        {
          name: "fiber_pin",
          title: "fiber pin"
        },
        {
          name: "fiber_smart_record",
          title: "fiber smart record"
        },
        {
          name: "forward_10",
          title: "forward 10"
        },
        {
          name: "forward_30",
          title: "forward 30"
        },
        {
          name: "forward_5",
          title: "forward 5"
        },
        {
          name: "games",
          title: "games"
        },
        {
          name: "hd",
          title: "hd"
        },
        {
          name: "hearing",
          title: "hearing"
        },
        {
          name: "high_quality",
          title: "high quality"
        },
        {
          name: "library_add",
          title: "library add"
        },
        {
          name: "library_books",
          title: "library books"
        },
        {
          name: "library_music",
          title: "library music"
        },
        {
          name: "loop",
          title: "loop"
        },
        {
          name: "mic",
          title: "mic"
        },
        {
          name: "mic_none",
          title: "mic none"
        },
        {
          name: "mic_off",
          title: "mic off"
        },
        {
          name: "movie",
          title: "movie"
        },
        {
          name: "music_video",
          title: "music video"
        },
        {
          name: "new_releases",
          title: "new releases"
        },
        {
          name: "not_interested",
          title: "not interested"
        },
        {
          name: "note",
          title: "note"
        },
        {
          name: "pause",
          title: "pause"
        },
        {
          name: "pause_circle_filled",
          title: "pause circle filled"
        },
        {
          name: "pause_circle_outline",
          title: "pause circle outline"
        },
        {
          name: "play_arrow",
          title: "play arrow"
        },
        {
          name: "play_circle_filled",
          title: "play circle filled"
        },
        {
          name: "play_circle_outline",
          title: "play circle outline"
        },
        {
          name: "playlist_add",
          title: "playlist add"
        },
        {
          name: "playlist_add_check",
          title: "playlist add check"
        },
        {
          name: "playlist_play",
          title: "playlist play"
        },
        {
          name: "queue",
          title: "queue"
        },
        {
          name: "queue_music",
          title: "queue music"
        },
        {
          name: "queue_play_next",
          title: "queue play next"
        },
        {
          name: "radio",
          title: "radio"
        },
        {
          name: "recent_actors",
          title: "recent actors"
        },
        {
          name: "remove_from_queue",
          title: "remove from queue"
        },
        {
          name: "repeat",
          title: "repeat"
        },
        {
          name: "repeat_one",
          title: "repeat one"
        },
        {
          name: "replay",
          title: "replay"
        },
        {
          name: "replay_10",
          title: "replay 10"
        },
        {
          name: "replay_30",
          title: "replay 30"
        },
        {
          name: "replay_5",
          title: "replay 5"
        },
        {
          name: "shuffle",
          title: "shuffle"
        },
        {
          name: "skip_next",
          title: "skip next"
        },
        {
          name: "skip_previous",
          title: "skip previous"
        },
        {
          name: "slow_motion_video",
          title: "slow motion video"
        },
        {
          name: "snooze",
          title: "snooze"
        },
        {
          name: "sort_by_alpha",
          title: "sort by alpha"
        },
        {
          name: "stop",
          title: "stop"
        },
        {
          name: "subscriptions",
          title: "subscriptions"
        },
        {
          name: "subtitles",
          title: "subtitles"
        },
        {
          name: "surround_sound",
          title: "surround sound"
        },
        {
          name: "video_call",
          title: "video call"
        },
        {
          name: "video_label",
          title: "video label"
        },
        {
          name: "video_library",
          title: "video library"
        },
        {
          name: "videocam",
          title: "videocam"
        },
        {
          name: "videocam_off",
          title: "videocam off"
        },
        {
          name: "volume_down",
          title: "volume down"
        },
        {
          name: "volume_mute",
          title: "volume mute"
        },
        {
          name: "volume_off",
          title: "volume off"
        },
        {
          name: "volume_up",
          title: "volume up"
        },
        {
          name: "web",
          title: "web"
        },
        {
          name: "web_asset",
          title: "web asset"
        },
        {
          name: "business",
          title: "business"
        },
        {
          name: "call",
          title: "call"
        },
        {
          name: "call_end",
          title: "call end"
        },
        {
          name: "call_made",
          title: "call made"
        },
        {
          name: "call_merge",
          title: "call merge"
        },
        {
          name: "call_missed",
          title: "call missed"
        },
        {
          name: "call_missed_outgoing",
          title: "call missed outgoing"
        },
        {
          name: "call_received",
          title: "call received"
        },
        {
          name: "call_split",
          title: "call split"
        },
        {
          name: "chat",
          title: "chat"
        },
        {
          name: "chat_bubble",
          title: "chat bubble"
        },
        {
          name: "chat_bubble_outline",
          title: "chat bubble outline"
        },
        {
          name: "clear_all",
          title: "clear all"
        },
        {
          name: "comment",
          title: "comment"
        },
        {
          name: "contact_mail",
          title: "contact mail"
        },
        {
          name: "contact_phone",
          title: "contact phone"
        },
        {
          name: "contacts",
          title: "contacts"
        },
        {
          name: "dialer_sip",
          title: "dialer sip"
        },
        {
          name: "dialpad",
          title: "dialpad"
        },
        {
          name: "email",
          title: "email"
        },
        {
          name: "forum",
          title: "forum"
        },
        {
          name: "import_contacts",
          title: "import contacts"
        },
        {
          name: "import_export",
          title: "import export"
        },
        {
          name: "invert_colors_off",
          title: "invert colors off"
        },
        {
          name: "live_help",
          title: "live help"
        },
        {
          name: "location_off",
          title: "location off"
        },
        {
          name: "location_on",
          title: "location on"
        },
        {
          name: "mail_outline",
          title: "mail outline"
        },
        {
          name: "message",
          title: "message"
        },
        {
          name: "no_sim",
          title: "no sim"
        },
        {
          name: "phone",
          title: "phone"
        },
        {
          name: "phonelink_erase",
          title: "phonelink erase"
        },
        {
          name: "phonelink_lock",
          title: "phonelink lock"
        },
        {
          name: "phonelink_ring",
          title: "phonelink ring"
        },
        {
          name: "phonelink_setup",
          title: "phonelink setup"
        },
        {
          name: "portable_wifi_off",
          title: "portable wifi off"
        },
        {
          name: "present_to_all",
          title: "present to all"
        },
        {
          name: "ring_volume",
          title: "ring volume"
        },
        {
          name: "rss_feed",
          title: "rss feed"
        },
        {
          name: "screen_share",
          title: "screen share"
        },
        {
          name: "speaker_phone",
          title: "speaker phone"
        },
        {
          name: "stay_current_landscape",
          title: "stay current landscape"
        },
        {
          name: "stay_current_portrait",
          title: "stay current portrait"
        },
        {
          name: "stay_primary_landscape",
          title: "stay primary landscape"
        },
        {
          name: "stay_primary_portrait",
          title: "stay primary portrait"
        },
        {
          name: "stop_screen_share",
          title: "stop screen share"
        },
        {
          name: "swap_calls",
          title: "swap calls"
        },
        {
          name: "textsms",
          title: "textsms"
        },
        {
          name: "voicemail",
          title: "voicemail"
        },
        {
          name: "vpn_key",
          title: "vpn key"
        },
        {
          name: "add",
          title: "add"
        },
        {
          name: "add_box",
          title: "add box"
        },
        {
          name: "add_circle",
          title: "add circle"
        },
        {
          name: "add_circle_outline",
          title: "add circle outline"
        },
        {
          name: "archive",
          title: "archive"
        },
        {
          name: "backspace",
          title: "backspace"
        },
        {
          name: "block",
          title: "block"
        },
        {
          name: "clear",
          title: "clear"
        },
        {
          name: "content_copy",
          title: "content copy"
        },
        {
          name: "content_cut",
          title: "content cut"
        },
        {
          name: "content_paste",
          title: "content paste"
        },
        {
          name: "create",
          title: "create"
        },
        {
          name: "delete_sweep",
          title: "delete sweep"
        },
        {
          name: "drafts",
          title: "drafts"
        },
        {
          name: "filter_list",
          title: "filter list"
        },
        {
          name: "flag",
          title: "flag"
        },
        {
          name: "font_download",
          title: "font download"
        },
        {
          name: "forward",
          title: "forward"
        },
        {
          name: "gesture",
          title: "gesture"
        },
        {
          name: "inbox",
          title: "inbox"
        },
        {
          name: "link",
          title: "link"
        },
        {
          name: "low_priority",
          title: "low priority"
        },
        {
          name: "mail",
          title: "mail"
        },
        {
          name: "markunread",
          title: "markunread"
        },
        {
          name: "move_to_inbox",
          title: "move to inbox"
        },
        {
          name: "next_week",
          title: "next week"
        },
        {
          name: "redo",
          title: "redo"
        },
        {
          name: "remove",
          title: "remove"
        },
        {
          name: "remove_circle",
          title: "remove circle"
        },
        {
          name: "remove_circle_outline",
          title: "remove circle outline"
        },
        {
          name: "reply",
          title: "reply"
        },
        {
          name: "reply_all",
          title: "reply all"
        },
        {
          name: "report",
          title: "report"
        },
        {
          name: "save",
          title: "save"
        },
        {
          name: "select_all",
          title: "select all"
        },
        {
          name: "send",
          title: "send"
        },
        {
          name: "sort",
          title: "sort"
        },
        {
          name: "text_format",
          title: "text format"
        },
        {
          name: "unarchive",
          title: "unarchive"
        },
        {
          name: "undo",
          title: "undo"
        },
        {
          name: "weekend",
          title: "weekend"
        },
        {
          name: "access_alarm",
          title: "access alarm"
        },
        {
          name: "access_alarms",
          title: "access alarms"
        },
        {
          name: "access_time",
          title: "access time"
        },
        {
          name: "add_alarm",
          title: "add alarm"
        },
        {
          name: "airplanemode_active",
          title: "airplanemode active"
        },
        {
          name: "airplanemode_inactive",
          title: "airplanemode inactive"
        },
        {
          name: "battery_alert",
          title: "battery alert"
        },
        {
          name: "battery_charging_full",
          title: "battery charging full"
        },
        {
          name: "battery_full",
          title: "battery full"
        },
        {
          name: "battery_std",
          title: "battery std"
        },
        {
          name: "battery_unknown",
          title: "battery unknown"
        },
        {
          name: "bluetooth",
          title: "bluetooth"
        },
        {
          name: "bluetooth_connected",
          title: "bluetooth connected"
        },
        {
          name: "bluetooth_disabled",
          title: "bluetooth disabled"
        },
        {
          name: "bluetooth_searching",
          title: "bluetooth searching"
        },
        {
          name: "brightness_auto",
          title: "brightness auto"
        },
        {
          name: "brightness_high",
          title: "brightness high"
        },
        {
          name: "brightness_low",
          title: "brightness low"
        },
        {
          name: "brightness_medium",
          title: "brightness medium"
        },
        {
          name: "data_usage",
          title: "data usage"
        },
        {
          name: "developer_mode",
          title: "developer mode"
        },
        {
          name: "devices",
          title: "devices"
        },
        {
          name: "dvr",
          title: "dvr"
        },
        {
          name: "gps_fixed",
          title: "gps fixed"
        },
        {
          name: "gps_not_fixed",
          title: "gps not fixed"
        },
        {
          name: "gps_off",
          title: "gps off"
        },
        {
          name: "graphic_eq",
          title: "graphic eq"
        },
        {
          name: "location_disabled",
          title: "location disabled"
        },
        {
          name: "location_searching",
          title: "location searching"
        },
        {
          name: "network_cell",
          title: "network cell"
        },
        {
          name: "network_wifi",
          title: "network wifi"
        },
        {
          name: "nfc",
          title: "nfc"
        },
        {
          name: "screen_lock_landscape",
          title: "screen lock landscape"
        },
        {
          name: "screen_lock_portrait",
          title: "screen lock portrait"
        },
        {
          name: "screen_lock_rotation",
          title: "screen lock rotation"
        },
        {
          name: "screen_rotation",
          title: "screen rotation"
        },
        {
          name: "sd_storage",
          title: "sd storage"
        },
        {
          name: "settings_system_daydream",
          title: "settings system daydream"
        },
        {
          name: "signal_cellular_4_bar",
          title: "signal cellular 4 bar"
        },
        {
          name: "signal_cellular_connected_no_internet_4_bar",
          title: "signal cellular connected no internet 4 bar"
        },
        {
          name: "signal_cellular_no_sim",
          title: "signal cellular no sim"
        },
        {
          name: "signal_cellular_null",
          title: "signal cellular null"
        },
        {
          name: "signal_cellular_off",
          title: "signal cellular off"
        },
        {
          name: "signal_wifi_4_bar",
          title: "signal wifi 4 bar"
        },
        {
          name: "signal_wifi_4_bar_lock",
          title: "signal wifi 4 bar lock"
        },
        {
          name: "signal_wifi_off",
          title: "signal wifi off"
        },
        {
          name: "storage",
          title: "storage"
        },
        {
          name: "usb",
          title: "usb"
        },
        {
          name: "wallpaper",
          title: "wallpaper"
        },
        {
          name: "widgets",
          title: "widgets"
        },
        {
          name: "wifi_lock",
          title: "wifi lock"
        },
        {
          name: "wifi_tethering",
          title: "wifi tethering"
        },
        {
          name: "attach_file",
          title: "attach file"
        },
        {
          name: "attach_money",
          title: "attach money"
        },
        {
          name: "border_all",
          title: "border all"
        },
        {
          name: "border_bottom",
          title: "border bottom"
        },
        {
          name: "border_clear",
          title: "border clear"
        },
        {
          name: "border_color",
          title: "border color"
        },
        {
          name: "border_horizontal",
          title: "border horizontal"
        },
        {
          name: "border_inner",
          title: "border inner"
        },
        {
          name: "border_left",
          title: "border left"
        },
        {
          name: "border_outer",
          title: "border outer"
        },
        {
          name: "border_right",
          title: "border right"
        },
        {
          name: "border_style",
          title: "border style"
        },
        {
          name: "border_top",
          title: "border top"
        },
        {
          name: "border_vertical",
          title: "border vertical"
        },
        {
          name: "bubble_chart",
          title: "bubble chart"
        },
        {
          name: "drag_handle",
          title: "drag handle"
        },
        {
          name: "format_align_center",
          title: "format align center"
        },
        {
          name: "format_align_justify",
          title: "format align justify"
        },
        {
          name: "format_align_left",
          title: "format align left"
        },
        {
          name: "format_align_right",
          title: "format align right"
        },
        {
          name: "format_bold",
          title: "format bold"
        },
        {
          name: "format_clear",
          title: "format clear"
        },
        {
          name: "format_color_fill",
          title: "format color fill"
        },
        {
          name: "format_color_reset",
          title: "format color reset"
        },
        {
          name: "format_color_text",
          title: "format color text"
        },
        {
          name: "format_indent_decrease",
          title: "format indent decrease"
        },
        {
          name: "format_indent_increase",
          title: "format indent increase"
        },
        {
          name: "format_italic",
          title: "format italic"
        },
        {
          name: "format_line_spacing",
          title: "format line spacing"
        },
        {
          name: "format_list_bulleted",
          title: "format list bulleted"
        },
        {
          name: "format_list_numbered",
          title: "format list numbered"
        },
        {
          name: "format_paint",
          title: "format paint"
        },
        {
          name: "format_quote",
          title: "format quote"
        },
        {
          name: "format_shapes",
          title: "format shapes"
        },
        {
          name: "format_size",
          title: "format size"
        },
        {
          name: "format_strikethrough",
          title: "format strikethrough"
        },
        {
          name: "format_textdirection_l_to_r",
          title: "format textdirection l to r"
        },
        {
          name: "format_textdirection_r_to_l",
          title: "format textdirection r to l"
        },
        {
          name: "format_underlined",
          title: "format underlined"
        },
        {
          name: "functions",
          title: "functions"
        },
        {
          name: "highlight",
          title: "highlight"
        },
        {
          name: "insert_chart",
          title: "insert chart"
        },
        {
          name: "insert_comment",
          title: "insert comment"
        },
        {
          name: "insert_drive_file",
          title: "insert drive file"
        },
        {
          name: "insert_emoticon",
          title: "insert emoticon"
        },
        {
          name: "insert_invitation",
          title: "insert invitation"
        },
        {
          name: "insert_link",
          title: "insert link"
        },
        {
          name: "insert_photo",
          title: "insert photo"
        },
        {
          name: "linear_scale",
          title: "linear scale"
        },
        {
          name: "merge_type",
          title: "merge type"
        },
        {
          name: "mode_comment",
          title: "mode comment"
        },
        {
          name: "mode_edit",
          title: "mode edit"
        },
        {
          name: "monetization_on",
          title: "monetization on"
        },
        {
          name: "money_off",
          title: "money off"
        },
        {
          name: "multiline_chart",
          title: "multiline chart"
        },
        {
          name: "pie_chart",
          title: "pie chart"
        },
        {
          name: "pie_chart_outlined",
          title: "pie chart outlined"
        },
        {
          name: "publish",
          title: "publish"
        },
        {
          name: "short_text",
          title: "short text"
        },
        {
          name: "show_chart",
          title: "show chart"
        },
        {
          name: "space_bar",
          title: "space bar"
        },
        {
          name: "strikethrough_s",
          title: "strikethrough s"
        },
        {
          name: "text_fields",
          title: "text fields"
        },
        {
          name: "title",
          title: "title"
        },
        {
          name: "vertical_align_bottom",
          title: "vertical align bottom"
        },
        {
          name: "vertical_align_center",
          title: "vertical align center"
        },
        {
          name: "vertical_align_top",
          title: "vertical align top"
        },
        {
          name: "wrap_text",
          title: "wrap text"
        },
        {
          name: "attachment",
          title: "attachment"
        },
        {
          name: "cloud",
          title: "cloud"
        },
        {
          name: "cloud_circle",
          title: "cloud circle"
        },
        {
          name: "cloud_done",
          title: "cloud done"
        },
        {
          name: "cloud_download",
          title: "cloud download"
        },
        {
          name: "cloud_off",
          title: "cloud off"
        },
        {
          name: "cloud_queue",
          title: "cloud queue"
        },
        {
          name: "cloud_upload",
          title: "cloud upload"
        },
        {
          name: "create_new_folder",
          title: "create new folder"
        },
        {
          name: "file_download",
          title: "file download"
        },
        {
          name: "file_upload",
          title: "file upload"
        },
        {
          name: "folder",
          title: "folder"
        },
        {
          name: "folder_open",
          title: "folder open"
        },
        {
          name: "folder_shared",
          title: "folder shared"
        },
        {
          name: "cast",
          title: "cast"
        },
        {
          name: "cast_connected",
          title: "cast connected"
        },
        {
          name: "computer",
          title: "computer"
        },
        {
          name: "desktop_mac",
          title: "desktop mac"
        },
        {
          name: "desktop_windows",
          title: "desktop windows"
        },
        {
          name: "developer_board",
          title: "developer board"
        },
        {
          name: "device_hub",
          title: "device hub"
        },
        {
          name: "devices_other",
          title: "devices other"
        },
        {
          name: "dock",
          title: "dock"
        },
        {
          name: "gamepad",
          title: "gamepad"
        },
        {
          name: "headset",
          title: "headset"
        },
        {
          name: "headset_mic",
          title: "headset mic"
        },
        {
          name: "keyboard",
          title: "keyboard"
        },
        {
          name: "keyboard_arrow_down",
          title: "keyboard arrow down"
        },
        {
          name: "keyboard_arrow_left",
          title: "keyboard arrow left"
        },
        {
          name: "keyboard_arrow_right",
          title: "keyboard arrow right"
        },
        {
          name: "keyboard_arrow_up",
          title: "keyboard arrow up"
        },
        {
          name: "keyboard_backspace",
          title: "keyboard backspace"
        },
        {
          name: "keyboard_capslock",
          title: "keyboard capslock"
        },
        {
          name: "keyboard_hide",
          title: "keyboard hide"
        },
        {
          name: "keyboard_return",
          title: "keyboard return"
        },
        {
          name: "keyboard_tab",
          title: "keyboard tab"
        },
        {
          name: "keyboard_voice",
          title: "keyboard voice"
        },
        {
          name: "laptop",
          title: "laptop"
        },
        {
          name: "laptop_chromebook",
          title: "laptop chromebook"
        },
        {
          name: "laptop_mac",
          title: "laptop mac"
        },
        {
          name: "laptop_windows",
          title: "laptop windows"
        },
        {
          name: "memory",
          title: "memory"
        },
        {
          name: "mouse",
          title: "mouse"
        },
        {
          name: "phone_android",
          title: "phone android"
        },
        {
          name: "phone_iphone",
          title: "phone iphone"
        },
        {
          name: "phonelink",
          title: "phonelink"
        },
        {
          name: "phonelink_off",
          title: "phonelink off"
        },
        {
          name: "power_input",
          title: "power input"
        },
        {
          name: "router",
          title: "router"
        },
        {
          name: "scanner",
          title: "scanner"
        },
        {
          name: "security",
          title: "security"
        },
        {
          name: "sim_card",
          title: "sim card"
        },
        {
          name: "smartphone",
          title: "smartphone"
        },
        {
          name: "speaker",
          title: "speaker"
        },
        {
          name: "speaker_group",
          title: "speaker group"
        },
        {
          name: "tablet",
          title: "tablet"
        },
        {
          name: "tablet_android",
          title: "tablet android"
        },
        {
          name: "tablet_mac",
          title: "tablet mac"
        },
        {
          name: "toys",
          title: "toys"
        },
        {
          name: "tv",
          title: "tv"
        },
        {
          name: "videogame_asset",
          title: "videogame asset"
        },
        {
          name: "watch",
          title: "watch"
        },
        {
          name: "add_a_photo",
          title: "add a photo"
        },
        {
          name: "add_to_photos",
          title: "add to photos"
        },
        {
          name: "adjust",
          title: "adjust"
        },
        {
          name: "assistant",
          title: "assistant"
        },
        {
          name: "assistant_photo",
          title: "assistant photo"
        },
        {
          name: "audiotrack",
          title: "audiotrack"
        },
        {
          name: "blur_circular",
          title: "blur circular"
        },
        {
          name: "blur_linear",
          title: "blur linear"
        },
        {
          name: "blur_off",
          title: "blur off"
        },
        {
          name: "blur_on",
          title: "blur on"
        },
        {
          name: "brightness_1",
          title: "brightness 1"
        },
        {
          name: "brightness_2",
          title: "brightness 2"
        },
        {
          name: "brightness_3",
          title: "brightness 3"
        },
        {
          name: "brightness_4",
          title: "brightness 4"
        },
        {
          name: "brightness_5",
          title: "brightness 5"
        },
        {
          name: "brightness_6",
          title: "brightness 6"
        },
        {
          name: "brightness_7",
          title: "brightness 7"
        },
        {
          name: "broken_image",
          title: "broken image"
        },
        {
          name: "brush",
          title: "brush"
        },
        {
          name: "burst_mode",
          title: "burst mode"
        },
        {
          name: "camera",
          title: "camera"
        },
        {
          name: "camera_alt",
          title: "camera alt"
        },
        {
          name: "camera_front",
          title: "camera front"
        },
        {
          name: "camera_rear",
          title: "camera rear"
        },
        {
          name: "camera_roll",
          title: "camera roll"
        },
        {
          name: "center_focus_strong",
          title: "center focus strong"
        },
        {
          name: "center_focus_weak",
          title: "center focus weak"
        },
        {
          name: "collections",
          title: "collections"
        },
        {
          name: "collections_bookmark",
          title: "collections bookmark"
        },
        {
          name: "color_lens",
          title: "color lens"
        },
        {
          name: "colorize",
          title: "colorize"
        },
        {
          name: "compare",
          title: "compare"
        },
        {
          name: "control_point",
          title: "control point"
        },
        {
          name: "control_point_duplicate",
          title: "control point duplicate"
        },
        {
          name: "crop",
          title: "crop"
        },
        {
          name: "crop_16_9",
          title: "crop 16 9"
        },
        {
          name: "crop_3_2",
          title: "crop 3 2"
        },
        {
          name: "crop_5_4",
          title: "crop 5 4"
        },
        {
          name: "crop_7_5",
          title: "crop 7 5"
        },
        {
          name: "crop_din",
          title: "crop din"
        },
        {
          name: "crop_free",
          title: "crop free"
        },
        {
          name: "crop_landscape",
          title: "crop landscape"
        },
        {
          name: "crop_original",
          title: "crop original"
        },
        {
          name: "crop_portrait",
          title: "crop portrait"
        },
        {
          name: "crop_rotate",
          title: "crop rotate"
        },
        {
          name: "crop_square",
          title: "crop square"
        },
        {
          name: "dehaze",
          title: "dehaze"
        },
        {
          name: "details",
          title: "details"
        },
        {
          name: "edit",
          title: "edit"
        },
        {
          name: "exposure",
          title: "exposure"
        },
        {
          name: "exposure_neg_1",
          title: "exposure neg 1"
        },
        {
          name: "exposure_neg_2",
          title: "exposure neg 2"
        },
        {
          name: "exposure_plus_1",
          title: "exposure plus 1"
        },
        {
          name: "exposure_plus_2",
          title: "exposure plus 2"
        },
        {
          name: "exposure_zero",
          title: "exposure zero"
        },
        {
          name: "filter",
          title: "filter"
        },
        {
          name: "filter_1",
          title: "filter 1"
        },
        {
          name: "filter_2",
          title: "filter 2"
        },
        {
          name: "filter_3",
          title: "filter 3"
        },
        {
          name: "filter_4",
          title: "filter 4"
        },
        {
          name: "filter_5",
          title: "filter 5"
        },
        {
          name: "filter_6",
          title: "filter 6"
        },
        {
          name: "filter_7",
          title: "filter 7"
        },
        {
          name: "filter_8",
          title: "filter 8"
        },
        {
          name: "filter_9",
          title: "filter 9"
        },
        {
          name: "filter_9_plus",
          title: "filter 9 plus"
        },
        {
          name: "filter_b_and_w",
          title: "filter b and w"
        },
        {
          name: "filter_center_focus",
          title: "filter center focus"
        },
        {
          name: "filter_drama",
          title: "filter drama"
        },
        {
          name: "filter_frames",
          title: "filter frames"
        },
        {
          name: "filter_hdr",
          title: "filter hdr"
        },
        {
          name: "filter_none",
          title: "filter none"
        },
        {
          name: "filter_tilt_shift",
          title: "filter tilt shift"
        },
        {
          name: "filter_vintage",
          title: "filter vintage"
        },
        {
          name: "flare",
          title: "flare"
        },
        {
          name: "flash_auto",
          title: "flash auto"
        },
        {
          name: "flash_off",
          title: "flash off"
        },
        {
          name: "flash_on",
          title: "flash on"
        },
        {
          name: "flip",
          title: "flip"
        },
        {
          name: "gradient",
          title: "gradient"
        },
        {
          name: "grain",
          title: "grain"
        },
        {
          name: "grid_off",
          title: "grid off"
        },
        {
          name: "grid_on",
          title: "grid on"
        },
        {
          name: "hdr_off",
          title: "hdr off"
        },
        {
          name: "hdr_on",
          title: "hdr on"
        },
        {
          name: "hdr_strong",
          title: "hdr strong"
        },
        {
          name: "hdr_weak",
          title: "hdr weak"
        },
        {
          name: "healing",
          title: "healing"
        },
        {
          name: "image",
          title: "image"
        },
        {
          name: "image_aspect_ratio",
          title: "image aspect ratio"
        },
        {
          name: "iso",
          title: "iso"
        },
        {
          name: "landscape",
          title: "landscape"
        },
        {
          name: "leak_add",
          title: "leak add"
        },
        {
          name: "leak_remove",
          title: "leak remove"
        },
        {
          name: "lens",
          title: "lens"
        },
        {
          name: "linked_camera",
          title: "linked camera"
        },
        {
          name: "looks",
          title: "looks"
        },
        {
          name: "looks_3",
          title: "looks 3"
        },
        {
          name: "looks_4",
          title: "looks 4"
        },
        {
          name: "looks_5",
          title: "looks 5"
        },
        {
          name: "looks_6",
          title: "looks 6"
        },
        {
          name: "looks_one",
          title: "looks one"
        },
        {
          name: "looks_two",
          title: "looks two"
        },
        {
          name: "loupe",
          title: "loupe"
        },
        {
          name: "monochrome_photos",
          title: "monochrome photos"
        },
        {
          name: "movie_creation",
          title: "movie creation"
        },
        {
          name: "movie_filter",
          title: "movie filter"
        },
        {
          name: "music_note",
          title: "music note"
        },
        {
          name: "nature",
          title: "nature"
        },
        {
          name: "nature_people",
          title: "nature people"
        },
        {
          name: "navigate_before",
          title: "navigate before"
        },
        {
          name: "navigate_next",
          title: "navigate next"
        },
        {
          name: "palette",
          title: "palette"
        },
        {
          name: "panorama",
          title: "panorama"
        },
        {
          name: "panorama_fish_eye",
          title: "panorama fish eye"
        },
        {
          name: "panorama_horizontal",
          title: "panorama horizontal"
        },
        {
          name: "panorama_vertical",
          title: "panorama vertical"
        },
        {
          name: "panorama_wide_angle",
          title: "panorama wide angle"
        },
        {
          name: "photo",
          title: "photo"
        },
        {
          name: "photo_album",
          title: "photo album"
        },
        {
          name: "photo_camera",
          title: "photo camera"
        },
        {
          name: "photo_filter",
          title: "photo filter"
        },
        {
          name: "photo_library",
          title: "photo library"
        },
        {
          name: "photo_size_select_actual",
          title: "photo size select actual"
        },
        {
          name: "photo_size_select_large",
          title: "photo size select large"
        },
        {
          name: "photo_size_select_small",
          title: "photo size select small"
        },
        {
          name: "picture_as_pdf",
          title: "picture as pdf"
        },
        {
          name: "portrait",
          title: "portrait"
        },
        {
          name: "remove_red_eye",
          title: "remove red eye"
        },
        {
          name: "rotate_90_degrees_ccw",
          title: "rotate 90 degrees ccw"
        },
        {
          name: "rotate_left",
          title: "rotate left"
        },
        {
          name: "rotate_right",
          title: "rotate right"
        },
        {
          name: "slideshow",
          title: "slideshow"
        },
        {
          name: "straighten",
          title: "straighten"
        },
        {
          name: "style",
          title: "style"
        },
        {
          name: "switch_camera",
          title: "switch camera"
        },
        {
          name: "switch_video",
          title: "switch video"
        },
        {
          name: "tag_faces",
          title: "tag faces"
        },
        {
          name: "texture",
          title: "texture"
        },
        {
          name: "timelapse",
          title: "timelapse"
        },
        {
          name: "timer",
          title: "timer"
        },
        {
          name: "timer_10",
          title: "timer 10"
        },
        {
          name: "timer_3",
          title: "timer 3"
        },
        {
          name: "timer_off",
          title: "timer off"
        },
        {
          name: "tonality",
          title: "tonality"
        },
        {
          name: "transform",
          title: "transform"
        },
        {
          name: "tune",
          title: "tune"
        },
        {
          name: "view_comfy",
          title: "view comfy"
        },
        {
          name: "view_compact",
          title: "view compact"
        },
        {
          name: "vignette",
          title: "vignette"
        },
        {
          name: "wb_auto",
          title: "wb auto"
        },
        {
          name: "wb_cloudy",
          title: "wb cloudy"
        },
        {
          name: "wb_incandescent",
          title: "wb incandescent"
        },
        {
          name: "wb_iridescent",
          title: "wb iridescent"
        },
        {
          name: "wb_sunny",
          title: "wb sunny"
        },
        {
          name: "add_location",
          title: "add location"
        },
        {
          name: "beenhere",
          title: "beenhere"
        },
        {
          name: "directions",
          title: "directions"
        },
        {
          name: "directions_bike",
          title: "directions bike"
        },
        {
          name: "directions_boat",
          title: "directions boat"
        },
        {
          name: "directions_bus",
          title: "directions bus"
        },
        {
          name: "directions_car",
          title: "directions car"
        },
        {
          name: "directions_railway",
          title: "directions railway"
        },
        {
          name: "directions_run",
          title: "directions run"
        },
        {
          name: "directions_subway",
          title: "directions subway"
        },
        {
          name: "directions_transit",
          title: "directions transit"
        },
        {
          name: "directions_walk",
          title: "directions walk"
        },
        {
          name: "edit_location",
          title: "edit location"
        },
        {
          name: "ev_station",
          title: "ev station"
        },
        {
          name: "flight",
          title: "flight"
        },
        {
          name: "hotel",
          title: "hotel"
        },
        {
          name: "layers",
          title: "layers"
        },
        {
          name: "layers_clear",
          title: "layers clear"
        },
        {
          name: "local_activity",
          title: "local activity"
        },
        {
          name: "local_airport",
          title: "local airport"
        },
        {
          name: "local_atm",
          title: "local atm"
        },
        {
          name: "local_bar",
          title: "local bar"
        },
        {
          name: "local_cafe",
          title: "local cafe"
        },
        {
          name: "local_car_wash",
          title: "local car wash"
        },
        {
          name: "local_convenience_store",
          title: "local convenience store"
        },
        {
          name: "local_dining",
          title: "local dining"
        },
        {
          name: "local_drink",
          title: "local drink"
        },
        {
          name: "local_florist",
          title: "local florist"
        },
        {
          name: "local_gas_station",
          title: "local gas station"
        },
        {
          name: "local_grocery_store",
          title: "local grocery store"
        },
        {
          name: "local_hospital",
          title: "local hospital"
        },
        {
          name: "local_hotel",
          title: "local hotel"
        },
        {
          name: "local_laundry_service",
          title: "local laundry service"
        },
        {
          name: "local_library",
          title: "local library"
        },
        {
          name: "local_mall",
          title: "local mall"
        },
        {
          name: "local_movies",
          title: "local movies"
        },
        {
          name: "local_offer",
          title: "local offer"
        },
        {
          name: "local_parking",
          title: "local parking"
        },
        {
          name: "local_pharmacy",
          title: "local pharmacy"
        },
        {
          name: "local_phone",
          title: "local phone"
        },
        {
          name: "local_pizza",
          title: "local pizza"
        },
        {
          name: "local_play",
          title: "local play"
        },
        {
          name: "local_post_office",
          title: "local post office"
        },
        {
          name: "local_printshop",
          title: "local printshop"
        },
        {
          name: "local_see",
          title: "local see"
        },
        {
          name: "local_shipping",
          title: "local shipping"
        },
        {
          name: "local_taxi",
          title: "local taxi"
        },
        {
          name: "map",
          title: "map"
        },
        {
          name: "my_location",
          title: "my location"
        },
        {
          name: "navigation",
          title: "navigation"
        },
        {
          name: "near_me",
          title: "near me"
        },
        {
          name: "person_pin",
          title: "person pin"
        },
        {
          name: "person_pin_circle",
          title: "person pin circle"
        },
        {
          name: "pin_drop",
          title: "pin drop"
        },
        {
          name: "place",
          title: "place"
        },
        {
          name: "rate_review",
          title: "rate review"
        },
        {
          name: "restaurant",
          title: "restaurant"
        },
        {
          name: "restaurant_menu",
          title: "restaurant menu"
        },
        {
          name: "satellite",
          title: "satellite"
        },
        {
          name: "store_mall_directory",
          title: "store mall directory"
        },
        {
          name: "streetview",
          title: "streetview"
        },
        {
          name: "subway",
          title: "subway"
        },
        {
          name: "terrain",
          title: "terrain"
        },
        {
          name: "traffic",
          title: "traffic"
        },
        {
          name: "train",
          title: "train"
        },
        {
          name: "tram",
          title: "tram"
        },
        {
          name: "transfer_within_a_station",
          title: "transfer within a station"
        },
        {
          name: "zoom_out_map",
          title: "zoom out map"
        },
        {
          name: "apps",
          title: "apps"
        },
        {
          name: "arrow_back",
          title: "arrow back"
        },
        {
          name: "arrow_downward",
          title: "arrow downward"
        },
        {
          name: "arrow_drop_down",
          title: "arrow drop down"
        },
        {
          name: "arrow_drop_down_circle",
          title: "arrow drop down circle"
        },
        {
          name: "arrow_drop_up",
          title: "arrow drop up"
        },
        {
          name: "arrow_forward",
          title: "arrow forward"
        },
        {
          name: "arrow_upward",
          title: "arrow upward"
        },
        {
          name: "cancel",
          title: "cancel"
        },
        {
          name: "check",
          title: "check"
        },
        {
          name: "chevron_left",
          title: "chevron left"
        },
        {
          name: "chevron_right",
          title: "chevron right"
        },
        {
          name: "close",
          title: "close"
        },
        {
          name: "expand_less",
          title: "expand less"
        },
        {
          name: "expand_more",
          title: "expand more"
        },
        {
          name: "first_page",
          title: "first page"
        },
        {
          name: "fullscreen",
          title: "fullscreen"
        },
        {
          name: "fullscreen_exit",
          title: "fullscreen exit"
        },
        {
          name: "last_page",
          title: "last page"
        },
        {
          name: "menu",
          title: "menu"
        },
        {
          name: "more_horiz",
          title: "more horiz"
        },
        {
          name: "more_vert",
          title: "more vert"
        },
        {
          name: "refresh",
          title: "refresh"
        },
        {
          name: "subdirectory_arrow_left",
          title: "subdirectory arrow left"
        },
        {
          name: "subdirectory_arrow_right",
          title: "subdirectory arrow right"
        },
        {
          name: "adb",
          title: "adb"
        },
        {
          name: "airline_seat_flat",
          title: "airline seat flat"
        },
        {
          name: "airline_seat_flat_angled",
          title: "airline seat flat angled"
        },
        {
          name: "airline_seat_individual_suite",
          title: "airline seat individual suite"
        },
        {
          name: "airline_seat_legroom_extra",
          title: "airline seat legroom extra"
        },
        {
          name: "airline_seat_legroom_normal",
          title: "airline seat legroom normal"
        },
        {
          name: "airline_seat_legroom_reduced",
          title: "airline seat legroom reduced"
        },
        {
          name: "airline_seat_recline_extra",
          title: "airline seat recline extra"
        },
        {
          name: "airline_seat_recline_normal",
          title: "airline seat recline normal"
        },
        {
          name: "bluetooth_audio",
          title: "bluetooth audio"
        },
        {
          name: "confirmation_number",
          title: "confirmation number"
        },
        {
          name: "disc_full",
          title: "disc full"
        },
        {
          name: "do_not_disturb",
          title: "do not disturb"
        },
        {
          name: "do_not_disturb_alt",
          title: "do not disturb alt"
        },
        {
          name: "do_not_disturb_off",
          title: "do not disturb off"
        },
        {
          name: "do_not_disturb_on",
          title: "do not disturb on"
        },
        {
          name: "drive_eta",
          title: "drive eta"
        },
        {
          name: "enhanced_encryption",
          title: "enhanced encryption"
        },
        {
          name: "event_available",
          title: "event available"
        },
        {
          name: "event_busy",
          title: "event busy"
        },
        {
          name: "event_note",
          title: "event note"
        },
        {
          name: "folder_special",
          title: "folder special"
        },
        {
          name: "live_tv",
          title: "live tv"
        },
        {
          name: "mms",
          title: "mms"
        },
        {
          name: "more",
          title: "more"
        },
        {
          name: "network_check",
          title: "network check"
        },
        {
          name: "network_locked",
          title: "network locked"
        },
        {
          name: "no_encryption",
          title: "no encryption"
        },
        {
          name: "ondemand_video",
          title: "ondemand video"
        },
        {
          name: "personal_video",
          title: "personal video"
        },
        {
          name: "phone_bluetooth_speaker",
          title: "phone bluetooth speaker"
        },
        {
          name: "phone_forwarded",
          title: "phone forwarded"
        },
        {
          name: "phone_in_talk",
          title: "phone in talk"
        },
        {
          name: "phone_locked",
          title: "phone locked"
        },
        {
          name: "phone_missed",
          title: "phone missed"
        },
        {
          name: "phone_paused",
          title: "phone paused"
        },
        {
          name: "power",
          title: "power"
        },
        {
          name: "priority_high",
          title: "priority high"
        },
        {
          name: "sd_card",
          title: "sd card"
        },
        {
          name: "sim_card_alert",
          title: "sim card alert"
        },
        {
          name: "sms",
          title: "sms"
        },
        {
          name: "sms_failed",
          title: "sms failed"
        },
        {
          name: "sync",
          title: "sync"
        },
        {
          name: "sync_disabled",
          title: "sync disabled"
        },
        {
          name: "sync_problem",
          title: "sync problem"
        },
        {
          name: "system_update",
          title: "system update"
        },
        {
          name: "tap_and_play",
          title: "tap and play"
        },
        {
          name: "time_to_leave",
          title: "time to leave"
        },
        {
          name: "vibration",
          title: "vibration"
        },
        {
          name: "voice_chat",
          title: "voice chat"
        },
        {
          name: "vpn_lock",
          title: "vpn lock"
        },
        {
          name: "wc",
          title: "wc"
        },
        {
          name: "wifi",
          title: "wifi"
        },
        {
          name: "ac_unit",
          title: "ac unit"
        },
        {
          name: "airport_shuttle",
          title: "airport shuttle"
        },
        {
          name: "all_inclusive",
          title: "all inclusive"
        },
        {
          name: "beach_access",
          title: "beach access"
        },
        {
          name: "business_center",
          title: "business center"
        },
        {
          name: "casino",
          title: "casino"
        },
        {
          name: "child_care",
          title: "child care"
        },
        {
          name: "child_friendly",
          title: "child friendly"
        },
        {
          name: "fitness_center",
          title: "fitness center"
        },
        {
          name: "free_breakfast",
          title: "free breakfast"
        },
        {
          name: "golf_course",
          title: "golf course"
        },
        {
          name: "hot_tub",
          title: "hot tub"
        },
        {
          name: "kitchen",
          title: "kitchen"
        },
        {
          name: "pool",
          title: "pool"
        },
        {
          name: "room_service",
          title: "room service"
        },
        {
          name: "rv_hookup",
          title: "rv hookup"
        },
        {
          name: "smoke_free",
          title: "smoke free"
        },
        {
          name: "smoking_rooms",
          title: "smoking rooms"
        },
        {
          name: "spa",
          title: "spa"
        },
        {
          name: "cake",
          title: "cake"
        },
        {
          name: "domain",
          title: "domain"
        },
        {
          name: "group",
          title: "group"
        },
        {
          name: "group_add",
          title: "group add"
        },
        {
          name: "location_city",
          title: "location city"
        },
        {
          name: "mood",
          title: "mood"
        },
        {
          name: "mood_bad",
          title: "mood bad"
        },
        {
          name: "notifications",
          title: "notifications"
        },
        {
          name: "notifications_active",
          title: "notifications active"
        },
        {
          name: "notifications_none",
          title: "notifications none"
        },
        {
          name: "notifications_off",
          title: "notifications off"
        },
        {
          name: "notifications_paused",
          title: "notifications paused"
        },
        {
          name: "pages",
          title: "pages"
        },
        {
          name: "party_mode",
          title: "party mode"
        },
        {
          name: "people",
          title: "people"
        },
        {
          name: "people_outline",
          title: "people outline"
        },
        {
          name: "person",
          title: "person"
        },
        {
          name: "person_add",
          title: "person add"
        },
        {
          name: "person_outline",
          title: "person outline"
        },
        {
          name: "plus_one",
          title: "plus one"
        },
        {
          name: "poll",
          title: "poll"
        },
        {
          name: "public",
          title: "public"
        },
        {
          name: "school",
          title: "school"
        },
        {
          name: "sentiment_dissatisfied",
          title: "sentiment dissatisfied"
        },
        {
          name: "sentiment_neutral",
          title: "sentiment neutral"
        },
        {
          name: "sentiment_satisfied",
          title: "sentiment satisfied"
        },
        {
          name: "sentiment_very_dissatisfied",
          title: "sentiment very dissatisfied"
        },
        {
          name: "sentiment_very_satisfied",
          title: "sentiment very satisfied"
        },
        {
          name: "share",
          title: "share"
        },
        {
          name: "whatshot",
          title: "whatshot"
        },
        {
          name: "check_box",
          title: "check box"
        },
        {
          name: "check_box_outline_blank",
          title: "check box outline blank"
        },
        {
          name: "indeterminate_check_box",
          title: "indeterminate check box"
        },
        {
          name: "radio_button_checked",
          title: "radio button checked"
        },
        {
          name: "radio_button_unchecked",
          title: "radio button unchecked"
        },
        {
          name: "star",
          title: "star"
        },
        {
          name: "star_border",
          title: "star border"
        },
        {
          name: "star_half",
          title: "star half"
        }
      ],
      searchIcon: "",
      tempIcon: ""
    };
  },
  validations: {
    tempMenu: {
      label: {
        required,
        maxLength: maxLength(15)
      },
      name: {
        required,
        maxLength: maxLength(15)
      }
    }
  },
  methods: {
    addMenu(type) {
      this.editingMenu = {};
      this.tempMenu = {};
      this.tempMenu.id = 0;
      if (type == 1) {
        this.selected = 0;
        this.tempMenu.parentId = 0;
      } else {
        this.tempMenu.parentId = this.selected;
      }
    },
    async init() {
      let menuListRes = await getAllMenu();
      let menuList = menuListRes.data.data;
      let reBuildMenuList = [];
      let forFn = function(menuList, newMenuList) {
        for (var item of menuList) {
          let menu = {
            id: item.id,
            parentId: item.parentId,
            label: item.title,
            name: item.name,
            path: item.path,
            icon: item.icon,
            leftMemu: item.leftMemu,
            functionCode: item.functionCode,
            isLock: item.isLock,
            sort: item.sort
          };
          menu.children = [];
          if (item.children && item.children.length > 0) {
            forFn(item.children, menu.children);
          }
          newMenuList.push(menu);
        }
      };
      forFn(menuList, reBuildMenuList);
      this.menuList = reBuildMenuList;
    },
    findMenuById(id) {
      let menu = {};
      let _this = this;
      let getMenu = function(menuList) {
        for (var item of menuList) {
          if (item.id === id) {
            _this.editingMenu = item; //正在编辑的菜单,引用原始菜单
            menu = Object.assign({}, item);
            menu.children = null;
            break;
          } else {
            if (item.children && item.children.length > 0) {
              getMenu(item.children);
            }
          }
        }
      };
      getMenu(this.menuList);
      return menu;
    },
    editMenu(id) {
      if (!id || this.tempMenu.id === id) {
        this.editingMenu = {};
        this.tempMenu = {
          id: 0,
          parentId: 0
        };
        return true;
      }
      let menu = this.findMenuById(id);
      this.tempMenu = menu;
    },
    async openIconModal() {
      if (this.iconList.length === 0) {
        let iconsRes = await getIcons();
        this.iconList = iconsRes.data.data;
      }
      this.tempIcon = this.tempMenu.icon;
      this.iconModal = true;
    },
    selectIcon() {
      this.tempMenu.icon = this.tempIcon;
      this.iconModal = false;
    },
    async saveMenu() {
      try {
        let menu = {
          id: this.tempMenu.id,
          parentId: this.tempMenu.parentId,
          title: this.tempMenu.label,
          name: this.tempMenu.name,
          path: this.tempMenu.path,
          icon: this.tempMenu.icon,
          leftMemu: this.tempMenu.leftMemu,
          functionCode: this.tempMenu.functionCode,
          isLock: this.tempMenu.isLock,
          sort: this.tempMenu.sort
        };
        await saveMenu(menu);
        this.editingMenu.id = this.tempMenu.id;
        this.editingMenu.parentId = this.tempMenu.parentId;
        this.editingMenu.label = this.tempMenu.label;
        this.editingMenu.name = this.tempMenu.name;
        this.editingMenu.path = this.tempMenu.path;
        this.editingMenu.icon = this.tempMenu.icon;
        this.editingMenu.leftMemu = this.tempMenu.leftMemu;
        this.editingMenu.functionCode = this.tempMenu.functionCode;
        this.editingMenu.isLock = this.tempMenu.isLock;
        this.editingMenu.sort = this.tempMenu.sort;
        this.$q.notify({
          type: "positive",
          message: this.$t("Saved successfully"),
          position: "bottom-right"
        });
      } catch (e) {}
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    selected(id) {
      this.editMenu(id);
    }
  }
};
</script>
<style scoped>
.padding-10 {
  padding: 10px;
}
.icon-view {
  padding: 5px;
  height: 50px;
  width: 50px;
}
</style>
