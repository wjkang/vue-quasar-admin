:::demo
```html
            <p class="caption">Examples of group buttons. Endless possibilities.</p>
            <q-btn-group push>
                <q-btn push label="First" icon="timeline"></q-btn>
                <q-btn push label="Second" icon="visibility"></q-btn>
                <q-btn push label="Third" icon="update"></q-btn>
            </q-btn-group>

            <br><br>
            <q-btn-group push>
                <q-btn color="yellow" glossy text-color="black" push label="First" icon="verified_user"></q-btn>
                <q-btn color="amber" glossy text-color="black" push label="Second"></q-btn>
                <q-btn color="orange" glossy text-color="black" push label="Third"></q-btn>
            </q-btn-group>

            <br><br>
            <q-btn-group outline>
                <q-btn outline color="brown" label="First"></q-btn>
                <q-btn outline color="brown" label="Second" icon-right="watch_later"></q-btn>
                <q-btn outline color="brown" label="Third"></q-btn>
            </q-btn-group>

            <br><br>
            <q-btn-group>
                <q-btn color="secondary" glossy label="First"></q-btn>
                <q-btn color="secondary" glossy label="Second"></q-btn>
                <q-btn color="secondary" glossy label="Third"></q-btn>
                <q-btn color="secondary" glossy label="Fourth"></q-btn>
            </q-btn-group>

            <br><br>
            <q-btn-group>
                <q-btn color="tertiary" icon="timeline"></q-btn>
                <q-btn color="tertiary" icon="visibility"></q-btn>
                <q-btn color="tertiary" icon="update"></q-btn>
            </q-btn-group>

            <br><br>
            <q-btn-group rounded>
                <q-btn color="amber" rounded glossy icon="timeline"></q-btn>
                <q-btn color="amber" rounded glossy icon="visibility"></q-btn>
                <q-btn color="amber" rounded glossy icon-right="update" label="Update"></q-btn>
            </q-btn-group>

            <br><br>
            <q-btn-group rounded>
                <q-btn rounded color="primary" label="One"></q-btn>
                <q-btn rounded color="primary" label="Two"></q-btn>
                <q-btn-dropdown rounded color="primary" label="Three" split>
                    <!-- dropdown content goes here -->
                    <q-list link>
                        <q-item v-close-overlay>
                            <q-item-side icon="folder" inverted color="primary"></q-item-side>
                            <q-item-main>
                                <q-item-tile label>Photos</q-item-tile>
                                <q-item-tile sublabel>February 22, 2016</q-item-tile>
                            </q-item-main>
                            <q-item-side right icon="info" color="amber"></q-item-side>
                        </q-item>
                        <q-item-separator inset></q-item-separator>
                        <q-list-header inset>Files</q-list-header>
                        <q-item v-close-overlay>
                            <q-item-side icon="assignment" inverted></q-item-side>
                            <q-item-main>
                                <q-item-tile label>Vacation</q-item-tile>
                                <q-item-tile sublabel>February 22, 2016</q-item-tile>
                            </q-item-main>
                            <q-item-side right icon="info" color="amber"></q-item-side>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </q-btn-group>
```
:::
