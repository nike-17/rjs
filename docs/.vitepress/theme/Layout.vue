<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { site, frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.layout === 'landing'">
    <Content />
  </div>
  <DefaultTheme.Layout v-else />
</template>
