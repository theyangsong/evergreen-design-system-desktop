<script setup lang="ts">
import shared from '@/views/shared/showcase.module.css';
import styles from './ComponentDocLayout.module.css';
import type { DocPropRow } from './types';

defineProps<{
  propRows: DocPropRow[];
  eventRows?: DocPropRow[];
  slotRows?: DocPropRow[];
  propsSectionId?: string;
  showTitle?: boolean;
  /** When true, render tables only (section + title provided by parent). */
  bare?: boolean;
}>();
</script>

<template>
  <component
    :is="bare ? 'div' : 'section'"
    :id="bare ? undefined : propsSectionId"
    :class="bare ? styles.propsTablesBare : shared.section"
  >
    <h2 v-if="!bare && showTitle !== false" :class="shared.sectionTitle">Props</h2>
    <div :class="shared.tableWrap">
      <table :class="shared.table">
        <thead>
          <tr>
            <th scope="col">名称</th>
            <th scope="col">类型</th>
            <th scope="col">默认值</th>
            <th scope="col">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in propRows" :key="row.name">
            <td><span :class="styles.propName">{{ row.name }}</span></td>
            <td><span :class="styles.propType">{{ row.type }}</span></td>
            <td><span :class="shared.mono">{{ row.defaultValue }}</span></td>
            <td><span :class="shared.bodyText">{{ row.description }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-if="eventRows?.length">
      <h3 :class="styles.propGroupTitle">事件</h3>
      <div :class="shared.tableWrap">
        <table :class="shared.table">
          <thead>
            <tr>
              <th scope="col">名称</th>
              <th scope="col">类型</th>
              <th scope="col">默认值</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in eventRows" :key="row.name">
              <td><span :class="styles.propName">{{ row.name }}</span></td>
              <td><span :class="styles.propType">{{ row.type }}</span></td>
              <td><span :class="shared.mono">{{ row.defaultValue }}</span></td>
              <td><span :class="shared.bodyText">{{ row.description }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="slotRows?.length">
      <h3 :class="styles.propGroupTitle">插槽</h3>
      <div :class="shared.tableWrap">
        <table :class="shared.table">
          <thead>
            <tr>
              <th scope="col">名称</th>
              <th scope="col">类型</th>
              <th scope="col">默认值</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in slotRows" :key="row.name">
              <td><span :class="styles.propName">{{ row.name }}</span></td>
              <td><span :class="styles.propType">{{ row.type }}</span></td>
              <td><span :class="shared.mono">{{ row.defaultValue }}</span></td>
              <td><span :class="shared.bodyText">{{ row.description }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </component>
</template>
