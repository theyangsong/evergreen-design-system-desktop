<script setup lang="ts">
import shared from '@/views/shared/showcase.module.css';
</script>

<template>
  <section :class="shared.section">
    <h2 :class="shared.sectionTitle">Workflows</h2>
    <p :class="shared.bodyText">
      可复用业务流程（Authentication、Verification、Transaction、Submission、Approval、Onboarding
      等）将在此落地。
    </p>
  </section>
</template>
