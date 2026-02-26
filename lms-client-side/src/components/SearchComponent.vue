<template>
  <div>
    <input
      type="text"
      class="form-control rounded-3"
      :class="customClass"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <i class="bi bi-search"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    }
  }
}
</script>
